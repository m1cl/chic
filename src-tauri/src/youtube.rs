//! YouTube functionality module for the Chic music player
//! Handles playlist management, audio downloads, and YouTube search integration

use lazy_static::lazy_static;
use rocket::get;
use rusty_ytdl::search::{SearchResult, YouTube};
use serde::Serialize;
use std::{
    error::Error,
    fs,
    process::{Command, Output},
    time::Duration,
};
use walkdir::{DirEntry, WalkDir};
use youtube_dl::{download_yt_dlp, YoutubeDl};

// Constants
lazy_static! {
    pub static ref CHIC_CONFIG_DIR: String = homedir::get_my_home()
        .expect("Failed to get home directory")
        .unwrap()
        .join(".config/chic/")
        .to_str()
        .unwrap()
        .to_string();
}

const DEFAULT_THUMBNAIL: &str = "https://vinyl-records.nl/thrash-metal/photo-gallery/hellbastard/HELLBASTARD---NATURAL-ORDER-8672.jpg";
const DEFAULT_YOUTUBE_CHANNEL: &str = "https://www.youtube.com/@Twipzy/playlists";

/// Represents an item in a playlist, compatible with React modern audio player
#[derive(Default, Serialize)]
pub struct PlaylistItems {
    name: String,
    playlist: String,
    writer: String,
    img: String,
    src: String,
    id: String,
}

// Playlist Management Functions
/// Retrieves playlist data from a user's YouTube channel
pub async fn get_playlists_from_user() {
    log::info!("Fetching playlist data from YouTube");
    match YoutubeDl::new(DEFAULT_YOUTUBE_CHANNEL).socket_timeout("10").run() {
        Ok(data) => {
            if let Some(video) = data.into_single_video() {
                log::info!("Successfully retrieved playlist data: {:?}", video);
            }
        }
        Err(e) => log::error!("Failed to retrieve playlist data: {:?}", e),
    }
}

/// Extracts the playlist name from a directory entry
fn get_playlist_name(entry: &DirEntry) -> String {
    entry
        .path()
        .to_str()
        .unwrap_or_default()
        .split('/')
        .take(2)
        .last()
        .unwrap_or_default()
        .to_string()
}

/// Creates playlist items from the local directory structure
pub fn create_playlists_from_dir() -> Vec<PlaylistItems> {
    let mut playlists = Vec::new();
    let mut id = 0;

    for entry in WalkDir::new(CHIC_CONFIG_DIR.clone())
        .follow_links(true)
        .into_iter()
        .filter_map(Result::ok)
    {
        let path = entry.path().to_string_lossy();
        let playlist_name = get_playlist_name(&entry);
        let file_name = entry.file_name().to_string_lossy();

        if playlist_name.contains("mp3") || !file_name.ends_with(".mp3") {
            continue;
        }

        playlists.push(PlaylistItems {
            name: file_name.to_string(),
            playlist: playlist_name.clone(),
            writer: playlist_name,
            img: DEFAULT_THUMBNAIL.into(),
            src: path.to_string(),
            id: id.to_string(),
        });
        id += 1;
    }
    playlists
}

// Download Functions
/// Downloads audio from a YouTube URL
pub async fn download_audio(url: String, _dir: String) -> Result<(), Box<dyn Error>> {
    log::info!("Downloading audio from: {}", url);
    let dir = format!("{}{}", *CHIC_CONFIG_DIR, "discogs_wantlist");
    let yt_dlp_path = format!("{}{}", *CHIC_CONFIG_DIR, "yt-dlp");

    YoutubeDl::new(url)
        .extract_audio(true)
        .process_timeout(Duration::new(0, 30))
        .output_directory(dir)
        .youtube_dl_path(yt_dlp_path)
        .run()
        .map_err(|e| Box::new(e) as Box<dyn Error>)?;

    Ok(())
}

/// Downloads an entire playlist from YouTube
pub async fn download_playlist() -> Result<Output, Box<dyn Error>> {
    let yt_dlp_path = download_yt_dlp(CHIC_CONFIG_DIR.clone()).await?;
    fs::create_dir_all(CHIC_CONFIG_DIR.clone())?;
    log::info!("Downloading playlists");

    let archive_path = format!("{}{}", *CHIC_CONFIG_DIR, "downloaded.txt");
    let output_template = format!("{}%(playlist_title)s/%(title)s.%(ext)s", *CHIC_CONFIG_DIR);
    
    let args = vec![
        "--extract-audio",
        "-ciwx",
        "--audio-format", "mp3",
        "--download-archive", &archive_path,
        "--no-post-overwrite",
        "--audio-quality", "0",
        "--write-thumbnail",
        "-o", &output_template,
        DEFAULT_YOUTUBE_CHANNEL,
    ];

    let output = Command::new(yt_dlp_path)
        .args(args)
        .output()
        .map_err(|e| Box::new(e) as Box<dyn Error>)?;

    log::info!("Download completed: {:?}", output);
    Ok(output)
}

// Search Functions
/// Tauri command for searching YouTube
#[tauri::command]
#[get("/youtube/search/<query>")]
pub async fn get_youtube_search_results(query: String) -> String {
    search_and_get_url(query).await
}

/// Searches YouTube and returns the first video URL
pub async fn search_and_get_url(query: String) -> String {
    log::info!("Searching YouTube for: {}", query);
    
    let youtube = match YouTube::new() {
        Ok(yt) => yt,
        Err(_) => return String::new(),
    };

    match youtube.search(query, None).await {
        Ok(results) if !results.is_empty() => {
            match &results[0] {
                SearchResult::Video(video) => video.url.clone(),
                _ => String::new(),
            }
        }
        _ => String::new(),
    }
}
