extern crate dotenv;
use dotenv::dotenv;
use oauth2::{basic::BasicClient, TokenResponse};
// Alternatively, this can be oauth2::curl::http_client or a custom.
use oauth2::{
    reqwest::http_client, AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken,
    RedirectUrl, RevocationUrl, Scope, TokenUrl,
};
use reqwest::Result;
use std::env;
use tokio::task::spawn_blocking;
use url::Url;

mod youtube;

pub struct AuthManager {
    pub client: BasicClient,
}

impl AuthManager {
    pub fn init(api_name: &str) -> Self {
        dotenv().ok();
        let client_id: ClientId;
        let client_secret: Option<ClientSecret>;
        let auth_url: AuthUrl;
        let token_url: Option<TokenUrl>;
        match api_name {
            "google" => {
                client_id = ClientId::new(
                    env::var("GOOGLE_CLIENT_ID").expect("Missing the GOOGLE_CLIENT_ID env var"),
                );
                client_secret = Some(ClientSecret::new(
                    env::var("GOOGLE_CLIENT_SECRET")
                        .expect("Missing the GOOGLE_CLIENT_SECRET env var"),
                ));
                auth_url = AuthUrl::new(
                    env::var("GOOGLE_AUTH_URL").expect("Missing the GOOGLE_AUTH_URL env var"),
                )
                .unwrap();
                token_url = Some(
                    TokenUrl::new(
                        env::var("GOOGLE_TOKEN_URL").expect("Missing the GOOGLE_TOKEN_URL env var"),
                    )
                    .unwrap(),
                )
            }
            "discogs" => {
                client_id = Some(ClientId::new(
                    env::var("DISCOGS_CLIENT_ID").expect("Missing the DISCOGS_CLIENT_ID env var"),
                ))
                .unwrap();
                client_secret = Some(ClientSecret::new(
                    env::var("DISCOGS_CLIENT_SECRET")
                        .expect("Missing the DISCOGS_CLIENT_SECRET env var"),
                ));
                auth_url = AuthUrl::new(
                    env::var("DISCOGS_AUTH_URL").expect("Missing the DISCOGS_AUTH_URL env var"),
                )
                .unwrap();
                token_url = Some(
                    TokenUrl::new(
                        env::var("GOOGLE_TOKEN_URL").expect("Missing the GOOGLE_TOKEN_URL env var"),
                    )
                    .unwrap(),
                )
            }
            _ => {
                panic!("Invalid API name");
            }
        }
        // Set up the config for the google oauth2 process
        let client = BasicClient::new(client_id, client_secret, auth_url, token_url)
            .set_redirect_uri(
                RedirectUrl::new(
                    env::var("REDIRECT_URL").expect("Missing the REDIRECT_URL env var"),
                )
                .expect("Invalid redirect URL"),
            )
            .set_revocation_uri(
                RevocationUrl::new(
                    env::var("REVOCATION_URL").expect("Missing the REVOCATION_URL env var"),
                )
                .expect("Invalid revocation endpoint URL"),
            );
        AuthManager { client }
    }

    pub async fn receive_access_token(&self, code: String) -> Result<()> {
        let auth_code = AuthorizationCode::new(code);
        let m_client = self.client.clone();
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
        // let result = self.store_access_token(access_token.into()).await;
        // println!(
        //     "storing access token result: {}",
        //     result.unwrap().rows_affected()
        // );
        Ok(())
        // client
        //   .revoke_token(token_to_revoke)
        //   .unwrap()
        //   .request(http_client)
        //   .expect("Failed to revoke");
    }
    // async fn store_access_token(&self, access_token: String) -> sqlx::Result<SqliteQueryResult> {
    //     // Insert the task, then obtain the ID of this row
    //     let conn = SqlitePool::connect("./chic.db").await.unwrap();
    //     let query = format!(
    //         "update chic_data set yt_access_token = '{}' where id = 1",
    //         &access_token
    //     );
    //     let query = query.as_str();
    //     let id = conn.execute(query).await.unwrap();
    //     Ok(id)
    // }
    // pub async fn get_access_token(&self) -> Result<String, tokio::task::JoinError> {
    //     let conn = SqlitePoolOptions::new().connect("./chic.db").await.unwrap();
    //     let row = conn
    //         .fetch_one("select yt_code from chic_data")
    //         .await
    //         .unwrap();
    //     let code: String = row.try_get(0).unwrap();
    //     // let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();
    //     let auth_code = AuthorizationCode::new(code);
    //     let client = self.client.clone();
    //     let res = spawn_blocking(move || {
    //         let token_response = client.exchange_code(auth_code).request(http_client);
    //         token_response.expect("be right")
    //     })
    //     .await;

    //     Ok(res.expect("lool").access_token().secret().clone())

    //     // if let Ok(token) = res {
    //     //   let scopes = if let Some(scopes_vec) = token.scopes() {
    //     //     scopes_vec
    //     //       .iter()
    //     //       .map(|comma_separated| comma_separated.split(','))
    //     //       .flatten()
    //     //       .collect::<Vec<_>>()
    //     //   } else {
    //     //     Vec::new()
    //     //   };
    //     //   println!("the scopes: {}", scopes);
    //     //   println!("the token: {}", token);
    //     // }
    // }
    pub fn get_authorize_url(&self) -> Url {
        // Google supports Proof Key for Code Exchange (PKCE - https://oauth.net/2/pkce/).
        // Create a PKCE code verifier and SHA-256 encode it as a code challenge.
        // let (pkce_code_challenge, _pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

        // Generate the authorization URL to which we ll redirect the user.
        let (authorize_url, _csrf_state) = self
            .client
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
