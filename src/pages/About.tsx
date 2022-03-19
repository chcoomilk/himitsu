import { useState } from "react";
import { Accordion, Col, Container, Row, Image } from "react-bootstrap";
import kanna from "../media/kanna.gif";
import ts_gif from "../media/ts.gif";
import rust_gif from "../media/rust.gif";
import disgusted from "../media/ramsay.jpg";

const holy_list = {
  normal_text_1: "To yours truly,",
  normal_text_2: "a private note app built with actix on backend and good ol' react on frontend",
  uwufied_text_1: "To youws twuwy, OwO",
  uwufied_text_2: "pwivate nyote app b-buiwt with nyactix o-on byackend and g-good ow' weact o-on fwontend"
};

const About = () => {
  const [texts, setTexts] = useState({
    text1: holy_list.normal_text_1,
    text2: holy_list.normal_text_2,
    uwu: false
  });
  let timer: NodeJS.Timeout;

  const toggleText = () => {
    texts.uwu
      ? setTexts({
        text1: holy_list.normal_text_1,
        text2: holy_list.normal_text_2,
        uwu: false
      })
      : setTexts({
        text1: holy_list.uwufied_text_1,
        text2: holy_list.uwufied_text_2,
        uwu: true
      });
  };

  return (
    <Container>
      <Row>
        <Col xl={{ offset: 1, span: 10 }} xs={12}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Welcome!
              </Accordion.Header>
              <Accordion.Body>
                <h2>
                  {texts.text1 + " "}
                  <small className="fs-5">
                    {texts.text2}<span onClick={e => {
                      clearTimeout(timer);
                      if (e.detail === 1) {
                        timer = setTimeout(() => { }, 200);
                      } else if (e.detail === 2) {
                        toggleText();
                      }
                    }}>.</span>
                  </small>
                </h2>

                <p>
                  Below is basically brief of explanations about this web app.
                  If you have any more questions {" "}
                  <small className="text-nowrap" style={{ fontSize: "0.4em" }}>
                    ...i will not answer any of them *dabs away*
                  </small>
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How can we trust you no peeky peek!?</Accordion.Header>
              <Accordion.Body className="clearfix text-center"> {/* this is so the image is centered when screen is small */}
                <Image fluid src={kanna} alt="scary_dragon" className="col-md-6 float-md-end mb-3 ms-md-3" />
                <h2 className="text-start">
                  You can't.. <a href="https://www.youtube.com/watch?v=TN25ghkfgQA" style={{ textDecoration: "none" }}>or can you</a>?
                </h2>
                <p className="fs-6 text-start">
                  You can check out how this app work on the GitHub repo down below.
                  But here's the kicker, there's no telling if the backend server deployed is same as in the source code.
                  <br />
                  This means I can add some code to take a little peek at your buttho-, I mean note.
                  But fret not gamers, because here is a kanna gif to make you feel better
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2.1">
              <Accordion.Header>What does frontend encryption mean?</Accordion.Header>
              <Accordion.Body>
                <h2>
                  It means the data is encrypted before going into the server
                </h2>
                <p className="fs-6 mt-4">
                  If the server platform decides to log all incoming requests,
                  they can only see the encrypted strings of data.
                  And of course, the decryption will also be done on the client side.
                  This is great if you don't trust the server you're sending the data to.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2.2">
              <Accordion.Header>What does backend encryption mean?</Accordion.Header>
              <Accordion.Body>
                <h2>
                  It means the data will be encrypted in the server
                </h2>
                <p className="fs-6 mt-4">
                  Before your note is saved, the backend will encrypt the data of the note.
                  After that, each request of the saved note will be required to include a passphrase before any data is sent.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Which encryption method should I choose?</Accordion.Header>
              <Accordion.Body>
                <h2>
                  It depends..
                </h2>
                <p className="fs-6 mt-4">
                  If you are planning to save it for a long period of time. I recommend choosing backend encryption,
                  because it's just much harder to get to.
                  Otherwise, choose frontend if you don't feel you can trust the server.. or none so everyone can
                  see your little secret you dirty pig
                </p>
                <Image fluid src={disgusted} alt="ew" />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col className="mt-4 text-center" xl={{ offset: 1, span: 10 }}>
          <Row>
            <Col xs={6}>
              <a target="_blank" rel="noreferrer" href="https://github.com/chcoomilk/himitsu"
                style={{ textDecoration: "none" }}>
                <Image fluid src={ts_gif} alt="average typescript enjoyer" width={"100%"} />
                <i className="bi bi-github" />
                {" "}
                himitsu web
              </a>
            </Col>
            <Col xs={6} >
              <a target="_blank" rel="noreferrer" href="https://github.com/chcoomilk/himitsu-backend"
                style={{ textDecoration: "none" }}>
                <Image fluid src={rust_gif} alt="average rust enjoyer" width={"100%"} />
                <i className="bi bi-github" />
                {" "}
                himitsu backend
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
