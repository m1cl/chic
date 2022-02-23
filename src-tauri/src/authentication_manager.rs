extern crate dotenv;
use dotenv::dotenv;
use oauth2::basic::BasicClient;
// Alternatively, this can be oauth2::curl::http_client or a custom.
use oauth2::{
  AuthUrl, ClientId, ClientSecret, CsrfToken, PkceCodeChallenge, RedirectUrl, RevocationUrl, Scope,
  TokenUrl,
};
use std::env;
use url::Url;

pub struct AuthManager {
  pub authorize_url: Url,
}

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
  pub fn get_authorize_url() -> Url {
    let client = AuthManager::create_auth_manager();

    // Google supports Proof Key for Code Exchange (PKCE - https://oauth.net/2/pkce/).
    // Create a PKCE code verifier and SHA-256 encode it as a code challenge.
    // let (pkce_code_challenge, _pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    // Generate the authorization URL to which we ll redirect the user.
    let (authorize_url, _csrf_state) = client
      .authorize_url(CsrfToken::new_random)
      .add_scope(Scope::new(
        "https://www.googleapis.com/auth/youtube".to_string(),
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
