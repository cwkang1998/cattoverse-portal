import { useCallback, useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Commitment,
  ConfirmOptions,
} from "@solana/web3.js";
import { Idl, Program, Provider, web3 } from "@project-serum/anchor";
import idl from "../idl/idl.json";
import kp from "../keypair.json";

const { SystemProgram, Keypair } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);

const baseAccount = Keypair.fromSecretKey(secret);

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };

const checkAndGetSolanaPhantomObject = async () => {
  const { solana } = window as unknown as Window & { solana: any };
  if (solana && solana.isPhantom) {
    console.log("Phantom wallet found!");
    return solana;
  } else {
    alert("Solana object not found! Get a Phantom Wallet!");
    throw Error("Fail to get solana phantom object.");
  }
};

const attemptAutoLogin = async (solana: any) => {
  const response = await solana.connect({ onlyIfTrusted: true });
  console.log("Connected with Public Key", response.publicKey.toString());
  return response.publicKey.toString();
};

const getProvider = (solanaInstance: any) => {
  const connection = new Connection(
    network,
    opts.preflightCommitment as Commitment
  );
  const provider = new Provider(
    connection,
    solanaInstance,
    opts as ConfirmOptions
  );
  return provider;
};

export const useSolanaWeb3 = () => {
  const [solana, setSolanaInstance] = useState<any>(null);
  const [provider, setProvider] = useState<Provider>();
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const onLoad = async () => {
      try {
        const solana = await checkAndGetSolanaPhantomObject();
        setSolanaInstance(solana);

        // This must be after setting the solana instance, or else
        // it'll error out before setting any state.
        if (solana) {
          const userAddr = await attemptAutoLogin(solana);
          setAddress(userAddr);

          const provider = getProvider(solana);
          setProvider(provider);
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

        const provider = getProvider(solana);
        setProvider(provider);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Failed to connect");
    }
  }, [solana]);

  return { address, provider, connect };
};

export const useSolanaProgram = (provider?: Provider) => {
  const [error, setError] = useState<any>();
  const [program, setProgram] = useState<Program>();

  useEffect(() => {
    const startProgram = async () => {
      if (provider) {
        try {
          const gifProgram = new Program(idl as Idl, programID, provider);
          setProgram(gifProgram);
          setError(null);
        } catch (err: any) {
          setError(err);
          console.error("Failed to start program:", err);
        }
      }
    };
    startProgram();
  }, [provider]);

  const createAccount = useCallback(async () => {
    try {
      if (provider) {
        const gifProgram = new Program(idl as Idl, programID, provider);
        await gifProgram?.rpc.initialize({
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [baseAccount],
        });
        console.log(
          "Created a new baseAccount w/ address:",
          baseAccount.publicKey.toString()
        );

        setProgram(gifProgram);
        setError(null);
      }
    } catch (err) {
      setError(err);
      console.error("Failed to initialize program:", err);
    }
  }, [provider]);

  const sendGif = useCallback(
    async (gifUrl: string) => {
      if (provider && program) {
        try {
          await program?.rpc.addGif(gifUrl, {
            accounts: {
              baseAccount: baseAccount.publicKey,
              user: provider.wallet.publicKey,
            },
          });
          setError(null);
        } catch (err) {
          setError(err);
          console.error("sendGif failed:", err);
        }
      }
      console.log("Gif succesfully sent to program", gifUrl);
    },
    [program, provider]
  );

  const getGifList = useCallback(async () => {
    if (program) {
      try {
        const account = await program?.account.baseAccount.fetch(
          baseAccount.publicKey
        );
        console.log("Got the account", account);
        setError(null);
        return account?.gifList;
      } catch (err) {
        setError(err);
        console.error("getGifList failed:", err);
      }
    }
    return [];
  }, [program]);

  return { error, program, createAccount, sendGif, getGifList };
};
