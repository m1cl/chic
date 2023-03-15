extern crate dirs;
use std::{
  fs::{self},
  io::{BufRead}, error::Error, ffi::{OsString},
};
use json::stringify;
use rocket::fs::FileServer;
use serde::Serialize;
use youtube_dl::{download_yt_dlp, YoutubeDl};

use futures_util::{stream::SplitSink, SinkExt, StreamExt};
// use tauri_plugin_sql::{Migration, TauriSql};
use tokio::task;

use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::WebSocketStream;

// use tauri_plugin_websocket::TauriWebsocket;
use tungstenite::Message;

#[macro_use]
extern crate rocket;

mod discogs;
mod youtube;
mod music_player;

#[derive(Default, Serialize)]
struct PlaylistItem {
    name: String,
    writer: String,
    img: String,
    src: String,
    id: String
}

fn get_ext(file_name: &OsString) -> String {
    let ext = file_name.to_str().unwrap().to_string();
    let ext = ext.split(".").last().unwrap().to_string();
        println!("the ext {}", ext);
    ext
}

#[get("/player/playlist_items")]
async fn playlist_items() -> String {
    println!("Starting getting directory items");
    let mut list: Vec<PlaylistItem> = Vec::new();
    let i = 1;
   for file in fs::read_dir("/Users/majala/.config/chic/").unwrap() {
       let file = file.unwrap();
       let file_name = file.file_name();
       let ext = get_ext(&file_name);
       println!("LOL");
       if ext == "wav" {
           let src = file.path().to_str().unwrap().to_string();
           let name = file_name.clone().into_string().unwrap();
           let url = "http://localhost:8000/music/";
           let src = format!("{}{}", url, name);
           let id = i +1;
           let id = id.to_string();
           list.push(PlaylistItem { name: name.clone(), writer: name.clone() , img: "".to_string(), src, id });
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
    .mount("/music", FileServer::from("/Users/majala/.config/chic/"))
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
  let ws_addr = "127.0.0.1:9002";
  let try_socket = TcpListener::bind(&ws_addr).await;
  let listener = try_socket.expect("Failed to bind");

  info!("Listening on: {}", ws_addr);

  while let Ok((stream, _)) = listener.accept().await {
    tokio::spawn(accept_connection(stream));
  }
}

async fn download_playlist() -> Result<(), Box<dyn Error>> {
let yt_dlp_path = download_yt_dlp("/Users/majala/.config/chic").await?;
    let output = YoutubeDl::new("https://www.youtube.com/watch?v=VFbhKZFzbzk")
        .download(true)
        .extract_audio(true)
        .output_directory("/Users/majala/.config/chic")
        .youtube_dl_path(yt_dlp_path)
        .run_async()
        .await?;
    let title = output.into_single_video().unwrap().title;
    println!("Video title: {}", title);
    Ok(())
}
// async fn get_all_playlists_from_db(db: &Connection) -> Result<()> {
//   db.query_row("select * from playlists", [], |row| {
//     let data: String = row.get(0)?;
//     println!("let s try t oget data ");
//     println!("{:?}", data.as_str());
//     Ok(())
//   });
//   Ok(())
// }
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
  // download_playlist().await;
  tauri::async_runtime::spawn(websocket_server());
  // youtube::get_playlists_from_user().await;
  tokio::spawn(create_web_server());
  create_tauri_window().await;
}
