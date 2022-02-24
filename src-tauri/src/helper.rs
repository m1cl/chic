use lazy_static::lazy_static;
use std::{
  cell::RefCell,
  collections::HashMap,
  fs::{create_dir_all, read_to_string, File, OpenOptions},
  io::{BufRead, BufReader, Write},
  path::Path,
  sync::Mutex,
};

fn get_conf_dir() -> String {
  let home_config_dir = dirs::config_dir().unwrap().display().to_string();
  format!("{}/{}", home_config_dir, "chic")
}
fn get_conf_file() -> String {
  let home_config_dir = get_conf_dir();
  format!("{}/chic.conf", &home_config_dir)
}
pub async fn youtube_code_exists() -> bool {
  let mut code_exists = false;
  let file = File::open(get_conf_file()).unwrap();
  let file = BufReader::new(file);
  for lines in file.lines() {
    let lines = lines.unwrap();
    let l: Vec<&str> = lines.split("=").collect();
    if l.first().unwrap().contains("YOUTUBE_CODE") {
      if !l.last().is_none() {
        code_exists = true;
        break;
      }
    }
  }
  code_exists
}
pub fn save_yt_code(code: String) {
  println!("this is the code: {}, ", &code);
  let mut file = OpenOptions::new()
    .append(true)
    .open(&get_conf_file())
    .expect("Couldn t open config file");
  file
    .write_all(format!("YOUTUBE_CODE={}", code).as_bytes())
    .expect("Couldn t save youtube to code");
  println!("File saving was successful");
}
pub async fn create_config_file() {
  let path = get_conf_dir();
  let file_name = get_conf_file();
  create_dir_all(Path::new(&path)).expect("Couldn't create directory");
  if Path::new(&file_name).is_file() {
    let content = read_to_string(&file_name).unwrap();
    println!("this is the content {}", content);
  } else {
    File::create(&file_name)
      .unwrap()
      .write(b"")
      .expect("Couldn t create file");
  }
}
