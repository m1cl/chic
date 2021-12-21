use futures_util::{stream::SplitSink, SinkExt, StreamExt};
use oauth2::{AuthorizationCode, CsrfToken};
use tokio::task;

use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::WebSocketStream;

use tauri_plugin_websocket::TauriWebsocket;
use tungstenite::Message;

#[macro_use]
extern crate rocket;

use tauri::{utils::config::WindowConfig, WindowUrl};

use authentication_manager::AuthManager;

mod discogs;
use discogs::get_want_list_information;

mod music_player;
use music_player::play_song;

#[get("/player/play_song")]
fn start() -> String {
  play_song();
  format!("Song is playing")
}

#[get("/discogs/get_want_list/<username>")]
async fn get_wantlist(username: String) -> String {
  let result = get_want_list_information(username).await;
  result
}

// async fn handle_connection(peer: SocketAddr, stream: TcpStream) -> Result<()> {
//   let mut ws_stream = accept_async(stream).await.expect("Failed to accept");
//
//   info!("New WebSocket connection: {}", peer);
//
//   while let Some(msg) = ws_stream.next().await {
//     // TODO :whattttttttttttttttttttttttt?
//     let msg = msg?;
//     if msg.is_text() || msg.is_binary() {
//       ws_stream.send(msg).await?;
//     }
//   }
//
//   Ok(())
// }

struct _State {
  socket_writer: Option<SplitSink<WebSocketStream<TcpStream>, Message>>,
  authorization_token: Option<String>,
}

// #[get("/authorization_token/<token>")]
// fn receive_authorization_token(token: &str) {}
#[get("/")]
fn root() -> String {
  format!("this is chic api ")
}

// TODO: receive google api token
#[get("/get_google_auth_token?<state>&<code>&<_scope>")]
async fn get_google_auth_token(state: &str, code: String, _scope: &str) -> String {
  let _state = CsrfToken::new(state.into());
  let code = AuthorizationCode::new(code.into());
  code.secret().to_string()
}
#[get("/get_token")]
async fn get_token() -> &'static str {
  "here is the token"
}

// TODO: create a streaming api
//       find out if it possible and efficient
//       to create chunks of audio and
//       send it to the client
//       audio should be stored as followed:
//       -5 chunks and +5 chunks ahead
//       webrtc.rs might be a good choice
//
// api-endpoint (/api/{})
async fn create_web_server() {
  task::spawn(
    rocket::build()
      .mount(
        "/api",
        routes![root, get_wantlist, start, get_google_auth_token, get_token],
      )
      .launch(),
  );
}

// fn open_authorize_url(url: Url) {}

async fn accept_connection(stream: TcpStream) {
  let ws_stream = tokio_tungstenite::accept_async(stream)
    .await
    .expect("Error during the weboscket handshare occured");

  let (mut write, read) = ws_stream.split();

  write
    .send(Message::Text("Yeah this ist cool".to_string()))
    .await
    .expect("Something went wrong, babe");

  read
    .forward(write)
    .await
    .expect("failed to forward message")
}

// fn spawn_new_window() {
//   tauri::Builder::default()
// }
async fn run_websocket() {
  let ws_addr = "127.0.0.1:9002";
  let try_socket = TcpListener::bind(&ws_addr).await;
  let listener = try_socket.expect("Failed to bind");

  info!("Listening on: {}", ws_addr);

  while let Ok((stream, _)) = listener.accept().await {
    tokio::spawn(accept_connection(stream));
  }
}
// TODO: send the authorize_url via websocket to the frontend and render it in a modal to signup
// the user
#[tokio::main]
async fn main() {
  let auth_manager = AuthManager::new();
  let authorize_url = auth_manager.authorize_url;
  let win_url = WindowUrl::App(authorize_url.as_str().into());
  tauri::async_runtime::spawn(run_websocket());
  tokio::spawn(create_web_server());
  let _window_config = WindowConfig::default();

  tauri::Builder::default()
    .create_window("Google authorization", win_url, |s, p| (s, p))
    .plugin(TauriWebsocket::default())
    .invoke_handler(tauri::generate_handler![
      play_song,
      get_want_list_information
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
