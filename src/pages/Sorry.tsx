import React from "react";
import '../styles/App.css';

const Sorry = () => {
   

const imageClick = () => {
  const url = 'https://forms.gle/AgzmGzCJhdyyMC3z6';
  window.open(url, '');
}   

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already connected :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Chase the rabbit</p>
          <p className="sub-text">
            SORRY 
          </p>
          <div>
            <img src={ require('../images/sorry.jpg')}
             width='500'
             height='500'
             alt="Sorry Rabbit"
            />
          </div>
          <p className="sub-text">
            시장에 과도한 영향을 받은 개발자가 뻗었습니다. 
            개발자를 재부팅중입니다...
          </p>
          <p className="sub-text">
            그동안 뭘 할수 있나요?
          </p>
          <div>
            <img src={ require('../images/wl_qr.jpg') }
             width='500'
             height='500' 
             alt="WL QR"
             onClick={() => imageClick()}
            />
          </div>
          <p className="sub-text">
            화리작성을 합시다
          </p>
        </div>
        <div className="footer-container">
      
        </div>
      </div>
    </div>
    
  );
};

export default Sorry;