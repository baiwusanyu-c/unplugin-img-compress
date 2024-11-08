#![deny(clippy::all)]

use std::collections::HashMap;
use path_clean::clean;
use std::fs::{
  canonicalize,
  read,
  write,
  remove_dir_all,
  remove_file,
  copy as org_copy,
  read_to_string,
  File,
};
use serde_json::{Value};
use napi::{JsUnknown, JsObject, JsString, JsBoolean, JsNumber, ValueType};
use napi::bindgen_prelude::{ Env };

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

#[napi]
pub fn read_json(env: Env, path: String) -> Result<JsUnknown, napi::Error> {
  // 读取 JSON 文件内容
  let file_content = read_to_string(&path)
      .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("读取文件失败: {}", e)))?;

  // 解析 JSON 内容
  let json_data: Value = serde_json::from_str(&file_content)
      .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("解析 JSON 失败: {}", e)))?;

  // 将解析的 JSON 返回

  json_to_js_value(&env, json_data)
}

// 辅助函数：递归转换 JSON Value 为 JsUnknown
fn json_to_js_value(env: &Env, value: Value) -> Result<JsUnknown, napi::Error> {
  match value {
    Value::Null => env.get_null().map(|v| v.into_unknown()),
    Value::Bool(b) => env.get_boolean(b).map(|v| v.into_unknown()),
    Value::Number(num) => {
      if let Some(n) = num.as_i64() {
        env.create_int64(n).map(|v| v.into_unknown())
      } else if let Some(n) = num.as_i64() {
        env.create_int32(n as i32).map(|v| v.into_unknown())
      }else if let Some(n) = num.as_u64() {
        env.create_uint32(n as u32).map(|v| v.into_unknown())
      }else if let Some(n) = num.as_f64() {
        env.create_double(n).map(|v| v.into_unknown())
      } else {
        Err(napi::Error::new(napi::Status::GenericFailure, "数字转换失败".to_string()))
      }
    }
    Value::String(s) => env.create_string(&s).map(|v| v.into_unknown()),
    Value::Array(arr) => {
      let mut js_array = env.create_array_with_length(arr.len())?;
      for (i, item) in arr.into_iter().enumerate() {
        let js_value = json_to_js_value(env, item)?;
        js_array.set_element(i as u32, js_value)?;
      }
      Ok(js_array.into_unknown())
    }
    Value::Object(map) => {
      let mut js_object = env.create_object()?;
      for (k, v) in map {
        let js_value = json_to_js_value(env, v)?;
        js_object.set_named_property(&k, js_value)?;
      }
      Ok(js_object.into_unknown())
    }
  }
}


/*#[napi]
pub fn write_json(js_obj: JsUnknown, path: String) -> Result<(), napi::Error> {


}*/


#[napi]
pub fn js_object_to_hashmap(js_obj: JsObject) -> Result<HashMap<String, Value> , napi::Error> {
  let keys = js_obj.get_property_names()?;
  let keys_len = keys.get_array_length()?;
  let mut map: HashMap<String, Value> = HashMap::new();

  for i in 0..keys_len {
    let key_value: JsString = keys.get_element(i)?;
    let key_str = key_value.into_utf8()?.as_str()?.to_string();
    // 获取键对应的值，类型为 Option<JsUnknown>
    let value: Option<JsUnknown> = js_obj.get(&key_str)?;

    if let Some(val) = value {
        match val.get_type() {
          Ok(ValueType::Number) => {
            let js_num: JsNumber = val.coerce_to_number()?;
            map.insert(key_str, js_num.get_int32()?.into());
          }
          Ok(ValueType::String) => {
            let js_str: JsString = val.coerce_to_string()?;
            map.insert(key_str, js_str.into_utf8()?.as_str()?.into());
          }
          Ok(ValueType::Boolean) => {
            let js_bool: JsBoolean = val.coerce_to_bool()?;
            map.insert(key_str, js_bool.get_value()?.into());
          }
          _ => {}
        }
    }
  }

  Ok(map)

}