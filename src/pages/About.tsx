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

            <Accordion.Item eventKey="2">
              <Accordion.Header>Encrypted you say? But, I found the request form is not encrypted, treachery!</Accordion.Header>
              <Accordion.Body>
                Wow wow woah, hold your "Uma Musume Pretty Derby"! Do you see the padlock next to the URL bar? <br />
                <Image fluid src={padlock} alt="padlock_example" className="pt-3 pb-3" /> <br />
                As Google said, your connection is secured and private.
                Lots of complicated stuff, years of engineering, and countless servers hacked to finally gift us the {" "}
                <a href="https://en.wikipedia.org/wiki/HTTPS">wonders of technology</a>.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Why don't you encrypt my secret note on the frontend side?</Accordion.Header>
              <Accordion.Body>
                Let's say that I encrypt your stuff on the frontend and save the encrypted data on the backend.
                And then, say there's some sketchy dude that happened to guess right the ID of your secret note and decided to request it for himself.
                Because it's encrypted on the frontend, the backend has no idea if the request is coming from you or the people you trust.
                Now, back to the sketchy dude I mentioned, he will get the encrypted message from the server
                and brute force his way in. <br /> <br />
                <Image fluid src={sponge} alt="sponge" className="pt-3 pb-3" /> <br />
                That said, it maybe possible to implement end-to-end encryption or such method alike inside my app. 
                But, I just don't have enough experience to do it and I don't want to risk it.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>What will happen to my secret note if the backend app got hacked?</Accordion.Header>
              <Accordion.Body>
                That is where your password comes in to help. <br /> <br />
                So, I'm assuming you know how my app in the backend works.
                Before your stuff is saved into the database, it will get encrpyted using the password you provided
                and the salt from the server. <br /> <br />
                Assuming the hacker got access to all the encrypted data in the database.
                The hacker needs to know, one: the salt from the server, and two: the password which only you know.
                Which in theory, brute forcing the encrypted data would be improbable.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4.1">
              <Accordion.Header>How secure is it?</Accordion.Header>
              <Accordion.Body>
                I would say it's as secure as it can get. I will try my best to get to today's standard.
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
                I'm currently using the free tier of Heroku.. mhm, yes i'm dirt poor very cool <br />
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
