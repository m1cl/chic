#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;
use walkdir::WalkDir;

use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};

use rodio::{source::Source, Decoder, OutputStream};
use serde::Serialize;
use serde_json::Value;

use std::io::BufReader;

struct MusicLibrary {
  title: String,
  path: std::path::Path,
}

async fn get_data_from_response(url: &str) -> Value {
  let client = ClientBuilder::new().max_redirections(3).build().unwrap();
  let request_builder = HttpRequestBuilder::new("GET", url);
  let request = request_builder.response_type(ResponseType::Json);
  let value = client.send(request).await.unwrap().read().await.unwrap();
  let data = value.data;
  data
}

//               setItems([
//                 ...items,
//                 {
//                   notes,
//                   genres,
//                   album,
//                   label,
//                   artist,
//                   artistUri,
//                   videos,
//                   id,
//                   year,
//                 },
//               ]);
//

#[derive(Default, Serialize)]
struct DiscogsRelease {
  artist: String,
  album: String,
  label: String,
  id: String,
  year: String,
  genres: String,
}

fn get_release_information(want_list: &Value) -> DiscogsRelease {
  let album = want_list["basic_information"]["title"].to_string();
  let id = want_list["basic_information"]["id"].to_string();
  let year = want_list["basic_information"]["year"].to_string();
  let artist = want_list["basic_information"]["artists"][0]["name"].to_string();
  let label = want_list["basic_information"]["label"][0]["name"].to_string();
  let genres = want_list["basic_information"]["genres"].to_string();

  DiscogsRelease {
    id,
    year,
    artist,
    label,
    album,
    genres,
  }
}

#[tauri::command]
async fn get_want_list_information(username: String) -> String {
  let mut send_back_data = Vec::new();
  // REACT_APP_DC_TOKEN=MDWxrXOOMfubtyEQdmmMcnRriPuMEZabvrgCuUDn
  let DISCOGS_URL = "https://api.discogs.com";
  let url = format!("{}/users/{}/wants", DISCOGS_URL, username);
  let data = get_data_from_response(&url).await;
  let want_lists = data["wants"].as_array();
  for w in want_lists.unwrap().into_iter() {
    let release = get_release_information(w);
    send_back_data.push(release);
  }
  serde_json::to_string(&send_back_data).unwrap()
}

#[tauri::command]
fn my_custom_command() -> String {
  "Hello from REust".into()
}

#[tauri::command]
async fn play_song() -> String {
  // Get a output stream handle to the default physical sound device
  let (_stream, stream_handle) = OutputStream::try_default().unwrap();
  // Load a sound from a file, using a path relative to Cargo.toml
  let file = BufReader::new(std::fs::File::open("src/scheisse.mp3").unwrap());
  // Decode that sound file into a source
  let source = Decoder::new(file).unwrap();
  // Play the sound directly on the device
  stream_handle.play_raw(source.convert_samples());

  // The sound plays in a separate audio thread,
  // so we need to keep the main thread alive while it's playing.
  std::thread::sleep(std::time::Duration::from_secs(1000));
  "is playling....".into()
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
      my_custom_command,
      play_song,
      get_want_list_information
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
