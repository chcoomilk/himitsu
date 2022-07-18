import { useState } from "react";
import { Button, Form, FormControlProps, InputGroup } from "react-bootstrap";
import CopyButton from "../button/CopyButton";

type Props = {
  // value: string,
  // onChange?: (e: React.ChangeEvent<any>) => void,
  // onBlur?: (e: React.ChangeEvent<any>) => void,
  // isInvalid?: boolean,
  name: string,
  errorMessage?: string,
  autoFocus?: boolean,
} & FormControlProps

const PassphraseInputGroup = ({
  name,
  errorMessage,
  autoFocus,
  ...attr
}: Props) => {
  const [mask, setMask] = useState(true);
  const togglePasswordVisibility = () => setMask(!mask);

  return (
    <>
      <Form.Label>
        Passphrase
      </Form.Label>
      <InputGroup>
        <Form.Control
          type={mask ? "password" : "text"}
          autoComplete="current-passphrase"
          placeholder="Enter super secret passphrase"
          aria-describedby="basic-addon2"
          autoFocus={autoFocus}
          {...attr}
        />
        <Button
          size="sm"
          variant="outline-light border-start-0"
          onClick={togglePasswordVisibility}
        >
          {mask ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
        </Button>
        {
          attr.readOnly && <CopyButton value={attr.value} />
        }
        <Form.Control.Feedback type="invalid" tooltip>{errorMessage}</Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default PassphraseInputGroup;
