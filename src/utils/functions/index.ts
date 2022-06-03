import generate_face from "./generate_face";
import into_readable_datetime from "./into_readable_datetime";
import truncate_string from "./truncate_string";
import local_storage from "./local_storage";
// import * as is from "./is";
import * as _unwrap from "./unwrap";

// const assert = {
//     ...is
// };

const unwrap = {
    ..._unwrap
};

export {
    truncate_string,
    generate_face,
    into_readable_datetime,
    local_storage,
    // assert,
    unwrap,
};
