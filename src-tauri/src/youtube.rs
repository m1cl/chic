use youtube_dl::YoutubeDl;
// Get all playlists and titles
// youtube-dl --download-archive archive.txt -o '%(playlist_title)s/%(title)s-%(id)s.%(ext)s' "$url"
//
pub async fn get_playlists_from_user()  {
    println!("getting playlist data ");
   let user_channel_url = "https://www.youtube.com/playlist?list=PL_f5dGKW0s3PZPuEy5901LqLQ9vo7HCE8";
   match YoutubeDl::new(user_channel_url)
       .socket_timeout("10")
       .run() {
           Ok(data) => print!("the data is now {:?}", data.into_single_video().unwrap_or_default().artist.unwrap_or_default()),
           Err(e) => eprint!("{:?}", e)
       }
}
