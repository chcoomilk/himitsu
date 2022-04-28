import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import CopyButton from "../button/CopyButton";

type Props = {
  value: string,
  name: string,
  onChange?: (e: React.ChangeEvent<any>) => void,
  onBlur?: (e: React.ChangeEvent<any>) => void,
  errorMessage?: string,
  isInvalid?: boolean,
  readOnly?: boolean,
  disabled?: boolean,
}

const PassphraseInputGroup = ({
  value,
  onChange,
  onBlur,
  errorMessage,
  isInvalid,
  name,
  readOnly,
  disabled,
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
          name={name}
          readOnly={readOnly}
          type={mask ? "password" : "text"}
          autoComplete="current-passphrase"
          placeholder="Enter super secret passphrase"
          onChange={onChange}
          onBlur={onBlur}
          isInvalid={isInvalid}
          value={value}
          aria-describedby="basic-addon2"
          disabled={disabled}
        />
        <Button
          size="sm"
          variant="outline-light border-start-0"
          onClick={togglePasswordVisibility}
        >
          {mask ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
        </Button>
        {
          readOnly && <CopyButton value={value} />
        }
        <Form.Control.Feedback type="invalid" tooltip>{errorMessage}</Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default PassphraseInputGroup;
