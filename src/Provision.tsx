import { Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Spinner } from "react-bootstrap";

import AppSettingContext from "./utils/AppSettingContext";
import { AppSetting } from "./utils/types";
import { local_storage } from "./utils/functions";
import { patch_token } from "./queries";
import Navbar from "./components/Navbar";
import ReactQuery from "./libs/react-query";

type Args = {
  children: React.ReactNode,
  appSettings: AppSetting,
}

const Initialization = ({ appSettings, children }: Args) => {
  useEffect(() => {
    let refresh_token_interval = setInterval(() => {
      const token = local_storage.get("token");
      if (token) {
        const last_refresh_str = localStorage.getItem("refresh_token_timestamp");

        let schedule: Date = new Date();
        if (last_refresh_str) {
          let last_refresh_datetype = new Date(last_refresh_str);
          if (last_refresh_datetype instanceof Date && !isNaN(last_refresh_datetype.valueOf())) {
            schedule = last_refresh_datetype;
          }
        }

        if (schedule <= new Date()) {
          patch_token({ token });
        }
      }
    }, 30000);

    return () => {
      clearInterval(refresh_token_interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppSettingContext.Provider
        value={appSettings}
      >
        <ReactQuery>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Navbar />
          <Suspense fallback={
            <Spinner animation="border" role="status"
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                top: "50vh",
                left: 0,
                right: 0,
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          }>
            {children}
          </Suspense>
        </ReactQuery>
      </AppSettingContext.Provider>
    </BrowserRouter>
  );
};

export default Initialization;
