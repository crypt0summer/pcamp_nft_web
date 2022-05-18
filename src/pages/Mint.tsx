import { useEffect, useState } from "react";
import "../styles/App.css";
import { ethers } from "ethers";
import pcNFT from "../utils/ProtocolCampNFT.json";
import { getTreeAndWL, getTokenId, getHexProof } from "../utils/WLSettings";

// Constants
const OPENSEA_LINK = "";
const CONTRACT_ADDRESS = "0xbE373273Ec1Bb078E598C0fdF53f36d82C8F38ad";

const Mint = () => {
  const [currentAccount, setCurrentAccount] = useState("");

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
      // params: [{ chainId: '0x1' }], //mainnet
      params: [{ chainId: "0x4" }], //rinkeby
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
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
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

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      console.log("here?");
      //TODO 여기에 MetaMask - RPC Error: execution reverted: Already claimed  뜸
      //혹은 wl none
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button connect-wallet-button"
    >
      Mint NFT
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
        </div>
      </div>
    </div>
  );
};

export default Mint;
