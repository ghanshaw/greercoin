import React, { useState, useEffect, useContext } from 'react';

import './index.scss';
import { cryptocompare, metamask } from '../../constants/links';

import axios from 'axios';
import Web3 from "web3";
import classnames from 'classnames';

// Contract ABIs
import GreerCoinContract from "contracts/GreerCoin.json";
import GreerCoinSaleContract from "contracts/GreerCoinSale.json";

// Components
import Button from 'components/button';
import Countdown from 'components/countdown';
import ProgressBar from 'components/progressBar';

// Context
import LayoutContext from 'context/layoutContext';

// Modals
import Modal from 'components/modals';
import ConnectionModal from 'components/modals/connection';
import PurchaseModal from 'components/modals/purchase';
import ConfirmationModal from 'components/modals/confirmation';

export default (props) => {
    const layout = useContext(LayoutContext);
    const endDate = new Date(2022, 0, 0);

    const [ pageLoading, setPageLoading ] = useState(true);
    
    const [ units, setUnits ] = useState(0);
    const [ txHash, setTxHash ] = useState("");
    const [ usdRate, setUsdRate ] = useState(null);
    const [ msgHover, setMsgHover ] = useState(false);
    
    // Metamask state
    const [ web3, setWeb3 ] = useState(null);
    const [ web3Error, setWeb3Error ] = useState(null);
    const [ account, setAccount ] = useState(null);

    // Contract state
    const [ greerCoin, setGreerCoin ] = useState(null);
    const [ greerCoinSale, setGreerCoinSale ] = useState(null);
    const [ networkName, setNetworkName ] = useState("");
    const [ networkId, setNetworkId ] = useState(null);
    const [ tokenPrice, setTokenPrice ] = useState(0);
    const [ tokenPriceETH, setTokenPriceETH ] = useState(0);
    const [ tokensSold, setTokensSold ] = useState(0);
    const [ tokensAvailableSale, setTokensAvailableSale ] = useState(0);
    const [ tokensAvailableUser, setTokensAvailableUser ] = useState(0);
    const [ intialTokenSupply, setIntialTokenSupply ] = useState(0);   

    // Async Blockchain Apis
    const [ loadDataFlag, setLoadDataFlag ] = useState(true);
    const [ loadContractsFlag, setLoadContractsFlag ] = useState(false);
    const [ accountChangeFlag, setAccountChangeFlag ] = useState(false);
    const [ networkChangeFlag, setNetworkChangeFlag ] = useState(false); 
    const [ connectWeb3Flag, setConnectWeb3Flag ] = useState(false);

    // Modals
    const [ purchaseModalOpen, setPurchaseModalOpen ] = useState(false);
    const [ connectionModalOpen, setConnectionModalOpen ] = useState(false);
    const [ confirmationModalOpen, setConfirmationModalOpen ] = useState(false);

    
    const setup = async () => {
        // Get account data
        setAccountChangeFlag(true);

        // Update network name
        setNetworkChangeFlag(true)

        // Load contracts
        setLoadContractsFlag(true);

        // Load data
        setLoadDataFlag(true);
    }

    const connectWeb3 = async () => {
        // Trigger Web3 popup
        await window.ethereum.enable();
        setup();
    }

    const handleAccountChange = async () => {
        var accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setAccountChangeFlag(false);
        setConnectionModalOpen(false);
    }

    const handleNetworkChange = async () => {
        //Get name of network
        let name = await web3.eth.net.getNetworkType();
        let networkId = await web3.eth.net.getId();

        // Make network name capitalized
        name = name[0].toUpperCase() + name.slice(1);
        setNetworkName(name);
        setNetworkId(networkId);
        setNetworkChangeFlag(false);
    }

    const loadContracts = async () => {
        try {
            // Get GreerCoin contract instance
            const networkId = await web3.eth.net.getId();
            let deployedNetwork = GreerCoinContract.networks[networkId];
            const greerCoin = new web3.eth.Contract(
                GreerCoinContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Get GreerCoinSale contract instance
            deployedNetwork = GreerCoinSaleContract.networks[networkId];
            const greerCoinSale = new web3.eth.Contract(
                GreerCoinSaleContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            setGreerCoin(greerCoin);
            setGreerCoinSale(greerCoinSale);
            setLoadContractsFlag(false);

            console.log("GreerCoin address: " + greerCoin.options.address);
            console.log("GreerCoinSale address: " + greerCoinSale.options.address);
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    }

    // Load contract data
    const loadData = async () => { 

        let greerCoinSaleAddr = greerCoinSale.options.address;
        let greerCoinAddr = greerCoin.options.address;

        // Contract is not available on blockchain
        if (!greerCoinAddr || !greerCoinSaleAddr) return;

        // Get the value from the contract to prove it worked.
        const totalSupplyRes = await greerCoin.methods.totalSupply().call();
        let tokenPriceRes = await greerCoinSale.methods.tokenPrice().call();
        let tokensSoldRes = await greerCoinSale.methods.tokensSold().call();
        let tokensAvailableSaleRes = await greerCoin.methods.balanceOf(greerCoinSaleAddr).call();
        let tokensAvailableUserRes = await greerCoin.methods.balanceOf(account).call();
    
        tokensSoldRes = Number.parseFloat(tokensSoldRes)
        tokensAvailableSaleRes = Number.parseFloat(tokensAvailableSaleRes)
        tokensAvailableUserRes = Number.parseFloat(tokensAvailableUserRes);

        // Update state with the result.
        setTokenPrice(tokenPriceRes);
        setTokensSold(Number.parseFloat(tokensSoldRes));
        setIntialTokenSupply(tokensSoldRes + tokensAvailableSaleRes);
        setTokensAvailableSale(tokensAvailableSaleRes);
        setTokensAvailableUser(Number.parseFloat(tokensAvailableUserRes));
        setTokenPriceETH(web3.utils.fromWei(tokenPriceRes))
        setLoadDataFlag(false);
    };

    
    // Check for MetaMask
    useEffect(() => {

        const instantiateWeb3 = async () => {

            let web3;
            if (window.ethereum) {
                web3 = new Web3(window.ethereum)
            }
            else if (window.web3) {
                web3 = window.web3;
            }
            setWeb3(web3);

            if (web3) {
                await web3.eth.net.isListening()
                    .then((bool) => {
                        return setup();
                    });
            } 

            // Allow time for blockchain operations to finish
            setTimeout(() => {
                setPageLoading(false);
            }, 1000);            
        }

        if (document.readyState === 'complete' && !web3) {
            instantiateWeb3()
        } else {
            window.addEventListener("load", instantiateWeb3);
        }
    }, []);

    // Setup event handlers
    useEffect(() => {

        if (!window.ethereum) return;

        /**
         * Also triggered when MetaMask locks
         */
        window.ethereum.on('accountsChanged', () => {
            setAccountChangeFlag(true);
            setLoadDataFlag(true);
        });

        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });

    }, [ web3 ]);


    // Connect to MetaMask
    useEffect(() => {
        
        if (!connectWeb3Flag) return;
        connectWeb3();
        setConnectWeb3Flag(false);
        
    }, [ connectWeb3Flag ]);


    // Load contracts
    useEffect(() => {
        if (!web3 || !account || !loadContractsFlag) return;
        loadContracts();
    }, [ web3, account, loadContractsFlag ]);


    // Load contract data
    useEffect(() => {
        if (!greerCoin || !greerCoinSale || !account || !loadDataFlag || !web3) return;
        loadData();
    }, [ greerCoin, greerCoinSale, account, loadDataFlag ]);


    // Get account
    useEffect(() => {
        if (!web3 || !accountChangeFlag) return;
        handleAccountChange();
    }, [ web3, accountChangeFlag ]);


    // Get network data
    useEffect(() => {
        if (!web3 || !networkChangeFlag) return;
        handleNetworkChange();
    }, [ web3, networkChangeFlag ]);

    
    // Get conversion rate
    useEffect(() => {

        const getUsd = async () => {

            await axios.get(cryptocompare)
                .then(res => {
                    let USD = res.data.USD;
                    setUsdRate(USD);
                })
                .catch(err => {
                    console.log(err)
                });
        }

        getUsd();

    }, [])
    

    // Detect sell and transfer events
    useEffect(() => {

        if (!greerCoin || !greerCoinSale ) return;

        let greerCoinSaleAddr = greerCoinSale.options.address;
        let greerCoinAddr = greerCoin.options.address;

        if (!greerCoinAddr || !greerCoinSaleAddr) return;

        greerCoinSale.events.Sell()
            .on('data', (event) => {
                console.log("SELL EVENT")
                setLoadDataFlag(true);
            })
            .on('error', (err) => console.error(err));


        greerCoin.events.Transfer()
            .on('data', (event) => {
                console.log("TRANSFER EVENT")
                setLoadDataFlag(true);
            })
            .on('error', (err) => console.error(err));

    }, [ greerCoin, greerCoinSale ]);

    const getConversionMsg = () => {
        let message = `1 GRC = ${tokenPriceETH} ETH`;
        if (usdRate != null) {
            let usd = usdRate * tokenPriceETH;
            usd = usd.toFixed(2);

            if (usd < 1) {
                usd = usd * 100;
                message += ` ≈ ${usd}¢`
            } else {
                message += ` ≈ $${usd}`
            } 
        }
        return message;
    }
    
    const getWarningMessage = () => {

        const icon = <img src="warning_icon.svg" alt="" />;

        const networks = [1, 3];
        
        const noMetaMask = (
            <p>This contract is deployed to the blockchain. Please install <a target="_blank" rel="noopener noreferrer" href={metamask}>MetaMask</a> to trade GreerCoin.</p>
        )

        const notConnected = (
            <p>Please connect your wallet via MetaMask to continue.</p>
        )

        let wrongNetwork = (
            <p>You are connected to the {networkName} Network. Please connect to the Mainnet or Ropsten.</p>
        )
        if (networkId > 1000) {
            wrongNetwork = (
                <p>Looks like you're connected to a private network. Please connect to the Mainnet or Ropsten.</p>
            )
        }

        if (!web3) {
            return <>{icon}{noMetaMask}</>;
        } else if (!account) {
            return <>{icon}{notConnected}</>
        } else if (networks.indexOf(networkId) < 0) {
            return <>{icon}{wrongNetwork}</>
        }

        return null;
    }

    const openPurchaseModal = () => {
        if (status !== coinStatus.ACTIVE) return;
        setPurchaseModalOpen(true);
        setUnits(null);
    }

    const getButton = () => {

        let cta = "";
        let onClick = {};

        // No MetaMask
        if (!web3) {
            cta ="Install MetaMask"
            onClick=() => { window.open(metamask, '_blank'); }
        } else if (!account) {
            cta = "Connect MetaMask"
            onClick = triggerConnectWeb3;
        } else {
            cta = "Buy Tokens"
            onClick = openPurchaseModal;
        }

        return <Button disabled={status !== coinStatus.ACTIVE} cta={cta} onClick={onClick} />
    }
    

    const triggerConnectWeb3 = () => {
        setConnectionModalOpen(true);
        setConnectWeb3Flag(true);        
    }

    const coinStatus = {
        ACTIVE: 1,
        EXPIRED: 2,
        DEPLETED: 3
    }


    let status = coinStatus.ACTIVE;
    const now = new Date();
    if (web3 && tokensSold && tokensAvailableSale === 0) {
        status = coinStatus.DEPLETED;
    } else if ((endDate - now) < 0) {
        status = coinStatus.EXPIRED;
    }


    const saleCss = classnames("sale", layout);
    const saleScrollerCss = classnames("sale-scroller", layout);
    const progressBarSecCss = classnames("progress-bar-section", layout);


    return (        
        <div className={saleCss}>
            <div className={saleScrollerCss}>

                <div className="warning">
                    {pageLoading && <img className="spinner" src="spinner_white.svg" alt="" />}
                    {!pageLoading && getWarningMessage()}
                </div>
                        
                <div className="debug">
                    <div><p>{`web3: ${Boolean(web3)}, Account: ${account}`}</p></div>
                </div>

                <div className="sale-content">
                    
                    <div className="sale-description"> 
                        <h1 className="title"><span>GreerCoin</span> ICO</h1>
                        <p>GreerCoin (GRC) is an ERC20 compliant Ethereum token created by me as a demo. Feel free to try it out by buying some coins.</p>

                        <p className="disclaimer">GreerCoin was created soley for demonstration purposes and does not have any real monetary value. Only spend ETH you don't need.</p>
                    </div>

                    <div className="sale-action">
                        <div className="content">
                            {status === coinStatus.ACTIVE && 
                                <>
                                    <div className="ico-description">
                                        <p>ICO sale ends <b>12/31/2021 11:59:59 EST</b></p>
                                    </div>
                                    <div className="countdown-section">
                                        <Countdown endDate={endDate}/>
                                    </div>
                                </>}

                            {status !== coinStatus.ACTIVE &&
                                <div className="contract-over">
                                    
                                    <p className="heading">The GreerCoin ICO has ended.</p>

                                    {status === coinStatus.DEPLETED && <p className="message">
                                        All available GreerCoin have been sold.
                                        Check another network or come back later for a second coin offering.
                                    </p>}

                                    {status === coinStatus.EXPIRED &&
                                        <p className="message">The sale has expired. Come back later as more coins are disperesed.</p>}
                                
                                </div>}
                            
                            <div className={progressBarSecCss}>
                                <div className="conversion-msg">
                                    <p>{getConversionMsg()}</p>
                                    {networkName ? <p className="network">{`${networkName} Network`}</p> : <p>No connection...</p>}
                                </div>
                               
                                <ProgressBar tokensSold={tokensSold} tokensAvailableSale={tokensAvailableSale} />
                                
                                <div className="token-count">
                                    <div className="tokens-owned">
                                        <p>{`You currently own ${tokensAvailableUser.toLocaleString()} coins`}</p>
                                        
                                    </div>

                                    <div className="tokens-left" 
                                        onMouseEnter={() => { setMsgHover(true) }}
                                        onMouseLeave={() => { setMsgHover(false) }}>
                                        {msgHover ? 
                                            <p>{`${tokensSold.toLocaleString()} / ${intialTokenSupply.toLocaleString()} sold`}</p> :
                                            <p>{`${tokensAvailableSale.toLocaleString()} GRC left`}</p> }
                                    </div>
                                </div>
                            </div>

                            <div className="button_wrapper">
                                {getButton()}
                            </div>

                            <div>
                                {connectionModalOpen &&
                                    <Modal 
                                        setModalOpen={setConnectionModalOpen} 
                                        content={<ConnectionModal web3Error={web3Error} />} />}
                            </div>

                            <div>
                                {purchaseModalOpen &&
                                    <Modal
                                        setModalOpen={setPurchaseModalOpen}
                                        content={
                                            <PurchaseModal 
                                                openModal={purchaseModalOpen} 
                                                setPurchaseModalOpen={setPurchaseModalOpen} 
                                                setConfirmationModalOpen={setConfirmationModalOpen}
                                                networkId={networkId}
                                                units={units}
                                                setUnits={setUnits}
                                                setTxHash={setTxHash}
                                                account={account}
                                                greerCoin={greerCoin} 
                                                greerCoinSale={greerCoinSale} 
                                                tokensAvailableSale={tokensAvailableSale}
                                                tokenPrice={tokenPrice}
                                                tokenPriceETH={tokenPriceETH}
                                                setTokenPrice={setTokenPrice} />} />}                                    
                            </div>

                            <div>
                                {confirmationModalOpen &&
                                    <Modal 
                                        setModalOpen={setConfirmationModalOpen} 
                                        content={<ConfirmationModal 
                                            txHash={txHash}
                                            units={units}
                                            networkId={networkId}
                                            networkName={networkName}
                                            setConfirmationModalOpen={setConfirmationModalOpen} />} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
                                        