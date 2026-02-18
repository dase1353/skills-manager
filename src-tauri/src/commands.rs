use std::path::PathBuf;
use tauri::State;
use crate::db::{Database, Skill};
use crate::scanner;
use crate::installer;
use crate::parser;

// ──── Scan ────

#[tauri::command]
pub fn scan_skills(db: State<'_, Database>) -> Result<Vec<Skill>, String> {
    let scan_paths = db.get_scan_paths()?;
    let mut all_skills = Vec::new();

    for sp in &scan_paths {
        let path = PathBuf::from(&sp.path);
        let skills = scanner::scan_directory(&db, &path, &sp.path_type)?;
        all_skills.extend(skills);
    }

    // Also scan default paths if not already in list
    let defaults = scanner::get_default_scan_paths();
    for default_path in defaults {
        let already = scan_paths.iter().any(|sp| sp.path == default_path.to_string_lossy());
        if !already && default_path.exists() {
            let skills = scanner::scan_directory(&db, &default_path, "global")?;
            all_skills.extend(skills);
        }
    }

    Ok(all_skills)
}

// ──── CRUD ────

#[tauri::command]
pub fn get_all_skills(db: State<'_, Database>) -> Result<Vec<Skill>, String> {
    db.get_all_skills()
}

#[tauri::command]
pub fn get_skill_detail(db: State<'_, Database>, name: String) -> Result<serde_json::Value, String> {
    let skill = db.get_skill_by_name(&name)?
        .ok_or_else(|| format!("Skill '{}' not found", name))?;

    // Read the SKILL.md content
    let md_content = parser::read_skill_md(&std::path::Path::new(&skill.install_path))
        .unwrap_or_else(|| "No SKILL.md content found.".to_string());

    Ok(serde_json::json!({
        "skill": skill,
        "markdown": md_content
    }))
}

#[tauri::command]
pub fn get_stats(db: State<'_, Database>) -> Result<serde_json::Value, String> {
    db.get_stats()
}

// ──── Install / Remove ────

#[tauri::command]
pub fn install_skill_from_repo(
    db: State<'_, Database>,
    repo: String,
    global: bool,
    skill_name: Option<String>,
) -> Result<installer::InstallResult, String> {
    let result = installer::install_skill(
        &repo,
        global,
        skill_name.as_deref(),
    );

    // Re-scan after install to pick up new skills
    if result.success {
        let _ = scan_skills_internal(&db);
    }

    Ok(result)
}

#[tauri::command]
pub fn remove_skill_cmd(
    db: State<'_, Database>,
    name: String,
    global: bool,
) -> Result<installer::InstallResult, String> {
    let result = installer::remove_skill(&name, global);

    if result.success {
        db.delete_skill(&name)?;
    }

    Ok(result)
}

// ──── Settings ────

#[tauri::command]
pub fn get_scan_paths(db: State<'_, Database>) -> Result<Vec<crate::db::ScanPath>, String> {
    db.get_scan_paths()
}

// ──── CLI Check ────

#[tauri::command]
pub fn check_skills_cli() -> Result<bool, String> {
    match std::process::Command::new("npx")
        .args(["skills", "--version"])
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null())
        .status()
    {
        Ok(status) => Ok(status.success()),
        Err(_) => Ok(false),
    }
}

// ──── Helpers ────

fn scan_skills_internal(db: &Database) -> Result<(), String> {
    let scan_paths = db.get_scan_paths()?;
    for sp in &scan_paths {
        let path = PathBuf::from(&sp.path);
        scanner::scan_directory(db, &path, &sp.path_type)?;
    }
    let defaults = scanner::get_default_scan_paths();
    for default_path in defaults {
        if default_path.exists() {
            scanner::scan_directory(db, &default_path, "global")?;
        }
    }
    Ok(())
}

