import React, { useCallback, useEffect, useState } from "react";

const checkAndGetSolanaPhantomProvider = async () => {
  const { solana } = window as unknown as Window & { solana: any };
  if (solana && solana.isPhantom) {
    console.log("Phantom wallet found!");
    return solana;
  } else {
    alert("Solana object not found! Get a Phantom Wallet!");
    throw Error("Fail to get solana phantom provider.");
  }
};

const attemptAutoLogin = async (solana: any) => {
  const response = await solana.connect({ onlyIfTrusted: true });
  console.log("Connected with Public Key", response.publicKey.toString());
  return response.publicKey.toString();
};

export const useSolanaWeb3 = () => {
  const [solana, setSolanaInstance] = useState<any>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const onLoad = async () => {
      try {
        const solana = await checkAndGetSolanaPhantomProvider();
        setSolanaInstance(solana);

        // This must be after setting the solana instance, or else
        // it'll error out before setting any state.
        if (solana) {
          const userAddr = await attemptAutoLogin(solana);
          setAddress(userAddr);
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const connect = useCallback(async () => {
    if (solana) {
      try {
        const response = await solana.connect();
        console.log("Connected with Public Key", response.publicKey.toString());
        setAddress(response.publicKey.toString());
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Failed to connect");
    }
  }, [solana]);

  return { address, connect };
};
