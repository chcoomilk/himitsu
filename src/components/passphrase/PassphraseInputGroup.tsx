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
  customLabel?: string | null,
  hide?: boolean,
  groupcName?: string,
} & FormControlProps

const PassphraseInputGroup = ({
  name,
  errorMessage,
  autoFocus,
  customLabel,
  hide,
  groupcName,
  ...attr
}: Props) => {
  const [mask, setMask] = useState(true);
  const togglePasswordVisibility = () => setMask(!mask);

  return (
    <div hidden={hide} className={groupcName}>
      {
        customLabel === null
          ? null
          : <Form.Label>
            {customLabel || "Passphrase"}
          </Form.Label>
      }

      <InputGroup hasValidation>
        <Form.Control
          name={name}
          type={mask ? "password" : "text"}
          autoComplete="current-passphrase"
          placeholder="Enter super secret passphrase"
          aria-describedby="basic-passphrase-input"
          autoFocus={autoFocus}
          {...attr}
          style={{
            ...attr.style,
            zIndex: 3,
          }}
        />
        <Button
          size="sm"
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
};

export default PassphraseInputGroup;
