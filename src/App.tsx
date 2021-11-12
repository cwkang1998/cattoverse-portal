import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useSolanaWeb3 } from "./hooks/useSolanaWeb3";
import { useEffect } from "react";
// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { address, connect } = useSolanaWeb3();

  const renderNotConnectedContainer = () => {
    return (
      <button className="cta-button connect-wallet-button" onClick={connect}>
        Connect to Wallet
      </button>
    );
  };

  return (
    <div className="App">
      <div className={address ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!address && renderNotConnectedContainer()}
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
