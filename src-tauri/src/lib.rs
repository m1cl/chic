use crate::youtube::CHIC_CONFIG_DIR;
use rocket::fs::FileServer;
use rocket::fs::Options;
use rocket::get;
use rocket::routes;
use tauri::generate_handler;
use tokio::task;
use youtube::{create_playlists_from_dir, download_playlist, PlaylistItems};
mod authentication_manager;
mod discogs;
mod youtube;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    download_playlist().await;
    create_web_server().await;
    let _ = download_playlist().await;
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(generate_handler![get_playlists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
#[get("/playlists")]
async fn get_playlists() -> Result<String, String> {
    println!("Starting getting directory items");
    let playlists: Vec<PlaylistItems> = create_playlists_from_dir();
    match serde_json::to_string(&playlists) {
        Ok(json) => Ok(json),
        Err(e) => Err(e.to_string()),
    }
}

async fn create_web_server() {
    task::spawn(
        rocket::build()
            .mount(
                "/music/chic",
                FileServer::new(CHIC_CONFIG_DIR.clone(), Options::Index | Options::DotFiles),
            )
            .mount(
                "/api",
                routes![
                    youtube::get_youtube_search_results,
                    discogs::get_want_list_information,
                    get_playlists
                ],
            )
            .launch(),
    );
}
