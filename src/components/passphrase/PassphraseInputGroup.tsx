import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

type Props = {
  value: string,
  name: string,
  onChange?: (e: React.ChangeEvent) => void,
  onBlur?: (e: React.ChangeEvent) => void,
  onError?: string,
  isInvalid?: boolean,
  readOnly?: boolean,
  jsx_elements?: JSX.Element,
}

const PassphraseInputGroup = ({ value, onChange, onBlur, onError, isInvalid, name, jsx_elements, readOnly }: Props) => {
  const [mask, setMask] = useState(true);

  return (
    <>
      <Form.Label >
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
        />
        <Button
          size="sm"
          variant="outline-light"
          onClick={() => setMask(!mask)}
        >
          {mask ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
        </Button>
        {
          jsx_elements
        }
        <Form.Control.Feedback type="invalid" tooltip>{onError}</Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default PassphraseInputGroup;
