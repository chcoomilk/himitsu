import { useState } from "react";

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
    <>
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

      <h3>
        <br />
        <a href="https://github.com/klaustinw/himitsu">GitHub</a> to check out this website's code
      </h3>

      <h3>
        <a href="https://github.com/klaustinw/himitsu-backend">Github</a> to check out the backend side
      </h3>
    </>
  );
};

export default About;
