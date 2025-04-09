use std::fs::File;
use std::io::BufReader;

use crate::youtube::CHIC_CONFIG_DIR;
use rocket::fs::FileServer;
use rocket::routes;
use rocket::{fs::Options, get, post};
use rodio::Decoder;
use rodio::OutputStream;
use rodio::Source;
use tauri::generate_handler;
use tokio::task;
use youtube::{create_playlists_from_dir, download_playlist, PlaylistItems};
mod authentication_manager;
mod discogs;
mod youtube;

struct AudioFile {
  id: u8,
  title: String,
  artist: String,
  album: Option<String>,
  path: String,
  album_cover_image_path: String,
}

#[post("/audio")]
async fn handle_audio_request() -> Result<(), std::io::Error> {
  // Get an output stream handle to the default physical sound device
  let (_stream, stream_handle) = OutputStream::try_default().unwrap();
  // Load a sound from a file, using a path relative to Cargo.toml
  let file = BufReader::new(
    File::open("/Users/m1cl/Music/Music/Media.localized/Music/Unknown Artist/Unknown Album/Manos - Manos EP.mp3")
      .unwrap(),
  );
  // Decode that sound file into a source
  let source = Decoder::new(file).unwrap();
  let duration = source.total_duration().unwrap();
  // Play the sound directly on the device
  stream_handle.play_raw(source.convert_samples()).unwrap();

  // The sound plays in a separate audio thread,
  // so we need to keep the main thread alive while it's playing.
  std::thread::sleep(duration);
  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
  create_web_server().await;
  // download_playlist().await.expect("Cannot download playlist");
  tauri::Builder::default()
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(generate_handler![get_playlists])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
#[get("/playlists")]
async fn get_playlists() -> Result<String, String> {
  println!("Starting getting directory items");
  let playlists: Vec<PlaylistItems> = create_playlists_from_dir();
  match serde_json::to_string(&playlists) {
    Ok(json) => Ok(json),
    Err(e) => Err(e.to_string()),
  }
}

async fn create_web_server() {
  task::spawn(
    rocket::build()
      .mount(
        "/music/chic",
        FileServer::new(CHIC_CONFIG_DIR.clone(), Options::Index | Options::DotFiles),
      )
      .mount(
        "/api",
        routes![
          youtube::get_youtube_search_results,
          discogs::get_want_list_information,
          get_playlists,
          handle_audio_request
        ],
      )
      .launch(),
  );
}
