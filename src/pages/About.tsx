import { useState } from "react";
import { Accordion, Col, Container, Row, Image } from "react-bootstrap";
import kanna from "../media/kanna.gif";
import vegetable from "../media/vegetable.gif";
import padlock from "../media/padlock.png";
import sad from "../media/sad.png";
import sponge from "../media/spongebob-wall.gif";

const holy_list = {
  normal_text_1: "To yours truly,",
  normal_text_2: "a private note app built with actix on backend and good ol' react on frontend",
  uwufied_text_1: "To youws twuwy, 🥺",
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
    <Container className="align-items-center text-center smaller-font">
      <Row>
        <Col xl={{ span: 8, offset: 2 }} xs={{ span: 10, offset: 1 }}>
          <Accordion className="mb-3" defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Welcome!
              </Accordion.Header>
              <Accordion.Body>
                <h2>
                  {texts.text1}
                </h2>
                <p>
                  {texts.text2}<span onClick={e => {
                    clearTimeout(timer);
                    if (e.detail === 1) {
                      timer = setTimeout(() => { }, 200);
                    } else if (e.detail === 2) {
                      toggleText();
                    }
                  }}>.</span>
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How can we trust you not logging our very secret and delicate stuff?</Accordion.Header>
              <Accordion.Body>
                <p className="text-justify">
                  "Sagiri, you have to trust me.", said Masamune while pinning her little sister down on the be-... <br />
                  Ehm, erm.. in other words, you can't, {" "}
                  <a href="https://www.youtube.com/watch?v=TN25ghkfgQA">or can you</a>?
                  <br /> <br />
                  You can check out how my application work on my GitHub.
                  You can see if there's any line of code suspiciously saving personal info and all that. But, what you can't trust me is that the applications I deployed are EXACTLY the same as the ones in the source code.
                  This means I can add some evil line of code to steal your personal data before deploying my app to the internet.
                </p>
                <p>
                  So for me to gain my users' trust, here is a kanna gif <br />
                  <Image fluid src={kanna} alt="scary_dragon" className="pt-3 pb-3" />
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>How does your app work??</Accordion.Header>
              <Accordion.Body>
                <p className="text-justify">
                  When you save a note, your request will be sent to the server.
                  Once your request has arrived, a backend app literally written in the language of the gods will handle your request.
                  From data encryption to everything, except maybe fixing this hot global warming, it will all be taken care of for you. <br /> <br />

                  If you're interested in system programming and all that technical stuff,
                  I highly recommend you to check out <a href="https://www.rust-lang.org/">https://www.rust-lang.org/</a> <br />
                </p>
                <Image fluid src={vegetable} alt="dragon_deez_ballz" className="pt-3 pb-3" />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Which encryption method should I choose?</Accordion.Header>
              <Accordion.Body>
                <p className="text-justify">
                  If you're using backend encryption,
                  before your stuff is saved into the database,
                  it will get encrypted using the password you provided
                  and the salt from the server.
                  Assuming the hacker got access to all the encrypted data in the database.
                  The hacker needs to know, one: the salt from the server, and two: the password which only you know.
                  Which in theory, brute forcing the encrypted data would be improbable.
                </p>
                <p className="text-justify">
                  If you're using frontend encryption,
                  The hacker can probably yank your secrets if it's encrypted with a weak password, 
                  because they only need to know your password.
                  But with frontend encryption, you're much more safer against {" "}
                  <a href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">Man-in-the-middle attack</a>.
                  It's also much privacy oriented. If by any chance, the server hosting my app (in this case heroku) logs your requests,
                  they can only see the encrypted strings of data that will be put in to the database.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>What will happen to my secret note if the backend app got hacked?</Accordion.Header>
              <Accordion.Body>
                <p>
                  That is where your password comes in to help.
                  Unless if you're using no encryption...
                </p>
                <Image fluid src={sponge} alt="sponge" className="pt-3 pb-3" />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4.1">
              <Accordion.Header>How secure is it?</Accordion.Header>
              <Accordion.Body>
                <p className="text-center">
                  I would say it's as secure as it can get. I will try my best to keep everything up by today's standard. <br />
                  <Image fluid src={padlock} alt="padlock_example" className="mt-4 pb-3" />
                </p>
                <p className="text-justify">
                  For frontend encryption, the app uses AES-128 for encryption.
                  There's a great post about {" "}
                  <a href="https://www.kryptall.com/index.php/2015-09-24-06-28-54/how-safe-is-safe-is-aes-encryption-safe">how safe is AES encryption?</a>,
                  and you should check it out.
                  The backend uses AES-256 for encryption and Argon2 for the password.
                  But eventually, it all depends on your password. So, make sure to provide a good and strong password!
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>OK, but what if the actual server where the application hosted or my TLS connection got hacked?</Accordion.Header>
              <Accordion.Body>
                Shit, it's the end of the world I guess...
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>Speaking of host, where do you deploy this app's backend?</Accordion.Header>
              <Accordion.Body>
                I'm currently using the free tier of Heroku.. mhm, yes i'm dirt poor <br />
                <Image fluid src={sad} alt="sad" className="pt-3 pb-3" />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <h3 className="text-center">
            <a href="https://github.com/chcoomilk/himitsu">Click here</a> to check out this website's code
          </h3>

          <h3 className="text-center">
            <a href="https://github.com/chcoomilk/himitsu-backend">Click here</a> to check out the backend side
          </h3>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
