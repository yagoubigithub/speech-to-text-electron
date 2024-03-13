import { useEffect, useState } from "react";

let socket;

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [firstTime, setFirstTime] = useState(true);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    socket = new WebSocket("ws://localhost:8000");

    socket.addEventListener("message", function (event) {
      setText(event.data);
    });

    socket.addEventListener("close", function (event) {
      console.log("Connection closed. Reason:", event.reason);
    });
  }, []);
  const handleListen = () => {
    if (!firstTime) {
      if (!isListening) {
        //stop

        socket.send("stop");

        return;
      }
      if (isListening) {
        //start

        socket.send("start");
      }
    } else {
      setFirstTime(false);
    }
  };

  const start = () => setIsListening(true);
  const stop = () => setIsListening(false);

  return {
    text,
    start,
    stop,
    isListening,
    hasRecgonitionSupport: true,
  };
};

export default useSpeechRecognition;
