#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![feature(proc_macro_hygiene, decl_macro)]

use tokio::task;

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
#[tokio::main]
async fn main() {
  let concurrent_webserver = task::spawn(
    rocket::build()
      .mount("/api", routes![root, get_wantlist, start])
      .launch(),
  );

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      play_song,
      get_want_list_information
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn mein_test(name: &str) {
  print!("{:?}", name);
}
