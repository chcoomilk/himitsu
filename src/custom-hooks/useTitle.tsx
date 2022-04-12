import { useEffect, useState } from "react";
import { generate_face } from "../utils/functions";

const useTitle = (initialTitle: string) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    const defaultTitle = "himitsu";
    if (title.trim().replace(" ", () => { return ""; })) {
      document.title = `${title} | ${defaultTitle} `;
    } else {
      document.title = `${generate_face()} | ${defaultTitle} `;
    }
    return () => {
      document.title = defaultTitle;
    };
  }, [title, setTitle]);

  return setTitle;
};

export default useTitle;