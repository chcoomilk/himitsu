import { useRef, useState } from "react";
import { Button, Form, InputGroup, Overlay, Tooltip } from "react-bootstrap";

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
  const [tooltip, setTooltip] = useState(false);
  const target = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setTooltip(true);
    let timer = setTimeout(() => setTooltip(false), 1200);
    return () => clearTimeout(timer);
  };

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
          variant="outline-light"
          onClick={togglePasswordVisibility}
        >
          {mask ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
        </Button>
        {
          readOnly && (
            <>
              <Button
                size="sm"
                variant="outline-light"
                id="button-addon2"
                onClick={handleCopy}
                ref={target}
              >
                <i className="bi bi-journals" />
              </Button>
              <Overlay target={target.current} show={tooltip} placement="right">
                {(props) => (
                  <Tooltip {...props}>
                    Copied!
                  </Tooltip>
                )}
              </Overlay>
            </>
          )
        }
        <Form.Control.Feedback type="invalid" tooltip>{errorMessage}</Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default PassphraseInputGroup;
