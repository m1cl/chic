use serde::Serialize;
use std::error::Error;
use walkdir::{DirEntry, WalkDir};
use youtube_dl::{download_yt_dlp, YoutubeDl};

#[derive(Default, Serialize)]
pub struct PlaylistItems {
  name: String,
  playlist: String,
  writer: String,
  img: String,
  src: String,
  id: String,
}

//     React modern audio player Datatype
//     ===================================
//     src: string;
//     id: number;
//     name?: string | ReactNode;
//     writer?: string | ReactNode;
//     img?: string;
//     description?: string | ReactNode;
//     customTrackInfo?: string | ReactNode;

pub static CHIC_CONFIG_DIR: &'static str = "~/.config/chic/";
// Get all playlists and titles
// youtube-dl --download-archive archive.txt -o '%(playlist_title)s/%(title)s-%(id)s.%(ext)s' "$url"
//
pub async fn get_playlists_from_user() {
  println!("getting playlist data ");
  let user_channel_url = "https://www.youtube.com/playlist?list=PL_f5dGKW0s3PZPuEy5901LqLQ9vo7HCE8";
  match YoutubeDl::new(user_channel_url).socket_timeout("10").run() {
    Ok(data) => print!(
      "the data is now {:?}",
      data
        .into_single_video()
        .unwrap_or_default()
        .artist
        .unwrap_or_default()
    ),
    Err(e) => eprint!("{:?}", e),
  }
}

fn get_playlist_name(entry: &DirEntry) -> String {
  entry
    .path()
    .to_str()
    .unwrap()
    .split("/")
    .take(2)
    .last()
    .unwrap()
    .to_string()
}

pub fn create_playlists_from_dir() -> Vec<PlaylistItems> {
  let mut id = 1;
  let mut playlists: Vec<PlaylistItems> = Vec::new();
  for entry in WalkDir::new("chic/")
    .follow_links(true)
    .into_iter()
    .filter_map(|e| e.ok())
  {
    let path = entry.path().to_string_lossy();
    let playlist_name = get_playlist_name(&entry);
    println!("{}", playlist_name);
    let url = "http://localhost:8000/music/";
    let f_name = entry.file_name().to_string_lossy().to_string();
    let src = format!("{}{}", url, path);
    // let img = format!("{}album.png", url);
    if f_name.ends_with(".mp3") {
      playlists.push(PlaylistItems {
        name: f_name.clone(),
        playlist: playlist_name.clone(),
        writer: playlist_name.clone(),
        img: "https://vinyl-records.nl/thrash-metal/photo-gallery/hellbastard/HELLBASTARD---NATURAL-ORDER-8672.jpg".into(),
        src,
        id: id.to_string(),
      });
      id = id + 1;
    }
  }
  playlists
}

pub async fn download_playlist() -> Result<(), Box<dyn Error>> {
  let yt_dlp_path = download_yt_dlp(CHIC_CONFIG_DIR).await?;
  let output = YoutubeDl::new("https://www.youtube.com/channel/UCutUJrVebur4VvGimDaW3Rw/playlists")
    .download(true)
    .flat_playlist(true)
    .extract_audio(true)
    .output_directory(CHIC_CONFIG_DIR)
    .youtube_dl_path(yt_dlp_path)
    .run_async()
    .await?;
  let title = output.into_single_video().unwrap().title;
  println!("Video title: {}", title);
  Ok(())
}
