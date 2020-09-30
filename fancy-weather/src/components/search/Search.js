import React, { useState, useEffect, useRef } from "react";

function Search(props) {
  const [searchingLocation, changeSearchingLocation] = useState("");
  const [isMicOn, setMicOn] = useState(false);
  const recognition = useRef();
  const search = useRef();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();

    recognition.current.onstart = () => {
      console.log(
        "Voice recognition started. Try speaking into the microphone."
      );
    };
    recognition.current.onend = () => {
      setMicOn(false);
      console.log("Voice recognition ended");
    };
    recognition.current.onresult = (event) => {
      changeSearchingLocation(event.results[0][0].transcript);
      search.current.click();
    };
  }, []);

  const onChangeInput = (e) => {
    changeSearchingLocation(e.target.value);
  };

  const onSearchClick = () => {
    if (searchingLocation) {
      props.changeLocation(searchingLocation);
    }
    changeSearchingLocation("");
  };

  const onKeyboardClick = (e) => {
    if (e.nativeEvent.code === "Enter") {
      e.preventDefault();
      onSearchClick();
    }
  };

  const onMicrophoneClick = () => {
    setMicOn(true);
    switch (props.state.language) {
      case "en":
        recognition.current.lang = "en-US";
        break;
      case "ru":
        recognition.current.lang = "ru-RU";
        break;
      default:
        recognition.current.lang = "be-BE";
    }
    try {
      recognition.current.start();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="search-wrapper">
      <input
        className="search controls_item"
        onKeyPress={onKeyboardClick}
        placeholder={
          props.state.localisations[`${props.state.language}`].placeholder
        }
        value={searchingLocation}
        onChange={onChangeInput}
      ></input>
      <button
        className="search-button controls_item"
        style={{ background: isMicOn ? "red" : "" }}
        onClick={onMicrophoneClick}
      >
        <img
          className="search-icon"
          src="img/mic-icon.svg"
          alt="mic-icon"
        ></img>
      </button>
      <button ref={search} className="search-button controls_item" onClick={onSearchClick}>
        <img
          className="search-icon"
          src="img/search-icon.png"
          alt="search-icon"
        ></img>
      </button>
    </div>
  );
}

export default Search;
