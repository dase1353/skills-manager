use std::fs;
use std::path::Path;

#[derive(Debug, Clone)]
pub struct SkillMetadata {
    pub name: String,
    pub description: String,
    pub author: String,
    pub version: String,
    pub license: String,
}

/// Parse YAML frontmatter from SKILL.md content
pub fn parse_skill_md(content: &str) -> SkillMetadata {
    let mut name = String::new();
    let mut description = String::new();
    let mut author = String::new();
    let mut version = String::new();
    let mut license = String::new();

    // Check if content starts with YAML frontmatter
    if content.starts_with("---") {
        if let Some(end_idx) = content[3..].find("---") {
            let frontmatter = &content[3..end_idx + 3];
            for line in frontmatter.lines() {
                let line = line.trim();
                if let Some((key, val)) = line.split_once(':') {
                    let key = key.trim();
                    let val = val.trim().trim_matches('\'').trim_matches('"');
                    match key {
                        "name" => name = val.to_string(),
                        "description" => description = val.to_string(),
                        "license" => license = val.to_string(),
                        "version" => version = val.to_string(),
                        _ => {}
                    }
                }
            }

            // Check for nested metadata.author and metadata.version
            let mut in_metadata = false;
            for line in frontmatter.lines() {
                let trimmed = line.trim();
                if trimmed == "metadata:" {
                    in_metadata = true;
                    continue;
                }
                if in_metadata {
                    if !line.starts_with(' ') && !line.starts_with('\t') {
                        in_metadata = false;
                        continue;
                    }
                    if let Some((key, val)) = trimmed.split_once(':') {
                        let key = key.trim();
                        let val = val.trim().trim_matches('\'').trim_matches('"');
                        match key {
                            "author" => author = val.to_string(),
                            "version" => {
                                if version.is_empty() {
                                    version = val.to_string();
                                }
                            }
                            _ => {}
                        }
                    }
                }
            }
        }
    }

    // If name is still empty, try to extract from first heading
    if name.is_empty() {
        for line in content.lines() {
            let trimmed = line.trim();
            if trimmed.starts_with("# ") {
                name = trimmed[2..].trim().to_string();
                break;
            }
        }
    }

    SkillMetadata {
        name,
        description,
        author,
        version,
        license,
    }
}

/// Read full SKILL.md content from a skill directory
pub fn read_skill_md(skill_path: &Path) -> Option<String> {
    let skill_md = skill_path.join("SKILL.md");
    if skill_md.exists() {
        fs::read_to_string(&skill_md).ok()
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_frontmatter() {
        let content = r#"---
name: angular-component
description: Create modern Angular standalone components
license: MIT
metadata:
  author: AnalogJS
  version: '1.0'
---
# Angular Component
"#;
        let meta = parse_skill_md(content);
        assert_eq!(meta.name, "angular-component");
        assert_eq!(meta.author, "AnalogJS");
        assert_eq!(meta.license, "MIT");
    }
}
