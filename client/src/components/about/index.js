import React, { useContext } from 'react';

import './index.scss';
import classnames from 'classnames';
import LayoutContext from '../../context/layoutContext';

export default () => {
    const layout = useContext(LayoutContext);

    const aboutCss = classnames('about', layout);

    return (
        <div className={aboutCss}>
            <div className="about-scroller">

            <div className="about-content">
                
                <h3>What is <span className="camel">GreerCoin?</span></h3>

                <p>GreerCoin is an ERC20 compliant etherum token created by me (Greer Hanshaw). 
                    It was built as a learning endeavor during my free time.
                    GreerCoin is deployed to both the mainnet and to the Ropsten testnet.
                    Please be advised that GreerCoin was created soley for demonstration purpsoses and has NO real monitary value.
                </p>

                <h3>How It Works</h3>

                <p>Using GreerCoin is simple:</p>
                <ol>
                    <li>Download MetaMask</li>
                    <li>Load ether into your wallet using this site</li>
                    <li>Purchase GreerCoin</li>
                </ol>

                <h3>Technology & Resources</h3>
                <p>I used various frameworks in order to built this project.</p>
                <p>The contract code was written in Solidity. I developed the frontend using React, Truffle and web3. 
                    I used MetaMask throughout the development process -- it's also requirerd to use the website. And I deployed GreerCoin using Infura</p>
                {/* <ul>
                    <li>Solidity</li>
                    <l1>Truffle</l1>
                    <li>Infura</li>
                    <li>MetaMask</li>
                    <li>React</li>
                </ul> */}
                <p>In addition, I want to give my thanks to the author of the canvas script, which can be found here.</p>

                <div className="logo">
                    <img src='insular_g_svg.svg' />
                </div>
            </div>
            </div>
            {/* </div> */}
        </div>
    )
        
}