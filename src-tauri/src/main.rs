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

struct MusicLibrary {
  title: String,
  path: std::path::Path,
}

fn main() {
  let mut filenames: HashMap<String, String> = HashMap::new();
  for entry in WalkDir::new("/home/m1cl/Musik")
    .follow_links(true)
    .into_iter()
    .filter_map(|e| e.ok())
  {
    let f_name = entry.path().to_string_lossy();
    let sec = entry.metadata().unwrap().modified().unwrap();

    if f_name.ends_with(".mp3")
      || f_name.ends_with(".flac") && sec.elapsed().unwrap().as_secs() < 86400
    {
      // println!("{}", f_name)
    }
  }
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      play_song,
      get_want_list_information
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
