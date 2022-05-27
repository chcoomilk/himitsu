use std::env;
use std::fs;
use std::path;

fn main() {
    let args: Vec<String> = env::args().collect();

    let query = &args[1];
    let dir_path_arg = &args[2];
    let mut file_var: String;
    let mut file_value: String;

    match query.as_str() {
        "ts-type" => {
            file_var = "type T =".to_owned();
            file_value = "".to_owned();
            println!("transform to {}", query);
            println!("with folder {}", &dir_path_arg);
            let dir_path = path::Path::new(dir_path_arg);
            if dir_path.is_dir() {
                for entry in fs::read_dir(dir_path).unwrap() {
                    match entry {
                        Ok(entry) => {
                            let path = entry.path();
                            if path.is_dir() {
                                continue;
                            }

                            let t = path.file_stem().unwrap().to_str().unwrap();
                            file_value = file_value + " \"" + t + "\" |";
                        }
                        Err(e) => println!("{e}"),
                    }
                }

                if file_value.is_empty() {
                    println!("folder is empty");
                    return
                } else {
                    file_value.pop().unwrap();
                    file_value.pop().unwrap();
                    file_var.push_str(&file_value);
                }
            } else {
                println!("path is not leading into a valid directory");
                return
            }
        }
        _ => {
            println!("invalid query");
            return
        }
    }

    let result = file_var;

    println!("{result}")
}
