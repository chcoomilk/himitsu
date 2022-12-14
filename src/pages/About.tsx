import { Accordion, Col, Row, Image, Container } from "react-bootstrap";
import kanna from "../assets/kanna.gif";
import ts_gif from "../assets/ts.gif";
import rust_gif from "../assets/rust.gif";
import disgusted from "../assets/ramsay.jpg";

const About = () => {
  return (
    <Container fluid>
      <Row className="my-3">
        <Col xl={{ offset: 1, span: 10 }} xs={12}>
          <p className="fs-5">
            himitsu is a pastebin service, just like any other services you can find.
            But, instead of a login system, we have JWT secrets so you still have power over
            your data without having to register/login.
            JWT keys are only for controlling the
            items you've created on the server, not the encryption/decryption of the data.
            Currently, it can only and the only way to delete your notes ahead of time before expiration (if it's set to expire).
          </p>
        </Col>
        <Col xl={{ offset: 1, span: 10 }} xs={12}>
          <Accordion className="mt-2" alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Why is it called passphrase instead of password?</Accordion.Header>
              <Accordion.Body className="clearfix text-center">
                <p className="fs-6 text-start">
                  Passphrase is generally longer by definition. So, I'm expecting your passphrase/password to be more like
                  "correct horse battery staple" rather than "p4ssw0rd!". <br /><br />
                  Your passphrase here is used only for encrypting and decrypting, while the usual password based system,
                  like an account login or something is kept inside a server as hash and used for gatekeeping.
                  While I believe encrypting the actual data instead of hashing the password and keeping it in the database is much more
                  privacy friendly, the downside is it's just more process intensive.
                  <br /><br />
                  And maybe less secure if you have the tiny energy, measly sized "p4ssw0rd!" kind of password..
                  I dunno I'm not a security expert, but yeah the longer and more unique
                  your password/passphrase is the better
                  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡝⣿⣿⣿⣿⣷⠀  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡞⣿⣿⣿⣿⣧  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡹⣿⣿⣿⣿⣿⣯⡫⣿⣿⣿⣿⣿⣷⣽⡜⣿⣿⣿⣿  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⣎⢻⣿⣿⣿⣿⣷⣌⣝⠿⣿⣿⣿⣿⡣⢹⣿⣿⣿  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⠁⡿⣷⣝⢿⣯⣛⡿⣿⣮⠻⠎⣙⡿⣿⣿⣦⡻⣿⣿  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⣿⣿⠘⡆⣿⣶⣭⣓⡙⢷⡹⣶⣝⡷⠸⣿⣿⣆⢩⣻⣿⣾⣿  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⣿⡇⣾⣆⢿⣿⣿⣿⣿⣷⣕⠙⣿⡟⠣⠌⠉⢡⠈⠻⣿⣿⣿  <br />
                  ⣿⣿⣿⣿⣿⣿⣿⡟⢰⣿⠿⠿⠟⠁⢂⣸⣿⣿⣿⣾⣷⡆⢴⢃⡜⣀⢧⡹⣿⣿  <br />
                  ⡿⠻⣿⣿⣿⣿⣿⡇⣴⣴⣶⠀⢴⡖⣈⣿⣿⣿⣿⣿⣿⣧⡙⢇⣧⡹⢘⡃⢻⣿  <br />
                  ⢹⡇⢿⣿⣿⣿⣿⣇⣿⣿⣿⣔⣛⣓⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢸⠼⣶⢽  <br />
                  ⠈⢿⡸⡿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣠⣾⢫⣾  <br />
                  ⣼⢨⡓⠃⢻⣿⣇⢿⡸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠿⢿⣿⣿⣿⠟⣴⣿⣿⣿⣿  <br />
                  ⢃⣾⣿⣆⠀⢿⣿⡌⢇⢿⣿⣿⣿⣿⣿⣿⣿⣿⣇⣾⣿⣿⠿⣣⢸⣿⣿⣿⣸⣿  <br />
                  ⣼⠿⠻⠿⡆⠘⣿⣧⡀⠠⣍⣙⡻⠿⠿⠿⠿⠿⠿⠛⠋⢁⡘⣻⡧⢹⣿⣿⣿⣿  <br />
                  ⠡⢤⠀⠀⠀⠀⠘⢿⡇⠀⠙⠛⠃⠀⠀⠀⢀⣦⡄⠐⢿⣿⣷⡜⢿⣿⣿⣿⠉⠙   <br />
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>How can we trust you no peeky peek!?</Accordion.Header>
              <Accordion.Body className="clearfix text-center"> {/* this is so the image is centered when screen is small */}
                <Image fluid src={kanna} alt="scary_dragon" className="col-md-6 float-md-end mb-3 ms-md-3" />
                <h2 className="text-start">
                  You can't.. <a href="https://www.youtube.com/watch?v=TN25ghkfgQA" className="text-decoration-none">or can you</a>?
                </h2>
                <p className="fs-6 text-start">
                  You can check out how this app work on the GitHub repo down below,
                  or you can see what data are being sent to the server by looking at
                  network log of this app in your browser's console.
                  But here's the kicker,
                  there's no telling if the backend server deployed is same as in the source code.
                  <br />
                  This means I can add some codes to take a little peek at your buttho-, I mean secrets.
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
                This site's source code
              </a>
            </Col>
            <Col xs={6} >
              <a target="_blank" rel="noreferrer" href="https://github.com/chcoomilk/himitsu-backend"
                style={{ textDecoration: "none" }}>
                <Image fluid src={rust_gif} alt="average rust enjoyer" width={"100%"} />
                <i className="bi bi-github" />
                {" "}
                Server's source code
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
