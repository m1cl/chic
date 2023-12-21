extern crate dirs;

use std::env;
use std::future;
use tokio::net::TcpStream;

use crate::youtube::{create_playlists_from_dir, PlaylistItems};
use config::{ConfigError, Environment, File};
use log::info;
use rocket::fs::{FileServer, Options};

use serde::Deserialize;
use tokio::net::{TcpListener, TcpStream};
use tokio::task;

#[macro_use]
extern crate rocket;

mod discogs;
mod music_player;
mod youtube;

pub static CHIC_CONFIG_DIR: &'static str = "~/.config/chic/";
pub static mut DISCOGS_USER: &'static str = "";
pub static mut YOUTUBE_USER: &'static str = "";

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
    let mut s = config::Config::new();
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

async fn start_webtransport(stream: TcpStream) {
  let addr = stream.peer_addr().expect("failed to get peer address");
  info!("Peer add {}", addr);

  let ws_stream = tokio_tungstenite::accept_async(stream)
    .await
    .expect("Failed to accept");

  info!("WebSocket connection established: {}", addr);

  let (write, read) = ws_stream.split();

  read
    .try_for_each(|msg| async { future::ready(msg.is_text()) || msg.is_binary() })
    .forward(write)
    .await
    .expect("Failed to forward message");
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

// TODO: Create user dialog for configuration
// https://tauri.app/v1/guides/features/multiwindow/
//
async fn create_tauri_window() {
  tauri::Builder::default()
    .plugin(tauri_plugin_websocket::init())
    .invoke_handler(tauri::generate_handler![
      music_player::play_song,
      discogs::get_want_list_information,
      youtube::get_youtube_search_results,
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
  // TODO: when downloading the playlist, add a progress bar
  // match youtube::download_playlist().await {
  //   Ok(outout) => println!("Download was successful"),
  //   Err(e) => println!("Something went wrong {:?}", e),
  // };
  let _ = env_logger::try_init();
  let addr = env::args()
    .nth(1)
    .unwrap_or_else(|| "127.0.0.1:8080".to_string());

  // Create the event loop and TCP listener we'll accept connections on.
  let try_socket = TcpListener::bind(&addr).await;
  let listener = try_socket.expect("Failed to bind");
  info!("Listening on: {}", addr);

  while let Ok((stream, _)) = listener.accept().await {
    tokio::spawn(accept_connection(stream));
  }

  youtube::get_playlists_from_user().await;
  tokio::spawn(create_web_server());
  create_tauri_window().await;
}
