import { useEffect, useState } from "react";

const useTitle = (initialTitle: string) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    const defaultTitle = "himitsu";
    document.title = `${title} | ${defaultTitle} `;
    return () => {
      document.title = defaultTitle;
    };
  }, [title, setTitle]);

  return setTitle;
};

export default useTitle;