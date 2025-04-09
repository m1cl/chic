pub struct StoppedState;
pub struct PausedState;
pub struct PlayingState;

fn handle_audio_play(file_path: String) -> Result<(), std::io::Error> {
  // Get an output stream handle to the default physical sound device
  let (_stream, stream_handle) = OutputStream::try_default().unwrap();
  // Load a sound from a file, using a path relative to Cargo.toml
  let file = BufReader::new(File::open(file_path).unwrap());
  // Decode that sound file into a source
  let source = Decoder::new(file).unwrap();
  let duration = source.total_duration().unwrap();
  // Play the sound directly on the device
  stream_handle.play_raw(source.convert_samples()).unwrap();

  // The sound plays in a separate audio thread,
  // so we need to keep the main thread alive while it's playing.
  std::thread::sleep(duration);
  Ok(())
}

pub trait State {
  fn play(self: Box<Self>, player: &mut rodio::Sink) -> Box<dyn State>;
  fn stop(self: Box<Self>, player: &mut rodio::Sink) -> Box<dyn State>;
}

impl dyn State {
  pub fn next(self: Box<Self>, player: &mut rodio::Sink) -> Box<dyn State> {
    self
  }
  pub fn prev(self: Box<Self>, player: &mut rodio::Sink) -> Box<dyn State> {
    self
  }
}

impl State for StoppedState {
  fn play(self: Box<Self>, player: &mut rodio::Sink) -> Box<dyn State> {
    player.play();
    Box::new(PlayingState)
  }
}

impl State for PlayingState {
  fn stop(self: Box<Self>, player: &mut rodio::Sink) -> Box<dyn State> {
    player.stop();
    Box::new(PausedState)
  }
}

#[derive(Debug, Clone, Default)]
pub struct Track {
  cursor: u32,
  pub title: String,
  pub path: String,
}

impl Track {
  pub fn new(title: String, path: String) -> Self {
    Self {
      cursor: 0,
      title,
      path,
    }
  }
}

pub struct Player {
  playlist: Vec<Track>,
  current_track: usize,
}

pub struct Player {
  playlist: Vec<Track>,
  current_track: usize,
}

impl Default for Player {
  fn default() -> Self {
    Self {
      playlist: vec![],
      current_track: 0,
    }
  }
}

impl Player {
  pub fn next_track(&mut self) {
    self.current_track = (self.current_track + 1) % self.playlist.len();
  }

  pub fn prev_track(&mut self) {
    if self.current_track > 0 {
      self.current_track -= 1;
    } else {
      self.current_track = self.playlist.len() - 1;
    }
  }

  pub fn play(&mut self) {
    self.track_mut().cursor = 10
  }

  pub fn pause(&mut self) {
    self.track_mut().cursor = 0
  }
}
