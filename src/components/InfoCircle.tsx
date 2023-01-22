import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type Props = {
  id?: string,
  children: React.ReactNode,
}

const InfoCircle = ({ id = "basic", children }: Props) => {
  const [active, setActive] = useState(false);

  return (
    <OverlayTrigger
      placement="auto"
      overlay={
        <Tooltip id={"overlay-" + id}>
          {children}
        </Tooltip>
      }
      onToggle={(nextShow) => setActive(nextShow)}
    >
      <i className="bi bi-question-circle" style={active ? { filter: "opacity(75%)" } : undefined} />
    </OverlayTrigger>
  );
};

export default InfoCircle;
