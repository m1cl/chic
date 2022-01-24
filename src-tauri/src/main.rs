extern crate dirs;
use std::{
  fmt::format,
  fs::{create_dir_all, read_to_string, File, OpenOptions},
  io::{BufRead, BufReader, BufWriter, Write},
  path::Path,
  sync::Arc,
};

use futures_util::{stream::SplitSink, SinkExt, StreamExt, TryFutureExt};
use log::debug;
use oauth2::{AuthorizationCode, CsrfToken};
use rocket::http::ext::IntoCollection;
use rusqlite::{
  types::{FromSql, ValueRef},
  Row, NO_PARAMS,
};
use tokio::task;

use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::WebSocketStream;

use tauri::{utils::config::WindowConfig, WindowUrl};
use tauri_plugin_websocket::TauriWebsocket;
use tungstenite::Message;

use config::Config;

#[macro_use]
extern crate rocket;

use authentication_manager::AuthManager;

use rusqlite::{params, Connection, Result, RowIndex, Rows};

mod discogs;
mod music_player;

#[get("/player/play_song")]
fn start() -> String {
  music_player::play_song();
  format!("Song is playing")
}

#[get("/discogs/get_want_list/<username>")]
async fn get_wantlist(username: String) -> String {
  let result = discogs::get_want_list_information(username).await;
  result
}

// async fn handle_connection(peer: SocketAddr, stream: TcpStream) -> Result<()> {
//   let mut ws_stream = accept_async(stream).await.expect("Failed to accept");
//
//   info!("New WebSocket connection: {}", peer);
//
//   while let Some(msg) = ws_stream.next().await {
//     // TODO :whattttttttttttttttttttttttt?
//     let msg = msg?;
//     if msg.is_text() || msg.is_binary() {
//       ws_stream.send(msg).await?;
//     }
//   }
//
//   Ok(())
// }

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

// TODO: receive google api token
#[get("/get_google_auth_token?<state>&<code>&<scope>")]
async fn get_google_auth_token(state: &str, code: String, scope: &str) {
  let _state = CsrfToken::new(state.into());
  let code = AuthorizationCode::new(code.into());
  save_yt_code(code.secret().to_string());
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
      .mount(
        "/api",
        routes![root, get_wantlist, start, get_google_auth_token, get_token],
      )
      .launch(),
  );
}
fn get_conf_dir() -> String {
  let home_config_dir = dirs::config_dir().unwrap().display().to_string();
  format!("{}/{}", home_config_dir, "chic")
}
fn get_conf_file() -> String {
  let home_config_dir = get_conf_dir();
  format!("{}/chic.conf", &home_config_dir)
}
fn youtube_code_exists() -> bool {
  let mut code_exists = false;
  let file = File::open(get_conf_file()).unwrap();
  let file = BufReader::new(file);
  for lines in file.lines() {
    let lines = lines.unwrap();
    let l: Vec<&str> = lines.split("=").collect();
    if l.first().unwrap().contains("YOUTUBE_CODE") {
      if !l.last().is_none() {
        code_exists = true;
        break;
      }
    }
  }
  code_exists
}
fn save_yt_code(code: String) {
  println!("this is the code: {}, ", &code);
  let mut file = OpenOptions::new()
    .append(true)
    .open(&get_conf_file())
    .expect("Couldn t open config file");
  file
    .write_all(format!("YOUTUBE_CODE={}", code).as_bytes())
    .expect("Couldn t save youtube to code");
  println!("File saving was successful");
}
async fn create_config_file() {
  let path = get_conf_dir();
  let file_name = get_conf_file();
  create_dir_all(Path::new(&path)).expect("Couldn't create directory");
  if Path::new(&file_name).is_file() {
    let content = read_to_string(&file_name).unwrap();
    println!("this is the content {}", content);
  } else {
    File::create(&file_name)
      .unwrap()
      .write(b"")
      .expect("Couldn t create file");
  }
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
async fn get_all_playlists_from_db(db: &Connection) -> Result<()> {
  db.query_row("select * from playlists", [], |row| {
    let data: String = row.get(0)?;
    println!("let s try t oget data ");
    println!("{:?}", data.as_str());
    Ok(())
  });
  Ok(())
}
async fn create_tauri_window() {
  let auth_manager = AuthManager::new();
  let authorize_url = auth_manager.authorize_url;
  let win_url = WindowUrl::App(authorize_url.as_str().into());
  let _window_config = WindowConfig::default();
  if youtube_code_exists() {
    tauri::Builder::default()
      .plugin(TauriWebsocket::default())
      .invoke_handler(tauri::generate_handler![
        music_player::play_song,
        discogs::get_want_list_information
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  } else {
    tauri::Builder::default()
      .create_window("Google authorization", win_url, |s, p| (s, p))
      .plugin(TauriWebsocket::default())
      .invoke_handler(tauri::generate_handler![
        music_player::play_song,
        discogs::get_want_list_information
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  }
}
// TODO: send the authorize_url via websocket to the frontend and render it in a modal to signup
// the user
#[tokio::main]
async fn main() {
  create_config_file().await;
  youtube_code_exists();
  tauri::async_runtime::spawn(websocket_server());
  tokio::spawn(create_web_server());
  create_tauri_window().await;
}
