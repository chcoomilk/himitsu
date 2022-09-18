import { useState, forwardRef } from "react";
import { Button, Form, FormControlProps, FormTextProps, InputGroup } from "react-bootstrap";
import CopyButton from "../button/CopyButton";

type Field = {
  passphrase: string,
}

type Props = {
  customLabel?: string | null,
  hide?: boolean,
  inputGroupClassName?: string,
  errorMessage?: string | null,
  autoFocus?: boolean,
} & FormControlProps & FormTextProps

const PassphraseInputGroup = forwardRef(({
  customLabel,
  hide,
  inputGroupClassName,
  errorMessage,
  ...attr
}: Props, ref) => {
  const [mask, setMask] = useState(true);
  const togglePasswordVisibility = () => setMask(prev => !prev);

  return (
    <div hidden={hide} className={inputGroupClassName}>
      {
        customLabel === null
          ? null
          : <Form.Label>
            {customLabel || "Passphrase"}
          </Form.Label>
      }

      <InputGroup hasValidation>
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
    </div>
  );
});

export default PassphraseInputGroup;
