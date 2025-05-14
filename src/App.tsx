import React, { useEffect, useState } from 'react';
import './App.css';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

const connection = new Connection('https://api.mainnet-beta.solana.com');
const PRESALE_WALLET = new PublicKey('GWkwfF8BbA591V4ZFTLDJJ9eRy5Mhp2Z9zNBNFvf6cgy');
const TOKENS_PER_SOL = 10000000;

function PresaleApp() {
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const [solAmount, setSolAmount] = useState(0);
  const [tokenOutput, setTokenOutput] = useState(0);

  useEffect(() => {
    setTokenOutput(solAmount * TOKENS_PER_SOL);
  }, [solAmount]);

  const buyTokens = async () => {
    if (!publicKey) return alert('Please connect your wallet');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: PRESALE_WALLET,
        lamports: solAmount * LAMPORTS_PER_SOL,
      })
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      alert(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
      alert('Transaction failed!');
    }
  };

  return (
    <div className="container">
      <header>
        <img src="https://gateway.pinata.cloud/ipfs/bafybeih3iwshjpvlxlsbg6mazrv77qu3inzpmixvznyaihqa2ut674nklu" className="logo" />
        <h1>WFAI Token Presale</h1>
      </header>
      <div className="card">
        <WalletMultiButton />
        {publicKey && (
          <div>
            <p>Connected: {publicKey.toBase58()}</p>
            <button onClick={disconnect}>Disconnect</button>
          </div>
        )}
        <input
          type="number"
          value={solAmount}
          onChange={(e) => setSolAmount(parseFloat(e.target.value))}
          placeholder="Enter SOL Amount"
        />
        <div>
          <p>Exchange Rate: 1 SOL = 10,000,000 WFAI</p>
          <p>You will receive: {tokenOutput} WFAI</p>
        </div>
        <button onClick={buyTokens}>Buy WFAI Now</button>
      </div>
    </div>
  );
}

function WalletApp() {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);
  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <PresaleApp />
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default WalletApp;
