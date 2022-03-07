import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

type Props = {
  value: string,
  name: string,
  // React.ChangeEventHandler<FormControlElement>
  onChange?: (e: any) => void,
  onBlur?: (e: any) => void,
  onError?: string,
  isInvalid?: boolean,
  readOnly?: boolean,
  disabled?: boolean,
  jsxAddons?: JSX.Element,
}

const PassphraseInputGroup = ({
  value,
  onChange,
  onBlur,
  onError,
  isInvalid,
  name,
  jsxAddons,
  readOnly,
  disabled,
}: Props) => {
  const [mask, setMask] = useState(true);
  console.log(readOnly);
  
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
          disabled={disabled}
        />
        <Button
          size="sm"
          variant="outline-light"
          onClick={() => setMask(!mask)}
        >
          {mask ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
        </Button>
        {
          jsxAddons
        }
        <Form.Control.Feedback type="invalid" tooltip>{onError}</Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default PassphraseInputGroup;
