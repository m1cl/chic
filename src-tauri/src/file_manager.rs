use serde::Serialize;
use std::{arch::x86_64::_mm_ucomieq_ss, collections::HashMap};
use walkdir::{DirEntry, WalkDir};

#[derive(Default, Serialize)]
pub struct MusicLibrary {
  title: String,
}

impl MusicLibrary {
  pub fn new(dir: &str) -> Vec<DirEntry> {
    let mut music_library = Vec::new();
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
        println!("LOL");
        println!("{:?}", entry);
        music_library.push(entry)
      }
    }
    music_library
  }
}
