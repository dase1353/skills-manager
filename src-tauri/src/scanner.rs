use std::fs;
use std::path::{Path, PathBuf};
use crate::db::{Database, Skill};
use crate::parser;

/// Scan a directory for skills and sync them to the database
pub fn scan_directory(db: &Database, scan_path: &Path, scope: &str) -> Result<Vec<Skill>, String> {
    let mut skills = Vec::new();

    if !scan_path.exists() {
        return Ok(skills);
    }

    let entries = fs::read_dir(scan_path)
        .map_err(|e| format!("Failed to read directory {}: {}", scan_path.display(), e))?;

    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        let skill_md_path = path.join("SKILL.md");
        if !skill_md_path.exists() {
            continue;
        }

        let content = fs::read_to_string(&skill_md_path)
            .unwrap_or_default();

        let meta = parser::parse_skill_md(&content);

        let skill_name = if meta.name.is_empty() {
            path.file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string()
        } else {
            meta.name
        };

        // Detect linked agents by checking symlinks
        let agents = detect_agents(&skill_name);

        let skill = Skill {
            id: None,
            name: skill_name,
            description: meta.description,
            author: meta.author,
            version: meta.version,
            license: meta.license,
            source_repo: String::new(),
            install_path: path.to_string_lossy().to_string(),
            scope: scope.to_string(),
            installed_at: String::new(),
            updated_at: String::new(),
            agents,
            security: vec![],
        };

        // Upsert to database
        db.upsert_skill(&skill)?;
        skills.push(skill);
    }

    Ok(skills)
}

/// Detect which agents a skill is linked to by checking known agent directories
fn detect_agents(skill_name: &str) -> Vec<String> {
    let mut agents = Vec::new();
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => return agents,
    };

    // Known agent skill directories
    let agent_paths: Vec<(&str, PathBuf)> = vec![
        ("Antigravity", home.join(".gemini").join("antigravity").join("skills")),
        ("Claude Code", home.join(".claude").join("skills")),
        ("Cursor", home.join(".cursor").join("skills")),
        ("Augment", home.join(".augment").join("skills")),
        ("Cline", home.join(".cline").join("skills")),
        ("Windsurf", home.join(".windsurf").join("skills")),
        ("Copilot", home.join(".github").join("skills")),
        ("Gemini CLI", home.join(".gemini").join("skills")),
    ];

    for (agent_name, agent_path) in agent_paths {
        let skill_in_agent = agent_path.join(skill_name);
        if skill_in_agent.exists() {
            agents.push(agent_name.to_string());
        }
    }

    // Check universal .agents directory
    let universal = home.join(".agents").join("skills").join(skill_name);
    if universal.exists() && agents.is_empty() {
        agents.push("Universal (via .agents)".to_string());
    }

    agents
}

/// Get default scan paths
pub fn get_default_scan_paths() -> Vec<PathBuf> {
    let mut paths = Vec::new();
    if let Some(home) = dirs::home_dir() {
        paths.push(home.join(".agents").join("skills"));
    }
    paths
}
