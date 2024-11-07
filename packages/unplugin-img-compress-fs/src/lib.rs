#![deny(clippy::all)]
use path_clean::clean;
use std::fs::{canonicalize, read, write, remove_dir_all, remove_file, copy as org_copy};
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

#[napi]
pub async fn path_exists(path: String) -> bool {
  let result = match canonicalize(path) {
    Ok(_) => true,
    Err(_) => false,
  };
  result
}



#[napi]
pub async fn remove(path: String) -> Result<(), napi::Error> {
  let normalize_path = canonicalize(path).map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("路径标准化失败: {}", e)))?;
  if normalize_path.is_dir() {
    remove_dir_all(normalize_path)
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("删除失败: {}", e)))?;
  } else if normalize_path.is_file() {
    remove_file(normalize_path)
        .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("删除失败: {}", e)))?;
  } else {
    return Err(napi::Error::new(napi::Status::GenericFailure, "路径既不是文件也不是目录".to_string()));
  }
  Ok(())
}

#[napi]
pub fn copy(src: String, dest: String) -> Result<(), napi::Error> {
 org_copy(src, dest)
      .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("复制文件失败: {}", e)))?;
  Ok(())
}