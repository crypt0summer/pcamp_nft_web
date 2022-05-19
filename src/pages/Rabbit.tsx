import React, { useEffect, useState } from "react";
import "../styles/Rabbit.css";
import { ethers } from "ethers";
import pcNFT from "../utils/ProtocolCampNFT.json";
import { getTreeAndWL, getTokenId, getHexProof } from "../utils/WLSettings";

import logo from "../images/logo.png";
import opensea from "../images/opensea.png";
import scope from "../images/scope.png";
import rabbit from "../images/rabbit.png";

const Rabbit = () => {
  const clickOpensea = () => {
    const url = "https://forms.gle/AgzmGzCJhdyyMC3z6";
    window.open(url, "");
  };

  const clickPCamp = () => {
      console.log('sdf');
    const url = "https://www.protocolcamp.com/";
    window.open(url, "");
  };

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
            <h1 className="title">Chase the Rabbit</h1>
            <button className="CTA">
              <p>Connect Wallet</p>
            </button>
          </div>
        </div>
        <footer>© 2022 Chase the Rabbit | All rights reserved</footer>
      </div>
    </div>
  );
};

export default Rabbit;
