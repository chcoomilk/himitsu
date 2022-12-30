import { useEffect, useRef } from "react";

const _default = document.querySelector('meta[name="description"]')?.getAttribute("content")
  || `Open source pastebin service with data encryption. 
  No login or registration required and it can be installed as PWA on Android or iOS.`;

type DescribeFunction = (value: string) => void

const useDescribe = (description: string): DescribeFunction => {
  const meta_description = useRef(document.querySelector('meta[name="description"]'));

  const describe = (description: string): void => {
    meta_description.current?.setAttribute("content", description);
  };

  useEffect(() => {
    describe(description);

    return () => describe(_default);
  }, [description]);

  return describe;
};

export default useDescribe;
