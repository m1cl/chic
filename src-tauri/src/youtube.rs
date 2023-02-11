extern crate google_youtube3 as youtube3;
extern crate hyper;
extern crate hyper_rustls;
use std::default::Default;
use youtube3::{hyper, hyper_rustls, oauth2, YouTube};
use youtube3::{Error, Result};

async fn init_youtube() {
  // Get an ApplicationSecret instance by some means. It contains the `client_id` and
  // `client_secret`, among other things.
  let secret: oauth2::ApplicationSecret = Default::default();
  // Instantiate the authenticator. It will choose a suitable authentication flow for you,
  // unless you replace  `None` with the desired Flow.
  // Provide your own `AuthenticatorDelegate` to adjust the way it operates and get feedback about
  // what's going on. You probably want to bring in your own `TokenStorage` to persist tokens and
  // retrieve them from storage.
  let auth = oauth2::InstalledFlowAuthenticator::builder(
    secret,
    oauth2::InstalledFlowReturnMethod::HTTPRedirect,
  )
  .build()
  .await
  .unwrap();
  let mut hub = YouTube::new(
    hyper::Client::builder().build(
      hyper_rustls::HttpsConnectorBuilder::new()
        .with_native_roots()
        .https_or_http()
        .enable_http1()
        .enable_http2()
        .build(),
    ),
    auth,
  );
  // You can configure optional parameters by calling the respective setters at will, and
  // execute the final call using `doit()`.
  // Values shown here are possibly random and not representative !
  let result = hub
    .videos()
    .list(&vec!["gubergren".into()])
    .video_category_id("Lorem")
    .region_code("gubergren")
    .page_token("eos")
    .on_behalf_of_content_owner("dolor")
    .my_rating("ea")
    .max_width(-55)
    .max_results(13)
    .max_height(-47)
    .locale("duo")
    .add_id("ipsum")
    .hl("sed")
    .chart("ut")
    .doit()
    .await;
}
