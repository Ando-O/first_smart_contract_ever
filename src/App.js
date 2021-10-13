import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import { Message } from './Message'

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [userMessage, setUserMessage] = React.useState("")
  
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  /// allWAVEs state
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x59373E2403Db29CcA6038E63799373aFd0a73aDA";
  const contractABI = abi.abi

  function changeHandler(e) {
     let usermsg = e.target.value
     setUserMessage(usermsg)
   }

  /////This get all waves
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log("error")
      console.log(error);
    }
  }

  ////// Ending above

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
        /// trying here
        getAllWaves();
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
      // Maybe put it right here?
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
        /// "NEIIIGH! 🌽!"
        const waveTxn = await wavePortalContract.wave(`${userMessage}`);        console.log("Mining...", waveTxn.hash);
        ////// TRY THIS:
        ///const waveTxn = await wavePortalContract.wave("this is a message")
        /// The above was edited for line 130
        
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total corn count...", count.toNumber());

        //test code for adding corn emoji here//
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("error")
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
        <p>They have eaten corn...this {} much corn!</p>
        <p>Throw some corn at them!</p>
        <p>And say Haaaayyy</p>
        <p>*They take RAINBOWS too</p>
        </div>
        
        <p>Leave Ando a message and feed some 🌽...</p>
        <textarea value={userMessage} onChange={(event) => setUserMessage(event.target.value)}/>

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
        
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "Lavender Blush", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App