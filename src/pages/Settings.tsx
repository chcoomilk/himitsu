import { useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { AppTheme } from "../utils/types";
import * as changeCase from "change-case";

const Settings = () => {
  const [theme, setTheme] = useState<AppTheme>(AppTheme.Normal);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      switch (savedTheme) {
        case AppTheme.Normal:
          setTheme(AppTheme.Normal);
          break;

        case AppTheme.Black:
          setTheme(AppTheme.Black);
          break;

        case AppTheme.Light:
          setTheme(AppTheme.Light);
          break;

        default:
          setTheme(AppTheme.Normal);
          break;
      }
    } else {
      setTheme(AppTheme.Normal);
    }
  }, [setTheme]);

  useEffect(() => {
    console.log(theme);

    changeTheme(theme);
  }, [theme]);

  const changeTheme = (t: AppTheme) => {
    window.localStorage.setItem("theme", t);
    window.document.documentElement.setAttribute("data-theme", t);
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
                      onChange={_ => setTheme(value)}
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
