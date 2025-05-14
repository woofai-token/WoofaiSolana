import React, { useState, useEffect } from 'react';
import './App.css';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-standard';
import { WalletProvider, useWallet } from '@solana/wallet-standard-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-standard-react-ui';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const PRESALE_WALLET = new PublicKey('GWkwfF8BbA591V4ZFTLDJJ9eRy5Mhp2Z9zNBNFvf6cgy');
const TOKENS_PER_SOL = 10000000; // 10M per SOL
const LAMPORTS_PER_SOL = 1000000000; // Conversion factor

function App() {
  const { publicKey, connect, disconnect } = useWallet();
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
      console.log('Transaction sent:', signature);
      alert('Transaction successful!');
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed!');
    }
  };

  return (
    <div className="container">
      <header>
        <img src="https://gateway.pinata.cloud/ipfs/bafybeih3iwshjpvlxlsbg6mazrv77qu3inzpmixvznyaihqa2ut674nklu" alt="WFAI Logo" className="logo" />
        <h1>WFAI Token Presale</h1>
      </header>

      <div className="grid">
        <div className="card">
          <h2>💰 Presale</h2>
          <div>
            {!publicKey ? (
              <WalletMultiButton />
            ) : (
              <div>
                <p>Connected: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}</p>
                <button onClick={() => disconnect()}>Disconnect</button>
              </div>
            )}
          </div>

          <input
            type="number"
            value={solAmount}
            onChange={(e) => setSolAmount(Number(e.target.value))}
            placeholder="Enter SOL Amount"
            min="0"
            step="0.1"
          />
          <div className="conversion">
            <strong>Exchange Rate:</strong> 1 SOL = 10,000,000 WFAI<br />
            <strong>You will receive:</strong> <span>{tokenOutput}</span> WFAI
          </div>
          <button className="buy-btn" onClick={buyTokens}>Buy WFAI Now</button>
        </div>
      </div>
    </div>
  );
}

function WalletApp() {
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default WalletApp;
