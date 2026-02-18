use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct InstallResult {
    pub success: bool,
    pub message: String,
    pub output: String,
}

/// Install skills from a repository using `npx skills add`
pub fn install_skill(repo: &str, global: bool, skill_name: Option<&str>) -> InstallResult {
    let mut args = vec!["skills", "add", repo, "-y"];

    if global {
        args.push("-g");
    }

    if let Some(name) = skill_name {
        args.push("--skill");
        args.push(name);
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

    // Also add --all to remove from all agents
    args.push("--agent");
    args.push("*");

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
    let output = Command::new("npx")
        .arg("-y")
        .args(args)
        .output()
        .map_err(|e| format!("Failed to execute npx: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    if output.status.success() {
        Ok(if stdout.is_empty() { stderr } else { stdout })
    } else {
        Err(format!("Command failed: {}\n{}", stderr, stdout))
    }
}
