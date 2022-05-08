import React, { useEffect, useState } from "react";
import './styles/App.css';
import myEpicNft from './utils/MyEpicNFT.json';
import { ethers } from 'ethers';

const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 0;
const CONTRACT_ADDRESS = "0xF1aD06077E05ebD0e0c0e8eBC104fE436c560D6F";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
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
      setCurrentAccount(account)

      // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }
// Setup our listener.
const setupEventListener = async () => {
  // Most of this looks the same as our function askContractToMintNft
  try {
    const { ethereum } = window;

    if (ethereum) {
      // Same stuff again
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      // THIS IS THE MAGIC SAUCE.
      // This will essentially "capture" our event when our contract throws it.
      // If you're familiar with webhooks, it's very similar to that!
      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      });

      console.log("Setup event listener!")

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "0x65a1Ff776408Cf6001193D18975C41Da5dB15c7F";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
const imageClick = () => {
  console.log('Click!!!!');
  const url = 'https://forms.gle/AgzmGzCJhdyyMC3z6';
  window.open(url, '');
}   
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Chase the rabbit</p>
          <p className="sub-text">
            KST 5/13 Comming soon... 
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
          /** Add askContractToMintNft Action for the onClick event **/
          // <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
          //   Mint NFT
          // </button>
          <div>
            <img src={ require('./images/wl_qr.jpg') }
             width='500'
             height='500' 
             onClick={() => imageClick()}
            />
          </div>
        )}
        </div>
        <div className="footer-container">
      
        </div>
      </div>
    </div>
  );
};

export default App;