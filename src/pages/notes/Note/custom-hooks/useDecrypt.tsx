import { AES, enc as Encoder } from "crypto-js";
import { useCallback } from "react";

type Args = {
  onFail: () => void,
  onSuccess: (decryptedContent: String) => void,
}

const useDecrypt = ({ onFail, onSuccess }: Args) => {
  const decrypt = useCallback((content: string, passphrase: string) => {
    try {
      content = AES.decrypt(content, passphrase).toString(Encoder.Utf8);
      content = JSON.parse(content);
      if (!content) onFail();
      onSuccess(content);
    } catch (error) {
      onFail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // this shouldn't need to be wrapped in useCallback

  return decrypt;
};

export default useDecrypt;
