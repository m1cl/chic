extern crate dirs;
use rocket::fs::{FileServer, Options};
use serde::Serialize;
use std::{error::Error, ffi::OsString};
use walkdir::{DirEntry, WalkDir};
use youtube_dl::{download_yt_dlp, YoutubeDl};

use futures_util::{SinkExt, StreamExt};
// use tauri_plugin_sql::{Migration, TauriSql};
use tokio::task;

use tokio::net::{TcpListener, TcpStream};

// use tauri_plugin_websocket::TauriWebsocket;
use tungstenite::Message;

#[macro_use]
extern crate rocket;

mod discogs;
mod music_player;
mod youtube;

static CHIC_CONFIG_DIR: &'static str = "~/.config/chic/";

//     src: string;
//     id: number;
//     name?: string | ReactNode;
//     writer?: string | ReactNode;
//     img?: string;
//     description?: string | ReactNode;
//     customTrackInfo?: string | ReactNode;

#[derive(Default, Serialize)]
struct PlaylistItems {
  name: String,
  playlist: String,
  writer: String,
  img: String,
  src: String,
  id: String,
}

fn get_playlist_name(entry: &DirEntry) -> String {
  entry
    .path()
    .to_str()
    .unwrap()
    .split("/")
    .take(2)
    .last()
    .unwrap()
    .to_string()
}

fn create_playlists_from_dir() -> Vec<PlaylistItems> {
  let mut id = 1;
  let mut playlists: Vec<PlaylistItems> = Vec::new();
  for entry in WalkDir::new("chic/")
    .follow_links(true)
    .into_iter()
    .filter_map(|e| e.ok())
  {
    let path = entry.path().to_string_lossy();
    let playlist_name = get_playlist_name(&entry);
    println!("{}", playlist_name);
    let url = "http://localhost:8000/music/";
    let f_name = entry.file_name().to_string_lossy().to_string();
    let src = format!("{}{}", url, path);
    // let img = format!("{}album.png", url);
    if f_name.ends_with(".mp3") {
      playlists.push(PlaylistItems {
        name: f_name.clone(),
        playlist: playlist_name.clone(),
        writer: playlist_name.clone(),
        img: "https://vinyl-records.nl/thrash-metal/photo-gallery/hellbastard/HELLBASTARD---NATURAL-ORDER-8672.jpg".into(),
        src,
        id: id.to_string(),
      });
      id = id + 1;
    }
  }
  playlists
}
#[get("/player/playlists")]
async fn get_playlists() -> String {
  println!("Starting getting directory items");
  let playlists: Vec<PlaylistItems> = create_playlists_from_dir();
  serde_json::to_string(&playlists).unwrap()
}

#[tauri::command]
async fn playlist() -> String {
  let playlists = create_playlists_from_dir();
  serde_json::to_string(&playlists).unwrap()
}

#[get("/discogs/get_want_list/<username>")]
async fn get_wantlist(username: String) -> String {
  let result = discogs::get_want_list_information(username).await;
  result
}

async fn create_web_server() {
  task::spawn(
    rocket::build()
      .mount(
        "/music/chic",
        FileServer::new("chic", Options::Index | Options::DotFiles),
      )
      .mount("/api", routes![get_wantlist, get_playlists])
      .launch(),
  );
}

async fn accept_connection(stream: TcpStream) {
  let ws_stream = tokio_tungstenite::accept_async(stream)
    .await
    .expect("Error during the weboscket handshare occured");

  let (mut write, read) = ws_stream.split();

  write
    .send(Message::Text("ahah what is going on?".to_string()))
    .await
    .expect("Something went wrong, babe");

  read
    .forward(write)
    .await
    .expect("failed to forward message")
}

async fn websocket_server() {
  let ws_addr = "127.0.0.1:9002";
  let try_socket = TcpListener::bind(&ws_addr).await;
  let listener = try_socket.expect("Failed to bind");

  info!("Listening on: {}", ws_addr);

  while let Ok((stream, _)) = listener.accept().await {
    tokio::spawn(accept_connection(stream));
  }
}

async fn download_playlist() -> Result<(), Box<dyn Error>> {
  let yt_dlp_path = download_yt_dlp(CHIC_CONFIG_DIR).await?;
  let output = YoutubeDl::new("https://www.youtube.com/channel/UCutUJrVebur4VvGimDaW3Rw/playlists")
    .download(true)
    .flat_playlist(true)
    .extract_audio(true)
    .output_directory(CHIC_CONFIG_DIR)
    .youtube_dl_path(yt_dlp_path)
    .run_async()
    .await?;
  let title = output.into_single_video().unwrap().title;
  println!("Video title: {}", title);
  Ok(())
}
async fn create_tauri_window() {
  tauri::Builder::default()
    // .plugin(TauriWebsocket::default())
    .invoke_handler(tauri::generate_handler![
      music_player::play_song,
      discogs::get_want_list_information,
      playlist,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
// TODO: send the authorize_url via websocket to the frontend and render it in a modal to signup
// the user
#[tokio::main]
async fn main() {
  // download_playlist().await;
  tauri::async_runtime::spawn(websocket_server());
  // youtube::get_playlists_from_user().await;
  tokio::spawn(create_web_server());
  create_tauri_window().await;
}
