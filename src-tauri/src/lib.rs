use rocket::fs::{FileServer, Options};
use rocket::get;
use rocket::routes;
use rocket::tokio::task;
use tauri::generate_handler;
use youtube::{create_playlists_from_dir, PlaylistItems, CHIC_CONFIG_DIR};
mod authentication_manager;
mod discogs;
mod youtube;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
