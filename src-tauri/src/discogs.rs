use serde::Serialize;
use serde_json::Value;
use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};

async fn get_data_from_response(url: &str) -> Value {
  let client = ClientBuilder::new().max_redirections(3).build().unwrap();
  let request_builder = HttpRequestBuilder::new("GET", url);
  let request = request_builder.response_type(ResponseType::Json);
  let value = client.send(request).await.unwrap().read().await.unwrap();
  let data = value.data;
  data
}

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
pub async fn get_want_list_information(username: String) -> String {
  let mut discogs_releases = Vec::new();
  // REACT_APP_DC_TOKEN=MDWxrXOOMfubtyEQdmmMcnRriPuMEZabvrgCuUDn
  let discogs_url = "https://api.discogs.com";
  let url = format!("{}/users/{}/wants", discogs_url, username);
  let data = get_data_from_response(&url).await;
  let want_lists = data["wants"].as_array();
  for w in want_lists.unwrap().into_iter() {
    let release = get_release_information(w);
    discogs_releases.push(release);
  }
  serde_json::to_string(&discogs_releases).unwrap()
}
