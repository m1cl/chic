// https://diesel.rs/guides/getting-started
pub fn init() {
  if !db_file_exists() {
    create_db_file();
    create_db_tables();
  }
}

fn db_file_exists() -> bool {
  std::path::Path::new(homedir::home_dir().unwrap().join(".chic.db")).exists()
}
