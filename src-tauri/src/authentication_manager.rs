extern crate dotenv;
use dotenv::dotenv;
use oauth2::{basic::BasicClient, StandardRevocableToken, TokenResponse};
// Alternatively, this can be oauth2::curl::http_client or a custom.
use oauth2::{
  reqwest::http_client, AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken, RedirectUrl,
  RevocationUrl, Scope, TokenUrl,
};
use sqlx::{
  sqlite::{SqlitePoolOptions, SqliteQueryResult},
  Executor, Row, SqlitePool,
};
use std::env;
use tokio::task::spawn_blocking;
use url::Url;

mod youtube;

#[derive(Default)]
pub struct AuthManager {}

impl AuthManager {
  pub fn create_auth_manager() -> BasicClient {
    dotenv().ok();
    let google_client_id =
      ClientId::new(env::var("GOOGLE_CLIENT_ID").expect("Missing the GOOGLE_CLIENT_ID env var"));

    let google_client_secret = ClientSecret::new(
      env::var("GOOGLE_CLIENT_SECRET").expect("Missing the GOOGLE_CLIENT_SECRET env var"),
    );

    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
      .expect("Invalid authorization endpoint URL");

    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string())
      .expect("Invalid token endpoint URL");

    // Set up the config for the google oauth2 process
    let client = BasicClient::new(
      google_client_id,
      Some(google_client_secret),
      auth_url,
      Some(token_url),
    )
    .set_redirect_uri(
      RedirectUrl::new("http://localhost:8000/api/get_google_auth_token".to_string())
        .expect("Invalid redirect URL"),
    )
    .set_revocation_uri(
      RevocationUrl::new("https://oauth2.googleapis.com/revoke".to_string())
        .expect("Invalid revocation endpoint URL"),
    );
    return client;
  }
  pub async fn receive_access_token(&self, code: String) -> sqlx::Result<()> {
    let client = AuthManager::create_auth_manager();
    let auth_code = AuthorizationCode::new(code);
    let m_client = client.clone();
    let token_response = spawn_blocking(move || {
      let token = m_client
        .clone()
        .exchange_code(auth_code)
        .request(http_client)
        .unwrap();
      token
    })
    .await
    .unwrap();
    // let token_to_revoke: StandardRevocableToken = match token_response.refresh_token() {
    //   Some(token) => token.into(),
    //   None => token_response.access_token().into(),
    // };
    let access_token = token_response.access_token().secret().as_str();
    let result = self.store_access_token(access_token.into()).await;
    println!(
      "storing access token result: {}",
      result.unwrap().rows_affected()
    );
    Ok(())
    // client
    //   .revoke_token(token_to_revoke)
    //   .unwrap()
    //   .request(http_client)
    //   .expect("Failed to revoke");
  }
  async fn store_access_token(&self, access_token: String) -> sqlx::Result<SqliteQueryResult> {
    // Insert the task, then obtain the ID of this row
    let conn = SqlitePool::connect("./chic.db").await.unwrap();
    let query = format!(
      "update chic_data set yt_access_token = '{}' where id = 1",
      &access_token
    );
    let query = query.as_str();
    let id = conn.execute(query).await.unwrap();
    Ok(id)
  }
  pub async fn get_access_token() -> Result<String, tokio::task::JoinError> {
    let conn = SqlitePoolOptions::new().connect("./chic.db").await.unwrap();
    let row = conn
      .fetch_one("select yt_code from chic_data")
      .await
      .unwrap();
    let code: String = row.try_get(0).unwrap();
    // let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();
    let client = AuthManager::create_auth_manager();
    let auth_code = AuthorizationCode::new(code);
    let res = spawn_blocking(move || {
      let token_response = client.exchange_code(auth_code).request(http_client);
      token_response.expect("be right")
    })
    .await;

    Ok(res.expect("lool").access_token().secret().clone())

    // if let Ok(token) = res {
    //   let scopes = if let Some(scopes_vec) = token.scopes() {
    //     scopes_vec
    //       .iter()
    //       .map(|comma_separated| comma_separated.split(','))
    //       .flatten()
    //       .collect::<Vec<_>>()
    //   } else {
    //     Vec::new()
    //   };
    //   println!("the scopes: {}", scopes);
    //   println!("the token: {}", token);
    // }
  }
  pub fn get_authorize_url() -> Url {
    let client = AuthManager::create_auth_manager();

    // Google supports Proof Key for Code Exchange (PKCE - https://oauth.net/2/pkce/).
    // Create a PKCE code verifier and SHA-256 encode it as a code challenge.
    // let (pkce_code_challenge, _pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    // Generate the authorization URL to which we ll redirect the user.
    let (authorize_url, _csrf_state) = client
      .authorize_url(CsrfToken::new_random)
      .add_scope(Scope::new(
        "https://www.googleapis.com/auth/youtube.readonly".to_string(),
      ))
      // .set_pkce_challenge(pkce_code_challenge)
      .url();

    println!(
      "Open this URL in your browser: \n{}\n",
      authorize_url.to_string()
    );
    authorize_url
  }
}
