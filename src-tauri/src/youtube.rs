use rocket::get;
use rusty_ytdl::search::{SearchResult, Video, YouTube};
use serde::Serialize;
use std::{
  error::Error,
  process::{Command, Output},
  time::Duration,
};
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

// INFO: get all info from users playlist  ./yt-dlp --dump-json --flat-playlist --skip-download  "https://www.youtube.com/@Twipzy/playlists"> info.json
pub static CHIC_CONFIG_DIR: &'static str = "/Users/m1cl/.config/chic/";
// Get all playlists and titles
// youtube-dl --download-archive archive.txt -o '%(playlist_title)s/%(title)s-%(id)s.%(ext)s' "$url"
//
pub async fn get_playlists_from_user() {
  log::info!("getting playlist data ");
  let user_channel_url = "https://www.youtube.com/@Twipzy/playlists";
  match YoutubeDl::new(user_channel_url).socket_timeout("10").run() {
    Ok(data) => print!(
      "the data is now {:?}",
      data.into_single_video().unwrap_or_default()
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
  let mut id = 0;
  let mut playlists: Vec<PlaylistItems> = Vec::new();
  for entry in WalkDir::new("chic/")
    .follow_links(true)
    .into_iter()
    .filter_map(|e| e.ok())
  {
    let path = entry.path().to_string_lossy();
    let playlist_name = get_playlist_name(&entry);
    if playlist_name.contains("mp3") {
      continue;
    }
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

// TODO: put this into discogs
pub async fn download_audio(url: String, dir: String) -> Result<(), Box<dyn Error>> {
  log::warn!("...DOWNLOADING AUDIO {}", url);
  let dir = format!("{}{}", CHIC_CONFIG_DIR, "discogs_wantlist");
  let yt_dlp_path = format!("{}{}", CHIC_CONFIG_DIR, "yt-dlp");
  let output = YoutubeDl::new(url)
    .download(true)
    .extract_audio(true)
    .process_timeout(Duration::new(0, 30))
    .output_directory(dir)
    .youtube_dl_path(yt_dlp_path)
    .run_async()
    .await?;
  let title = output.into_single_video().unwrap().title;
  log::info!("Video title: {}", title);
  Ok(())
}

// TODO baustelle
pub async fn download_playlist() -> Result<Output, Box<dyn Error>> {
  log::warn!("...DOWNLOADING PLAYLISTS");
  let yt_dlp_path = download_yt_dlp(CHIC_CONFIG_DIR).await?;
  let args: Vec<String> = vec![
    "--extract-audio".to_string(),
    "--audio-format".to_string(),
    "mp3".to_string(),
    "--audio-quality".to_string(),
    "0".to_string(),
    "--write-thumbnail".to_string(),
    "-o".to_string(),
    format!("{}%(playlist_title)s/%(title)s.%(ext)s", CHIC_CONFIG_DIR),
    "https://www.youtube.com/@Twipzy/playlists ".to_string(),
  ];

  let output = Command::new(yt_dlp_path)
    .args(args)
    .output()
    .expect("Failed to execute command");
  log::warn!("the output {:?}", output);
  Ok(output)
}

#[tauri::command]
#[get("/youtube/search/<query>")]
pub async fn get_youtube_search_results(query: String) -> String {
  search_and_get_url(query).await
}
pub async fn search_and_get_url(query: String) -> String {
  log::info!("GETTING THE URL FROM YOUTUBE");
  let query = query.replace(&['(', ')', ',', '\"', '.', ';', ':', '\\', '\''][..], "");
  log::warn!("the query {}", query);
  let youtube = YouTube::new().unwrap();
  let res = youtube.search(query, None).await;
  if res.as_ref().unwrap().len() < 1 {
    return String::from("");
  };
  let results = &res.unwrap()[0];
  let mut url = format!("");
  match results {
    SearchResult::Video(video) => {
      url = video.url.to_owned();
      ()
    }
    _ => println!(" "),
  }
  // let url = results.url.clone();
  url.to_owned()
}
