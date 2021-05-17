import { useEffect, useState } from "react";
// import { BaseUrl } from "./constants";

const useLoginStatus = () => {
  const token = localStorage.getItem("token");
  const [login, setLogin] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          // const response = await fetch(BaseUrl + "/validate-token", {
          //   method: "POST",
          //   headers: {
          //     "Authorization": "Bearer " + token,
          //   }
          // });
          // if (response.status == 100) setLogin(true);
          setLogin(true); // Remove this before uncomment
          setStatus(true);
        } catch (error) {
          setStatus(true);
          console.error(error);
        }
      })();
    } else {
      setStatus(true);
    }
  }, [token]);

  return { status, login }
};

export default useLoginStatus;
