#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![feature(proc_macro_hygiene, decl_macro)]

use tokio::task;

// use futures_util::{SinkExt, StreamExt};
use futures_util::{SinkExt, StreamExt};
use log::{error, info};
use std::net::SocketAddr;
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{accept_async, tungstenite::Error};

use tauri_plugin_websocket::TauriWebsocket;
use tungstenite::{Message, Result};

#[macro_use]
extern crate rocket;

use std::{collections::HashMap, future::Future, io};
use walkdir::WalkDir;

use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};

mod discogs;
use discogs::get_want_list_information;

mod music_player;
use music_player::play_song;

mod file_manager;
use file_manager::MusicLibrary;

#[get("/player/play_song")]
fn start() -> String {
  play_song();
  format!("Song is playing")
}

#[get("/discogs/get_want_list/<username>")]
async fn get_wantlist(username: String) -> String {
  let result = get_want_list_information(username).await;
  result
}

async fn handle_connection(peer: SocketAddr, stream: TcpStream) -> Result<()> {
  let mut ws_stream = accept_async(stream).await.expect("Failed to accept");

  info!("New WebSocket connection: {}", peer);

  while let Some(msg) = ws_stream.next().await {
    // TODO :whattttttttttttttttttttttttt?
    let msg = msg?;
    if msg.is_text() || msg.is_binary() {
      ws_stream.send(msg).await?;
    }
  }

  Ok(())
}

#[get("/")]
fn root() -> String {
  format!("this is chic api ")
}

// TODO: create a streaming api
//       find out if it possible and efficient
//       to create chunks of audio and
//       send it to the client
//       audio should be stored as followed:
//       -5 chunks and +5 chunks ahead
//       webrtc.rs might be a good choice
//
async fn create_web_server() {
  task::spawn(
    rocket::build()
      .mount("/api", routes![root, get_wantlist, start])
      .launch(),
  );
}

async fn accept_connection(stream: TcpStream) {
  let ws_stream = tokio_tungstenite::accept_async(stream)
    .await
    .expect("Error during the weboscket handshare occured");

  let (mut write, read) = ws_stream.split();

  write
    .send(Message::Text("Yeah this ist cool".to_string()))
    .await
    .expect("Something went wrong, babe");

  read
    .forward(write)
    .await
    .expect("failed to forward message")
}

async fn run_websocket() {
  let ws_addr = "127.0.0.1:9002";

  let try_socket = TcpListener::bind(&ws_addr).await;

  let listener = try_socket.expect("Failed to bind");

  info!("Listening on: {}", ws_addr);

  while let Ok((stream, _)) = listener.accept().await {
    tokio::spawn(accept_connection(stream));
  }
}
#[tokio::main]
async fn main() {
  tauri::async_runtime::spawn(run_websocket());
  tokio::spawn(create_web_server());

  tauri::Builder::default()
    .plugin(TauriWebsocket::default())
    .invoke_handler(tauri::generate_handler![
      play_song,
      get_want_list_information
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
