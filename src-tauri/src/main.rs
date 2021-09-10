#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;
use walkdir::WalkDir;

use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};

mod discogs;
use discogs::get_want_list_information;

mod music_player;
use music_player::play_song;

mod file_manager;
use file_manager::MusicLibrary;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      play_song,
      get_want_list_information
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
