// https://dev.to/arnonate/debouncing-react-query-with-hooks-2ek6

import React from "react";

export default function useDebounce(value: string, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  const [isBouncing, setIsBouncing] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
      setIsBouncing(false);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      setIsBouncing(true);
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isBouncing };
}
