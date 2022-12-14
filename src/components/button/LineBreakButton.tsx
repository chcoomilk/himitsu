import { Button, ButtonProps, Col, Row, RowProps } from "react-bootstrap";

type Props = {
  text?: React.ReactNode,
  componentProps?: RowProps,
} & ButtonProps & React.MouseEventHandler<HTMLButtonElement>

const LineBreakButton = ({ text, componentProps: { ...rowAttr }, ...attr }: Props) => {
  return (
    <Row {...rowAttr}>
      <Col>
        <hr />
      </Col>
      <Col>
        <Button
          {...attr}
        >
          {text}
        </Button>
      </Col>
      <Col>
        <hr />
      </Col>
    </Row>
  );
};

export default LineBreakButton;
