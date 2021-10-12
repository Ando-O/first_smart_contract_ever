import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
    /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x15F8Be9Ecc6CE3bDD70a987d64797a88024Ab8E3";
  const contractABI = abi.abi

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
/////////////////////////////////////////////////////////////
  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
/////////////////////////////////////////////////////////////


// Read from blockchain code
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        /*
        * You're using contractABI here
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total corn count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total corn count...", count.toNumber());

        //test code for adding corn emoji here//
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
      // console.log(message) //Added this
    }
  }

////////////////////////////////////////////////////////////////////////
//*  GET WAVES */

/////////////////////////////////////////////////////////////////////////

/* CSS code for display*/
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="unicorn">🦄</span> NEIIIIIGH!
        </div>

        <div className="bio">
        <p>Ando is taking care of some unicorns</p>
        <p>They eat corn...this {} much corn!</p>
        <p>Throw some corn at them!</p>
        <p>And say Haaaayyy</p>
        <p>*They take RAINBOWS too</p>
        </div>

        <button className="waveButton" onClick={wave}>
        <span role="img" aria-label="CORN">🌽</span>
        </button>
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            READY...Connect Wallet!
          </button>
        )}
      </div>
    </div>
  );
}

export default App