import React, { useContext } from 'react';

import './index.scss';
import classnames from 'classnames';
import LayoutContext from '../../context/layoutContext';

import * as links from '../../constants/links';

import GreerCoinContract from "../../contracts/GreerCoin.json";

import { networkIds } from '../../constants/app';


export default () => {
    const layout = useContext(LayoutContext);

    const aboutCss = classnames('about', layout);

    const mainnetAddr = "0x0" || GreerCoinContract.networks[networkIds.MAINNET].address;
    const ropstenAddr = GreerCoinContract.networks[networkIds.ROPSTEN].address;

    const mainnetUrl = links.etherscan.token.mainnet + mainnetAddr;
    const ropstenUrl = links.etherscan.token.ropsten + ropstenAddr;

    const getLink = (link, text) => {
        return (<a href={link} target="_blank" rel="noopener noreferrer">{text}</a>);
    }

    return (
        <div className={aboutCss}>
            <div className="about-scroller">

                <div className="about-content">
                    
                    <h3>What is GreerCoin?</h3>

                    <p>GreerCoin is an ERC20 compliant etherum token created by me. 
                        It was built as a learning endeavor during my free time.
                        GreerCoin is deployed to both the Mainnet and to the Ropsten test network.
                        Please be advised that GreerCoin was created soley for demonstration purpsoses and has NO real monitary value.
                    </p>

                    {/* ------------------------- */}
                    <h3>Where is GreerCoin?</h3>

                    <p>GreerCoin has been deployed to the live Ethereum blockchain. 
                        You can view the token in etherscan. 
                        Check out the both {getLink(mainnetUrl, "Mainnet")} version and 
                        the {getLink(ropstenUrl, "Ropsten")} version.</p>
                    
                    <p>You can also add GreerCoin to your MetaMask plugin.</p>

                    {/* ------------------------- */}
                    
                    <h3>How It Works</h3>

                    <p>Using GreerCoin is simple.</p>
                    <ol>
                        <li>Download MetaMask.</li>
                        <li>Load ether into your wallet.</li>
                        <ul>
                            <li>For Rosten, use an {getLink(links.etherFacet, "ether faucet")}.</li>
                            <li>For Mainnet, use any popular crypto exchange, such as {getLink(links.coinbase, "coinbase")}.</li>
                        </ul>
                        <li>Purchase GreerCoin.</li>
                    </ol>
                    
                    {/* ------------------------- */}
                    <h3>Technology & Resources</h3>
                    <p>I used various frameworks in order to built this project.</p>
                    <p>The contract code was written in Solidity. I developed the frontend using React, {getLink(links.truffle, "truffle")} and {getLink(links.web3, "web3")}. 
                        This project consists of two contracts, both of which were written in a test-driven fashion.
                        I used {getLink(links.metamask, "MetaMask")} and {getLink(links.ganache, "Ganache")} throughout the development process -- it's also required to use the website. 
                        And I deployed the token and sale contracts using {getLink(links.infura, "Infura")}.</p>
                
                    <p>In addition, I want to give my thanks to the author of the canvas script, which can be found {getLink(links.canvasFiddle, "here")}.</p>

                    {/* ------------------------- */}
                    <div className="logo">
                        <img src='logo_white.svg' alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
        
}