use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct InstallResult {
    pub success: bool,
    pub message: String,
    pub output: String,
}

/// Install skills from a repository using `npx skills add`
pub fn install_skill(
    repo: &str,
    global: bool,
    skill_name: Option<&str>,
    agents: Option<Vec<String>>,
) -> InstallResult {
    let mut args = vec!["skills", "add", repo, "-y"];

    if global {
        args.push("-g");
    }

    if let Some(name) = skill_name {
        args.push("--skill");
        args.push(name);
    }

    // Keep strings alive for &str references
    let agent_strs: Vec<String>;
    if let Some(agent_list) = agents {
        if !agent_list.is_empty() {
            agent_strs = agent_list;
            args.push("--agent");
            for agent in &agent_strs {
                args.push(agent);
            }
        } else {
            agent_strs = vec![];
        }
    } else {
        agent_strs = vec![];
    }

    match run_npx(&args) {
        Ok(output) => InstallResult {
            success: true,
            message: format!("Successfully installed skills from {}", repo),
            output,
        },
        Err(e) => InstallResult {
            success: false,
            message: format!("Failed to install: {}", e),
            output: String::new(),
        },
    }
}

/// Remove a skill using `npx skills remove`
pub fn remove_skill(name: &str, global: bool) -> InstallResult {
    let mut args = vec!["skills", "remove", name, "-y"];

    if global {
        args.push("-g");
    }

    match run_npx(&args) {
        Ok(output) => InstallResult {
            success: true,
            message: format!("Successfully removed skill: {}", name),
            output,
        },
        Err(e) => InstallResult {
            success: false,
            message: format!("Failed to remove: {}", e),
            output: String::new(),
        },
    }
}

/// List installed skills using `npx skills ls`
pub fn list_skills(global: bool) -> Result<String, String> {
    let mut args = vec!["skills", "ls"];
    if global {
        args.push("-g");
    }
    run_npx(&args)
}

/// Run an npx command and capture output
fn run_npx(args: &[&str]) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    let mut command = Command::new("cmd");
    #[cfg(target_os = "windows")]
    command.arg("/C").arg("npx").arg("-y").args(args);

    #[cfg(not(target_os = "windows"))]
    let mut command = Command::new("npx");
    #[cfg(not(target_os = "windows"))]
    command.arg("-y").args(args);

    let output = command.output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    if output.status.success() {
        Ok(if stdout.is_empty() { stderr } else { stdout })
    } else {
        Err(format!("Command failed (exit code {}):\n{}\n{}", 
            output.status.code().unwrap_or(-1), stderr, stdout))
    }
}
