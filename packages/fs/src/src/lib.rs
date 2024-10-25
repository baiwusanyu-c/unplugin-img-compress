
#![deny(clippy::all)]
use std::fs::{ canonicalize, read };

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn read_file(path: String) -> Result<Vec<u8>, napi::Error> {
  let normalize_path = canonicalize(path).map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("路径标准化失败: {}", e)))?;
  let data = read(normalize_path).map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("读取文件失败: {}", e)))?;
  Ok(data)
}
