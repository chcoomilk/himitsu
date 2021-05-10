import { useEffect, useRef, useState } from "react";

const useFetch = (url: string) => {
  const cache = useRef<any>(Object);
  const [counter, setCounter] = useState<number>(0); // DEBUG
  const [status, setStatus] = useState<string>("idle");
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [refetchFlag, setRefetch] = useState(false);

  const fetchData = async () => {
    setCounter(counter + 1);
    setStatus("loading");
    if (cache.current[url]) {
      setData(cache.current[url])
      setStatus("success");
    } else {
      try {
        const response = await fetch(url, {
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") || ""
          }
        });
        if (response.status == 403) {
          localStorage.clear();
          throw response;
        };
        if (response.ok) {
          const data = await response.json();
          cache.current[url] = data;
          setData(data);
          setStatus("success");
        } else throw response;
      } catch (e) {
        setError(true);
        console.log(e);
      }
    }
  };

  const refetch = async () => {
    function getPathFromUrl(val: string): string {
      return val.split(/[?#]/)[0];
    }

    const original_path = getPathFromUrl(url);
    for (const path in cache.current) {
      if (getPathFromUrl(path) == original_path) delete cache.current[path];
    }
    delete cache.current[url];
    setRefetch(true);
    await fetchData();
    setRefetch(false);
  };

  useEffect(() => {
    if (!url) return;
    fetchData();
    return () => {
      setStatus("unmounted");
    };
  }, [url]);

  // useEffect(() => {
  //   // DEBUG
  //   // console.log(counter);
  //   // console.log("status from counter change >>> ", status);
  // }, [counter]);

  useEffect(() => {
    if (refetchFlag) {
      fetchData();
    }
  }, [refetchFlag])

  return { status, data, error, refetch };
};

export default useFetch;
