import { useRef, useState } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";

type Props = {
  copy_value: any,
  size?: "lg" | "sm",
}

const CopyButton = ({ copy_value: value, size }: Props) => {
  const [tooltip, setTooltip] = useState(false);
  const target = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setTooltip(true);
    let timer = setTimeout(() => setTooltip(false), 1200);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <Button
        title="Copy value"
        size={size}
        variant="outline-light"
        id="button-addon2"
        onClick={handleCopy}
        ref={target}
      >
        <i className="bi bi-clipboard2-plus" />
      </Button>
      <Overlay target={target.current} show={tooltip} placement="right">
        {(props) => (
          <Tooltip {...props}>
            Copied!
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default CopyButton;
