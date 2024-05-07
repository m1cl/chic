#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod authentication_manager;
mod discogs;
mod youtube;

use rocket::fs::{FileServer, Options};
use rocket::get;
use rocket::routes;
use rocket::tokio::task;
use youtube::create_playlists_from_dir;
use youtube::PlaylistItems;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[tokio::main]
async fn main() {
    app_lib::run();
    create_web_server().await;
}

#[tauri::command]
#[get("/playlists")]
async fn get_playlists() -> String {
    println!("Starting getting directory items");
    let playlists: Vec<PlaylistItems> = create_playlists_from_dir();
    serde_json::to_string(&playlists).unwrap()
}

async fn create_web_server() {
    task::spawn(
        rocket::build()
            .mount(
                "/music/chic",
                FileServer::new("chic", Options::Index | Options::DotFiles),
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
