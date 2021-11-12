import React, { useCallback, useEffect, useState } from "react";

const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window as unknown as Window & { solana: any };
    if (solana && solana.isPhantom) {
      console.log("Phantom wallet found!");
      return solana;
    } else {
      alert("Solana object not found! Get a Phantom Wallet!");
    }
  } catch (err) {
    console.error(err);
  }
};

export const useSolanaWeb3 = () => {
  const [solana, setSolanaInstance] = useState<any>(null);

  useEffect(() => {
    const onLoad = async () => {
      const solana = await checkIfWalletIsConnected();
      setSolanaInstance(solana);
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const connect = useCallback(async () => {
    if (solana) {
      try {
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log("Connected with Public Key", response.publicKey.toString());
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Failed to connect");
    }
  }, [solana]);

  return { connect };
};
