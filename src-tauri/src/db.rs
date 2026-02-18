use rusqlite::{Connection, params};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Skill {
    pub id: Option<i64>,
    pub name: String,
    pub description: String,
    pub author: String,
    pub version: String,
    pub license: String,
    pub source_repo: String,
    pub install_path: String,
    pub scope: String,
    pub installed_at: String,
    pub updated_at: String,
    pub agents: Vec<String>,
    pub security: Vec<SecurityAssessment>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SecurityAssessment {
    pub provider: String,
    pub level: String,
    pub alerts: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScanPath {
    pub id: Option<i64>,
    pub path: String,
    pub path_type: String,
}

pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new() -> Result<Self, String> {
        let db_path = Self::get_db_path()?;

        // Ensure parent directory exists
        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create database directory: {}", e))?;
        }

        let conn = Connection::open(&db_path)
            .map_err(|e| format!("Failed to open database: {}", e))?;

        let db = Database {
            conn: Mutex::new(conn),
        };
        db.initialize()?;
        Ok(db)
    }

    fn get_db_path() -> Result<PathBuf, String> {
        let home = dirs::home_dir().ok_or("Could not determine home directory")?;
        Ok(home.join(".skills-manager").join("skills.db"))
    }

    fn initialize(&self) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS skills (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                name         TEXT NOT NULL UNIQUE,
                description  TEXT DEFAULT '',
                author       TEXT DEFAULT '',
                version      TEXT DEFAULT '',
                license      TEXT DEFAULT '',
                source_repo  TEXT DEFAULT '',
                install_path TEXT NOT NULL,
                scope        TEXT DEFAULT 'global',
                installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS skill_agents (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
                agent    TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS security_assessments (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
                provider TEXT NOT NULL,
                level    TEXT NOT NULL,
                alerts   INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS scan_paths (
                id   INTEGER PRIMARY KEY AUTOINCREMENT,
                path TEXT NOT NULL UNIQUE,
                type TEXT DEFAULT 'global'
            );
            "
        ).map_err(|e| format!("Failed to initialize database: {}", e))?;

        // Insert default scan paths
        conn.execute(
            "INSERT OR IGNORE INTO scan_paths (path, type) VALUES (?1, 'global')",
            params![dirs::home_dir().unwrap().join(".agents").join("skills").to_string_lossy().to_string()],
        ).ok();

        Ok(())
    }

    pub fn upsert_skill(&self, skill: &Skill) -> Result<i64, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;

        conn.execute(
            "INSERT INTO skills (name, description, author, version, license, source_repo, install_path, scope, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, CURRENT_TIMESTAMP)
             ON CONFLICT(name) DO UPDATE SET
                description = excluded.description,
                author = excluded.author,
                version = excluded.version,
                license = excluded.license,
                source_repo = excluded.source_repo,
                install_path = excluded.install_path,
                scope = excluded.scope,
                updated_at = CURRENT_TIMESTAMP",
            params![
                skill.name, skill.description, skill.author, skill.version,
                skill.license, skill.source_repo, skill.install_path, skill.scope
            ],
        ).map_err(|e| format!("Failed to upsert skill: {}", e))?;

        let skill_id: i64 = conn.query_row(
            "SELECT id FROM skills WHERE name = ?1",
            params![skill.name],
            |row| row.get(0),
        ).map_err(|e| format!("Failed to get skill id: {}", e))?;

        // Update agents
        conn.execute("DELETE FROM skill_agents WHERE skill_id = ?1", params![skill_id]).ok();
        for agent in &skill.agents {
            conn.execute(
                "INSERT INTO skill_agents (skill_id, agent) VALUES (?1, ?2)",
                params![skill_id, agent],
            ).ok();
        }

        // Update security assessments
        conn.execute("DELETE FROM security_assessments WHERE skill_id = ?1", params![skill_id]).ok();
        for sec in &skill.security {
            conn.execute(
                "INSERT INTO security_assessments (skill_id, provider, level, alerts) VALUES (?1, ?2, ?3, ?4)",
                params![skill_id, sec.provider, sec.level, sec.alerts],
            ).ok();
        }

        Ok(skill_id)
    }

    pub fn get_all_skills(&self) -> Result<Vec<Skill>, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        let mut stmt = conn.prepare(
            "SELECT id, name, description, author, version, license, source_repo, install_path, scope, installed_at, updated_at FROM skills ORDER BY name"
        ).map_err(|e| format!("Failed to prepare query: {}", e))?;

        let skills: Vec<Skill> = stmt.query_map([], |row| {
            Ok(Skill {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                author: row.get(3)?,
                version: row.get(4)?,
                license: row.get(5)?,
                source_repo: row.get(6)?,
                install_path: row.get(7)?,
                scope: row.get(8)?,
                installed_at: row.get(9)?,
                updated_at: row.get(10)?,
                agents: vec![],
                security: vec![],
            })
        }).map_err(|e| format!("Failed to query skills: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        // Populate agents and security for each skill
        let mut result = Vec::new();
        for mut skill in skills {
            if let Some(id) = skill.id {
                skill.agents = Self::get_agents_for_skill(&conn, id);
                skill.security = Self::get_security_for_skill(&conn, id);
            }
            result.push(skill);
        }

        Ok(result)
    }

    pub fn get_skill_by_name(&self, name: &str) -> Result<Option<Skill>, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        let mut stmt = conn.prepare(
            "SELECT id, name, description, author, version, license, source_repo, install_path, scope, installed_at, updated_at FROM skills WHERE name = ?1"
        ).map_err(|e| format!("Failed to prepare query: {}", e))?;

        let skill = stmt.query_row(params![name], |row| {
            Ok(Skill {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                author: row.get(3)?,
                version: row.get(4)?,
                license: row.get(5)?,
                source_repo: row.get(6)?,
                install_path: row.get(7)?,
                scope: row.get(8)?,
                installed_at: row.get(9)?,
                updated_at: row.get(10)?,
                agents: vec![],
                security: vec![],
            })
        }).ok();

        if let Some(mut s) = skill {
            if let Some(id) = s.id {
                s.agents = Self::get_agents_for_skill(&conn, id);
                s.security = Self::get_security_for_skill(&conn, id);
            }
            Ok(Some(s))
        } else {
            Ok(None)
        }
    }

    pub fn delete_skill(&self, name: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        conn.execute("DELETE FROM skills WHERE name = ?1", params![name])
            .map_err(|e| format!("Failed to delete skill: {}", e))?;
        Ok(())
    }

    pub fn get_scan_paths(&self) -> Result<Vec<ScanPath>, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;
        let mut stmt = conn.prepare("SELECT id, path, type FROM scan_paths")
            .map_err(|e| format!("Failed to prepare query: {}", e))?;

        let paths: Vec<ScanPath> = stmt.query_map([], |row| {
            Ok(ScanPath {
                id: row.get(0)?,
                path: row.get(1)?,
                path_type: row.get(2)?,
            })
        }).map_err(|e| format!("Failed to query scan paths: {}", e))?
        .filter_map(|r| r.ok())
        .collect();

        Ok(paths)
    }

    pub fn get_stats(&self) -> Result<serde_json::Value, String> {
        let conn = self.conn.lock().map_err(|e| e.to_string())?;

        let total: i64 = conn.query_row("SELECT COUNT(*) FROM skills", [], |row| row.get(0))
            .unwrap_or(0);
        let global: i64 = conn.query_row("SELECT COUNT(*) FROM skills WHERE scope = 'global'", [], |row| row.get(0))
            .unwrap_or(0);
        let project: i64 = conn.query_row("SELECT COUNT(*) FROM skills WHERE scope = 'project'", [], |row| row.get(0))
            .unwrap_or(0);
        let agents: i64 = conn.query_row("SELECT COUNT(DISTINCT agent) FROM skill_agents", [], |row| row.get(0))
            .unwrap_or(0);

        Ok(serde_json::json!({
            "total": total,
            "global": global,
            "project": project,
            "agents": agents
        }))
    }

    fn get_agents_for_skill(conn: &Connection, skill_id: i64) -> Vec<String> {
        let mut stmt = conn.prepare("SELECT agent FROM skill_agents WHERE skill_id = ?1")
            .unwrap();
        stmt.query_map(params![skill_id], |row| row.get(0))
            .unwrap()
            .filter_map(|r| r.ok())
            .collect()
    }

    fn get_security_for_skill(conn: &Connection, skill_id: i64) -> Vec<SecurityAssessment> {
        let mut stmt = conn.prepare("SELECT provider, level, alerts FROM security_assessments WHERE skill_id = ?1")
            .unwrap();
        stmt.query_map(params![skill_id], |row| {
            Ok(SecurityAssessment {
                provider: row.get(0)?,
                level: row.get(1)?,
                alerts: row.get(2)?,
            })
        }).unwrap()
        .filter_map(|r| r.ok())
        .collect()
    }
}
