import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useSolanaWeb3 } from "./hooks/useSolanaWeb3";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
  "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif",
  "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif",
];

const App = () => {
  const { address, connect } = useSolanaWeb3();
  const [inputVal, setInputVal] = useState("");
  const [gifList, setGifList] = useState<string[]>([]);

  useEffect(() => {
    if (address) {
      console.log("Fetching gif list...");
      setGifList(TEST_GIFS);
    }
  }, [address]);

  const onInputChange = (e: any) => {
    setInputVal(e.target.value);
  };

  const onSubmitGif = () => {
    if (inputVal.length > 0) {
      console.log("Gif link:", inputVal);
    } else {
      console.log("Empty input, try again.");
    }
  };

  const renderNotConnectedContainer = () => {
    return (
      <button className="cta-button connect-wallet-button" onClick={connect}>
        Connect to Wallet
      </button>
    );
  };

  const renderConnectedContainer = () => {
    return (
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputVal}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>

        <div className="gif-grid">
          {gifList.map((gif) => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className={address ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 CattoVerse</p>
          <p className="sub-text">
            View your GIF collection in the CattoVerse ✨
          </p>
          {!address && renderNotConnectedContainer()}
          {address && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
