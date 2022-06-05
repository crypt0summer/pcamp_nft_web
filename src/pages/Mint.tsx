import { useEffect, useState } from "react";
import "../styles/Rabbit.css";

import { ethers } from "ethers";
import pcNFT from "../utils/ProtocolCampNFT.json";
import { getTreeAndWL, getTokenId, getHexProof } from "../utils/WLSettings";

import logo from "../images/logo.png";
import opensea from "../images/opensea.png";
import scope from "../images/scope.png";
import rabbit from "../images/rabbit.png";

import ReactLoading from 'react-loading';

// Constants
const CONTRACT_ADDRESS = "0x638B04e339B6A7B2095F455111F352C1FB2B0926";
const OPENSEA_LINK = `https://opensea.io/collection/protocol-campers`;

const Mint = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  // const [mintStatus, setMintStatus] = useState(false);


  const clickOpensea = () => {
    const url = OPENSEA_LINK;
    window.open(url, "");
  };

  const clickPCamp = () => {
      console.log('sdf');
    const url = "https://www.protocolcamp.com/";
    window.open(url, "");
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

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

      changeToMainNet(ethereum);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  };

  const changeToMainNet = async (ethereum: any) => {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: '0x1' }], //mainnet
      // params: [{ chainId: "0x4" }], //rinkeby
    });
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          pcNFT.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          // setMintStatus(false);
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://opensea.io/assets/ethereum/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      console.log("Account:", addr);

      if (ethereum) {
        changeToMainNet(ethereum);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          pcNFT.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");

        const {tree, wl} = await getTreeAndWL();
        const tokenId = getTokenId(addr, wl);

        const hexProof = await getHexProof(tree, addr, tokenId);
        console.log("hex: ", hexProof);
        console.log("tokenId: ", tokenId);

        let nftTxn = await connectedContract
          .connect(signer)
          .mintWL(hexProof, tokenId);

        console.log("Mining...please wait.");
        await nftTxn.wait();
        // setMintStatus(true);


        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("here?");
      //TODO 여기에 MetaMask - RPC Error: execution reverted: Already claimed  뜸
      //혹은 wl none

      let message ="";
      if (error instanceof Error) message = error.message
      if(message.includes("Already claimed")){
        alert(
          `You already claimed your NFT`
        );
      } else if (message.includes("out-of-bounds")){
        alert(
          `You are not on the white list`
        );
      } else{
        alert(
          `Sorry, something went wrong`
        );
      }

      console.log(message);
     
      
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="CTA"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="CTA"
    >
      Mint NFT
    </button>
  );

  return (
    <div className="Rabbit">
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="rabbit.css" />
        <link
          href="//db.onlinewebfonts.com/c/29800a9e7d146302b8ed9ad2f848db63?family=Druk+Wide+Web+Bold"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="http://fonts.cdnfonts.com/css/montserrat"
          rel="stylesheet"
          type="text/css"
        />
        <title>Chase the Rabbit</title>
      </div>
      <div className="Rabbit">
        <nav className="navbar">
          <div className="navbar_logo">
            <img
              src={logo}
              width="157"
              height="59"
              alt="chase the rabbit"
              title="chase the rabbit"
              onClick={() => clickPCamp()}
            />
          </div>
          <button className="navbar_btn" onClick={clickOpensea}>
            <img src={opensea} width="24" height="24" alt="opensea" />
            <p>Opensea</p>
          </button>
        </nav>
        <div className="main">
          
          <div className="contents">

            {/*           <div id="background_webgl"></div> */}
            <div className="background_pseudo">
              <img src={scope} width="925" height="485" alt="scope" />
            </div>
            
            {/*           <div id="background_webgl"></div> */}
            <div className="rabbit_pseudo">
              <img src={rabbit} width="480" height="641" alt="rabbit" />
            </div>
            {/* {mintStatus
            ? <ReactLoading type={'bubbles'} color={'#0303fc'} height={667} width={375} />
            : <div></div>} */}
            
            {/* <ReactLoading type={'bubbles'} color={'#0011ff'} height={667} width={375} /> */}
            <h1 className="title">Chase the Rabbit</h1>
            {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
          </div>
          
          

        </div>
        <footer>© 2022 Chase the Rabbit | All rights reserved</footer>
        
      </div>
    </div>
  );

};

export default Mint;
