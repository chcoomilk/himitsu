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
  const [text, setText] = useState({
    text1: holy_list.normal_text_1,
    text2: holy_list.normal_text_2,
    uwu: false
  });
  let timer: NodeJS.Timeout;

  const toggleText = () => {
    text.uwu
      ? setText({
        text1: holy_list.normal_text_1,
        text2: holy_list.normal_text_2,
        uwu: false
      })
      : setText({
        text1: holy_list.uwufied_text_1,
        text2: holy_list.uwufied_text_2,
        uwu: true
      });
  };

  return (
    <Container fluid>
      <Row>
        <Col xl={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>

          <h1>
            {text.text1} <br />
          </h1>
          <h3>
            {text.text2}<span onClick={e => {
              clearTimeout(timer);
              if (e.detail === 1) {
                timer = setTimeout(() => { }, 200);
              } else if (e.detail === 2) {
                toggleText();
              }
            }}>.</span>
          </h3>

          <h2 className="mt-5">
            FAQ
          </h2>
          <Accordion flush className="accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>How can we trust you not logging our very secret and delicate stuff?</Accordion.Header>
              <Accordion.Body>
                "Sagiri, you have to trust me.", said Masamune while pinning her little sister down on the be-... <br />
                Ehm, erm.. in other words, you can't, {" "}
                <a href="https://www.youtube.com/watch?v=TN25ghkfgQA">or can you</a>?
                <br /> <br />
                You can check out how my application work on my GitHub.
                You can see if there's any line of code suspiciously saving personal info and all that. <br />
                But, what you can't trust me is that the applications I deployed are EXACTLY the same as the ones in the source code.
                This means I can add some evil line of code to steal your personal data before deploying my app to the internet.  <br /> <br />
                So for me to gain my users' trust, here is a kanna gif <br />
                <Image fluid src={kanna} alt="scary_dragon" className="pt-3 pb-3" />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>OK, I trust you, but how does it work?</Accordion.Header>
              <Accordion.Body>
                When you save a note, your request will be sent to the server.
                Once your request has arrived, a backend app literally written in the language of the gods will handle your request.
                From data encryption to everything, except maybe fixing this hot global warming, it will all be taken care of for you. <br /> <br />

                If you're interested in system programming and all that technical stuff,
                I highly recommend you to check out <a href="https://www.rust-lang.org/">https://www.rust-lang.org/</a> <br />
                <Image fluid src={vegetable} alt="dragon_deez_ballz" className="pt-3 pb-3" />
              </Accordion.Body>
            </Accordion.Item>

            {/* <Accordion.Item eventKey="2">
              <Accordion.Header>Encrypted you say? But, I found the request form is not encrypted, treachery!</Accordion.Header>
              <Accordion.Body>
                Wow wow woah, hold your "Uma Musume Pretty Derby"! Do you see the padlock next to the URL bar? <br />
                <Image fluid src={padlock} alt="padlock_example" className="pt-3 pb-3" /> <br />
                As Google said, your connection is secured and private.
                Lots of complicated stuff, years of engineering, and countless servers hacked to finally gift us the {" "}
                <a href="https://en.wikipedia.org/wiki/HTTPS">wonders of technology</a>.
              </Accordion.Body>
            </Accordion.Item> */}

            <Accordion.Item eventKey="3">
              <Accordion.Header>Which encryption method should I choose?</Accordion.Header>
              <Accordion.Body>
                If you're using backend encryption,
                before your stuff is saved into the database,
                it will get encrypted using the password you provided
                and the salt from the server. <br />
                Assuming the hacker got access to all the encrypted data in the database.
                The hacker needs to know, one: the salt from the server, and two: the password which only you know.
                Which in theory, brute forcing the encrypted data would be improbable.
                <br /> <br />
                If you're using frontend encryption,
                The hacker can probably yank your secrets if it's encrypted with a weak password (or encryption, which is why it's labled 'experimental').
                But with frontend encryption, you're much more safer against {" "}
                <a href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">Man-in-the-middle attack</a>.<br />
                It's also much privacy oriented. If by any chance the server logs your requests,
                they can only see the encrypted strings of data that will be put in to the database.
                Unless if they're logging it from the frontend side,
                which is a stupid move because you can see every network activity happening in the application from your browser.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>What will happen to my secret note if the backend app got hacked?</Accordion.Header>
              <Accordion.Body>
                That is where your password comes in to help. <br /> <br />
                Unless if you're using no encryption...
                <Image fluid src={sponge} alt="sponge" className="pt-3 pb-3" /> <br />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4.1">
              <Accordion.Header>How secure is it?</Accordion.Header>
              <Accordion.Body>
                I would say it's as secure as it can get. I will try my best to keep everything up by today's standard.
                <Image fluid src={padlock} alt="padlock_example" className="pt-3 pb-3" /> <br /> <br />
                For frontend encryption, we use AES-128 to encrypt both note's title and description.
                There's a great post about {" "}
                <a href="https://www.kryptall.com/index.php/2015-09-24-06-28-54/how-safe-is-safe-is-aes-encryption-safe">how safe is AES encryption?</a>,
                and you should check it out.
                The backend also use AES-256 encryption to encrypt both of the fields last mentioned and Argon2 for the password.
                But eventually, it all depends on your password. So, make sure to provide a good and strong password!
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

            <Accordion.Item eventKey="7">
              <Accordion.Header>You need some help</Accordion.Header>
              <Accordion.Body>
                Yes, I do! You can contribute by going into the GitHub repos below. Or you can
                <Image fluid src={sad} alt="sad" className="pt-3 pb-3" />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <h3>
            <br />
            <a href="https://github.com/chcoomilk/himitsu">GitHub</a> to check out this website's code
          </h3>

          <h3>
            <a href="https://github.com/chcoomilk/himitsu-backend">GitHub</a> to check out the backend side
          </h3>

          <h3 className="mt-3">
            Thank you!
          </h3>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
