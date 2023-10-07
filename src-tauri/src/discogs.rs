use std::time::Duration;

use rusty_ytdl::reqwest::Client;
use serde::Serialize;
use serde_json::{Value,json};
use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};
use wsd::json::JSON;
extern crate reqwest;

use crate::youtube;

#[derive(Default, Serialize)]
struct DiscogsRelease {
  artist: String,
  album: String,
  label: String,
  id: String,
  year: String,
  genres: String,
  youtube_url: String,
}
async fn get_data_from_response(url: &str) -> Value {
  log::info!("Get reponse from {}", url);
  let client = reqwest::Client::builder()
    .user_agent("chic app")
    .build();
  let res = client.expect("Something went wrong").get(url).send().await.unwrap();
  log::info!("The headers: {:#?}", res.headers());
  let res = res.text().await.unwrap();
  let res = serde_json::from_str(res.as_str()).unwrap();
  res
}

async fn get_release_information(want_list: &Value) -> DiscogsRelease {
  let album = want_list["basic_information"]["title"].as_str().to_string();
  let id = want_list["basic_information"]["id"].as_str().to_string();
  let year = want_list["basic_information"]["year"].as_str().to_string();
  let artist = want_list["basic_information"]["artists"][0]["name"].as_str().to_string();
  let label = want_list["basic_information"]["label"][0]["name"].as_str().to_string();
  let genres = want_list["basic_information"]["genres"].as_str().to_string();

  let query = format!("{} {}", artist, album);
  let youtube_url = youtube::search_and_get_url(query).await;
  let dir = String::from("discogs_wantlist");
  youtube::download_audio(youtube_url.to_owned(), dir).await;
  DiscogsRelease {
    id,
    year,
    artist,
    label,
    album,
    genres,
    youtube_url,
  }
}

#[tauri::command]
#[get("/discogs/get_want_list/<username>")]
pub async fn get_want_list_information(username: String) -> String {
  let mut discogs_releases = Vec::new();
  let discogs_url = "https://api.discogs.com";
  let url = format!("{}/users/{}/wants?page=1", discogs_url, username);
  let data = get_data_from_response(&url).await;
  let _want_lists = data["wants"].as_array();

  // let mut pagi_curr = data["pagination"]["page"].as_i64().unwrap();
  let pagi_pages = data["pagination"]["pages"].as_i64().unwrap() - 1;
  // let pagi_per_page = data["pagination"]["per_page"].as_i64().unwrap();
  // let total_items =  data["pagination"]["items"].as_i64().unwrap();

  // for w in want_lists.unwrap().into_iter() {
  //   let release = get_release_information(w).await;
  //   discogs_releases.push(release);
  // };
  for n in 2..pagi_pages {
    log::info!("Currently on page: {}", n);
    let url = format!("{}/users/{}/wants?page={}", discogs_url, username, n);
    let data = get_data_from_response(&url).await;
    let want_lists = data["wants"].as_array();
    for w in want_lists.unwrap().into_iter() {
      let release = get_release_information(w).await;
      discogs_releases.push(release);
    }
  };
  serde_json::to_string(&discogs_releases).unwrap()
}
