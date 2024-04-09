use rodio::{source::Source, Decoder, OutputStream};
use std::io::BufReader;

#[tauri::command]
pub async fn play_song() -> String {
  // Get a output stream handle to the default physical sound device
  let (_stream, stream_handle) = OutputStream::try_default().unwrap();
  // Load a sound from a file, using a path relative to Cargo.toml
  let file = BufReader::new(std::fs::File::open("./src/song.mp3").unwrap());
  // Decode that sound file into a source
  let source = Decoder::new(file).unwrap();
  // Play the sound directly on the device
  stream_handle.play_raw(source.convert_samples());

  // The sound plays in a separate audio thread,
  // so we need to keep the main thread alive while it's playing.
  std::thread::sleep(std::time::Duration::from_secs(1000));
  "is playling....".into()
}
