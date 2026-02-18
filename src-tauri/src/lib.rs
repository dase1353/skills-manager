mod db;
mod parser;
mod scanner;
mod installer;
mod commands;

use db::Database;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let database = Database::new().expect("Failed to initialize database");

    tauri::Builder::default()
        .manage(database)
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::scan_skills,
            commands::get_all_skills,
            commands::get_skill_detail,
            commands::get_stats,
            commands::install_skill_from_repo,
            commands::remove_skill_cmd,
            commands::get_scan_paths,
            commands::check_skills_cli,
            commands::open_path,
            commands::get_agent_settings,
            commands::update_agent_setting,
            commands::reset_default_agents,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
