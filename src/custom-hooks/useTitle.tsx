import { useEffect, useState } from "react";
import { generate_face } from "../utils/functions";

type Args = string

let appname = document.title;
/**
 * initialize page title when react renders the page
 * (e.g. "/" to "/somewhere-else") and/or when react-router changes the route or something
 *  */
const useTitle = (initialTitleToRender: Args) => {
  const [title, setTitle] = useState(initialTitleToRender);
  const [defaultTitle] = useState(appname);

  useEffect(() => {
    if (title.trim().replace(" ", () => { return ""; })) {
      document.title = `${title} | ${defaultTitle} `;
    } else {
      document.title = `${generate_face()} | ${defaultTitle} `;
    }

    return () => {
      document.title = defaultTitle;
    };
  }, [defaultTitle, title, setTitle]);

  return setTitle;
};

export default useTitle;
