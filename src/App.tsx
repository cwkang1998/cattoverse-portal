import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useSolanaProgram, useSolanaWeb3 } from "./hooks/useSolanaWeb3";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { address, provider, connect } = useSolanaWeb3();
  const { error, program, createAccount, sendGif, getGifList } =
    useSolanaProgram(provider);
  const [inputVal, setInputVal] = useState("");
  const [gifList, setGifList] = useState<{ gifLink: string }[]>([]);

  useEffect(() => {
    const getData = async () => {
      if (address) {
        console.log("Fetching gif list...");
        try {
          const res = await getGifList();
          if (res) {
            setGifList(res);
          } else {
            setGifList([]);
          }
        } catch (err) {
          console.error("Failed to get gif list:", err);
          setGifList([]);
        }
      }
    };
    getData();
  }, [address, getGifList]);

  const onInputChange = (e: any) => {
    setInputVal(e.target.value);
  };

  const onSubmitGif = async () => {
    if (inputVal.length > 0) {
      console.log("Gif link:", inputVal);
      await sendGif(inputVal);
      setInputVal("");

      // After submitting get new data
      try {
        const res = await getGifList();
        if (res) {
          console.log(res);
          setGifList(res);
        }
      } catch (err) {
        console.error("Failed to get gif list:", err);
      }
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
    if (error) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    }
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
          {gifList.map(({ gifLink }) => (
            <div className="gif-item" key={gifLink}>
              <img src={gifLink} alt={gifLink} />
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
