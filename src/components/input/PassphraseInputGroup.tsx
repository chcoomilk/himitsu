import { useState, forwardRef } from "react";
import { Button, Form, FormControlProps, FormTextProps, InputGroup } from "react-bootstrap";
import CopyButton from "../button/CopyButton";

type Props = {
  hide?: boolean,
  inputGroupClassName?: string,
  errorMessage?: string | null,
  autoFocus?: boolean,
} & FormControlProps & FormTextProps

const PassphraseInputGroup = forwardRef(({
  hide,
  inputGroupClassName,
  errorMessage,
  ...attr
}: Props, ref) => {
  const [mask, setMask] = useState(true);
  const togglePasswordVisibility = () => setMask(prev => !prev);

  return (
    <InputGroup className={inputGroupClassName} hidden={hide} hasValidation>
      <Form.Control
        type={mask ? "password" : "text"}
        autoComplete="current-passphrase"
        placeholder="Enter super secret passphrase"
        aria-describedby="basic-passphrase-input"
        ref={ref}
        {...attr}
        style={
          typeof attr.style == "object"
            ? {
              ...attr.style,
              zIndex: 3,
            }
            : { zIndex: 3 }
        }
      />
      <Button
        variant="outline-light border-start-0"
        onClick={togglePasswordVisibility}
      >
        {mask ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
      </Button>
      {
        attr.readOnly && <CopyButton copy_value={attr.value} />
      }
      <Form.Control.Feedback type="invalid" tooltip>{errorMessage}</Form.Control.Feedback>
    </InputGroup>
  );
});

export default PassphraseInputGroup;
