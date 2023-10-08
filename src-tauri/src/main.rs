extern crate dirs;
use config::{Config, ConfigError, Environment, File};
use crate::youtube::{create_playlists_from_dir, PlaylistItems};
use rocket::fs::{FileServer, Options};
use serde::Deserialize;

use tokio::task;

#[macro_use]
extern crate rocket;

mod discogs;
mod music_player;
mod youtube;

pub static CHIC_CONFIG_DIR: &'static str = "~/.config/chic/";
pub static mut DISCOGS_USER: String = String::from("");
pub static mut YOUTUBE_USER: String = String::from("");

#[derive(Debug, Deserialize, Clone)]
pub struct Log {
    pub level: String,
}
#[derive(Debug, Deserialize, Clone)]
pub struct Settings {
    pub log: Log,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let env = std::env::var("RUN_ENV").unwrap_or_else(|_| "Development".into());
        let mut s = Config::new();
        s.set("env", env.clone())?;

        s.merge(File::with_name(CHIC_CONFIG_DIR))?;
        // s.merge(File::with_name(&format!("{}{}", CONFIG_FILE_PREFIX, env)))?;

        // This makes it so "EA_SERVER__PORT overrides server.port
        s.merge(Environment::with_prefix("ea").separator("__"))?;

        s.try_into()
    }
}

//     src: string;
//     id: number;
//     name?: string | ReactNode;
//     writer?: string | ReactNode;
//     img?: string;
//     description?: string | ReactNode;
//     customTrackInfo?: string | ReactNode;

async fn create_web_server() {
  task::spawn(
    rocket::build()
      .mount(
        "/music/chic",
        FileServer::new("chic", Options::Index | Options::DotFiles),
      )
      .mount(
        "/api",
        routes![discogs::get_want_list_information, get_playlists],
      )
      .launch(),
  );
}

async fn create_tauri_window() {
  tauri::Builder::default()
    // .plugin(TauriWebsocket::default())
    .invoke_handler(tauri::generate_handler![
      music_player::play_song,
      discogs::get_want_list_information,
      get_playlists,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
#[get("/player/playlists")]
async fn get_playlists() -> String {
  println!("Starting getting directory items");
  let playlists: Vec<PlaylistItems> = create_playlists_from_dir();
  serde_json::to_string(&playlists).unwrap()
}
// TODO: send the authorize_url via websocket to the frontend and render it in a modal to signup
// the user
#[tokio::main]
async fn main() {
  // youtube::download_playlist().await;
  // youtube::get_playlists_from_user().await;
  tokio::spawn(create_web_server());
  create_tauri_window().await;
}
