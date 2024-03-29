extern crate dirs;

use std::env;

use crate::youtube::{create_playlists_from_dir, PlaylistItems};
use config::{ConfigError, Environment, File};
use log::info;
use rocket::fs::{FileServer, Options};

use serde::Deserialize;
use tokio::task;

use futures_util::{SinkExt, StreamExt};
// use log::*;
use std::net::SocketAddr;
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
  accept_async,
  tungstenite::{Error, Result},
};

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

enum MusicPlayerState {
  Playing,
  Paused,
  Stopped,
}

struct MusicPlayer {
  pub current_song: String,
  pub state: MusicPlayerState,
  pub time: i32,
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

async fn handle_connection(peer: SocketAddr, stream: TcpStream) -> Result<()> {
  let mut ws_stream = accept_async(stream).await.expect("Failed to accept");

  info!("New WebSocket connection: {}", peer);

  while let Some(msg) = ws_stream.next().await {
    let msg = msg?;
    info!("Received message: {:?}", msg);
    ws_stream.send(msg).await?;
    // if msg.is_text() || msg.is_binary() {
    //   ws_stream.send(msg).await?;
    // }
  }

  Ok(())
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

async fn accept_connection(peer: SocketAddr, stream: TcpStream) {
  if let Err(e) = handle_connection(peer, stream).await {
    match e {
      Error::ConnectionClosed | Error::Protocol(_) | Error::Utf8 => (),
      err => error!("Error processing connection: {}", err),
    }
  }
}
// #[get("/echo?stream")]
// fn echo_stream(ws: ws::WebSocket) -> ws::Stream!['static] {
//   ws::Stream! { ws =>
//       for await message in ws {
//           yield message?;
//       }
//   }
// }

async fn start_websocket_server(addr: &str) {
  // FIXME: Somehow not possible to put it into a function
  let listener = TcpListener::bind(&addr).await.expect("Can't listen");
  info!("Listening on: {}", addr);

  while let Ok((stream, _)) = listener.accept().await {
    let peer = stream
      .peer_addr()
      .expect("connected streams should have a peer address");
    info!("Peer address: {}", peer);
    println!("Something is here !!!!");

    tokio::spawn(accept_connection(peer, stream));
  }
}
#[tokio::main]
async fn main() {
  // TODO: when downloading the playlist, add a progress bar
  // match youtube::download_playlist().await {
  //   Ok(outout) => println!("Download was successful"),
  //   Err(e) => println!("Something went wrong {:?}", e),
  // };
  // let _ = env_logger::try_init();
  // env_logger::init();

  tokio::spawn(start_websocket_server("localhost:9002"));
  youtube::get_playlists_from_user().await;
  tokio::spawn(create_web_server());
  create_tauri_window().await;
}
