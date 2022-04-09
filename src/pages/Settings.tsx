import { Col, Row, Form } from "react-bootstrap";
import { AppTheme } from "../utils/types";
import * as changeCase from "change-case";

type Parameter = {
  theme: AppTheme,
  setTheme: React.Dispatch<React.SetStateAction<AppTheme>>,
}

const Settings = ({ theme, setTheme }: Parameter) => {
  const changeTheme = (t: AppTheme) => {
    setTheme(t);
    window.localStorage.setItem("theme", t);
  };

  return (
    <Row>
      <Col xs={{ span: 4, offset: 4 }}>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Theme
            </Form.Label>
            <Col sm="10">
              {
                Object.values(AppTheme).map(value => {
                  return (
                    <Form.Check
                      inline
                      className="pt-2"
                      key={value}
                      type="radio"
                      name="theme"
                      checked={theme === value}
                      id={value}
                      label={changeCase.capitalCase(value)}
                      onChange={_ => changeTheme(value)}
                    />
                  );
                })
              }
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Settings;
