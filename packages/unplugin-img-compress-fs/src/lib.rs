#![deny(clippy::all)]
use std::fs::{ read, write};
use path_clean::{clean};
#[macro_use]
extern crate napi_derive;

#[napi]
pub fn read_file(path: String) -> Result<Vec<u8>, napi::Error> {
  let normalize_path = clean(path);
  let data = read(normalize_path)
    .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("读取文件失败: {}", e)))?;
  Ok(data)
}

#[napi]
pub fn out_put_file(path: String, data: Vec<u8>) -> Result<(), napi::Error> {
  let normalize_path = clean(path);
   write(normalize_path, data)
      .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("存储文件失败: {}", e)))?;
  Ok(())
}
