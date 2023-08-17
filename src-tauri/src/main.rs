extern crate dirs;
use rocket::fs::FileServer;
use serde::Serialize;
use std::{
  error::Error,
  ffi::OsString,
  fs::{self},
  io::BufRead,
  path::PathBuf,
  process::Command,
};
use youtube_dl::{download_yt_dlp, YoutubeDl};
use ytd_rs::{Arg, YoutubeDL};

use futures_util::{stream::SplitSink, SinkExt, StreamExt};
// use tauri_plugin_sql::{Migration, TauriSql};
use tokio::task;

use rusty_ytdl::{Video, VideoOptions};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::WebSocketStream;
// use tauri_plugin_websocket::TauriWebsocket;
use tungstenite::Message;

#[macro_use]
extern crate rocket;

mod discogs;
mod music_player;
mod youtube;

// TODO: use ~ instead
static CHIC_CONFIG_DIR: &'static str = "/Users/m1cl/.config/chic/";

#[derive(Default, Serialize)]
struct PlaylistItem {
  name: String,
  writer: String,
  img: String,
  src: String,
  id: String,
}

fn get_ext(file_name: &OsString) -> String {
  let ext = file_name.to_str().unwrap().to_string();
  let ext = ext.split(".").last().unwrap().to_string();
  println!("the ext {}", ext);
  ext
}

// INFO: <--- next step
#[get("/player/playlist_items")]
async fn playlist_items() -> String {
  println!("Starting getting directory items");
  let mut list: Vec<PlaylistItem> = Vec::new();
  let i = 1;
  for file in fs::read_dir(CHIC_CONFIG_DIR).unwrap() {
    let file = file.unwrap();
    let file_name = file.file_name();
    let ext = get_ext(&file_name);
    println!("LOL");
    if ext == "wav" {
      let src = file.path().to_str().unwrap().to_string();
      let name = file_name.clone().into_string().unwrap();
      let url = "http://localhost:8000/music/";
      let src = format!("{}{}", url, name);
      let id = i + 1;
      let id = id.to_string();
      list.push(PlaylistItem {
        name: name.clone(),
        writer: name.clone(),
        img: "".to_string(),
        src,
        id,
      });
    }
  }

  // {
  //   name: "aufgehts",
  //   writer: "writer",
  //   img: "",
  //   src: "./aufgehts.wav",
  //   id: 1,
  // },
  serde_json::to_string(&list).unwrap()
}

#[get("/player/play_song")]
fn start() -> String {
  // music_player::play_song();
  format!("Song is playing")
}

#[get("/discogs/get_want_list/<username>")]
async fn get_wantlist(username: String) -> String {
  let result = discogs::get_want_list_information(username).await;
  result
}

struct _State {
  socket_writer: Option<SplitSink<WebSocketStream<TcpStream>, Message>>,
  authorization_token: Option<String>,
}

// #[get("/authorization_token/<token>")]
// fn receive_authorization_token(token: &str) {}
#[get("/")]
fn root() -> String {
  format!("this is chic api ")
}

#[get("/get_token")]
async fn get_token() -> &'static str {
  "here is the token"
}

// TODO: create a streaming api
//       find out if it possible and efficient
//       to create chunks of audio and
//       send it to the client
//       audio should be stored as followed:
//       -5 chunks and +5 chunks ahead
//       webrtc.rs might be a good choice >> gonna be sa simpler solution then that
//
// api-endpoint (/api/{})
async fn create_web_server() {
  task::spawn(
    rocket::build()
      .mount("/music", FileServer::from(CHIC_CONFIG_DIR))
      .mount(
        "/api",
        routes![root, get_wantlist, start, get_token, playlist_items],
      )
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

// fn spawn_new_window() {
//   tauri::Builder::default()
// }
async fn websocket_server() {
  let ws_addr = "127.0.0.1:3009";
  let try_socket = TcpListener::bind(&ws_addr).await;
  let listener = try_socket.expect("Failed to bind");

  info!("Listening on: {}", ws_addr);

  while let Ok((stream, _)) = listener.accept().await {
    tokio::spawn(accept_connection(stream));
  }
}
async fn fetch_playlists_metadata() {
  // TODO: send playlist meta data to client
  let yt_dlp_path = format!("{}yt-dlp", CHIC_CONFIG_DIR);
  let youtube_channel = "https://www.youtube.com/user/twipzy/playlists";
  let output_dir = format!(
    "{}%(playlist_title)s/%(title)s-%(id)s.%(ext)s",
    CHIC_CONFIG_DIR
  );
  let yt_dlp_args = [
    "-o",
    &output_dir,
    "--skip-download",
    "--write-description",
    "--write-info-json",
    "--write-annotations",
    "--write-thumbnail",
    "--write-all-thumbnails",
    "--write-sub",
    "--write-auto-sub",
    &youtube_channel,
  ];

  let output = Command::new(yt_dlp_path)
    .args(yt_dlp_args)
    .spawn()
    .expect("Something went wrong");
}

// async fn_download_thumbnails(){
// TODO:
// yt-dlp --skip-download --write-thumbnail --convert-thumbnails jpg -o  &output_dir
// let output_dir = format!(
//   "{}%(playlist_title)s/%(title)s-%(id)s.%(ext)s",
//   CHIC_CONFIG_DIR
// );
// }
async fn download_playlist() -> Result<(), Box<dyn Error>> {
  let yt_dlp_path = format!("{}yt-dlp", CHIC_CONFIG_DIR);
  let download_archive_arg = format!("{}playlist_archive.txt", CHIC_CONFIG_DIR);
  let output_dir = format!(
    "{}%(playlist_title)s/%(title)s-%(id)s.%(ext)s",
    CHIC_CONFIG_DIR
  );
  let youtube_channel = "https://www.youtube.com/user/twipzy/playlists";
  let yt_dlp_args = [
    "--download-archive",
    &download_archive_arg,
    "--no-post-overwrites",
    "--yes-playlist",
    "--extract-audio",
    "--audio-format",
    "mp3",
    // &download_archive_arg,
    "-o",
    &output_dir,
    &youtube_channel,
  ];
  let output = Command::new(yt_dlp_path)
    .args(yt_dlp_args)
    .spawn()
    .expect("Something went wrong");

  Ok(())
}

async fn create_tauri_window() {
  tauri::Builder::default()
    // .plugin(TauriWebsocket::default())
    .invoke_handler(tauri::generate_handler![
      music_player::play_song,
      discogs::get_want_list_information
    ])
    // .plugin(TauriSql::default().add_migrations(
    //   "sqlite:chic.db",
    //   vec![Migration {
    //     version: 1,
    //     description: "create playlists",
    //     sql: include_str!("../migrations/2022-02-14-165803_playlist/up.sql"),
    //     kind: tauri_plugin_sql::MigrationKind::Up,
    //   }],
    // ))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
// TODO: send the authorize_url via websocket to the frontend and render it in a modal to signup
// the user
#[tokio::main]
async fn main() {
  fetch_playlists_metadata().await;
  // download_playlist().await;
  tauri::async_runtime::spawn(websocket_server());
  // youtube::get_playlists_from_user().await;
  // tokio::spawn(create_web_server());
  create_tauri_window().await;
}
