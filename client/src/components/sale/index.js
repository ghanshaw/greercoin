import React, { useState, useEffect, useContext } from 'react';

import './index.scss';

import axios from 'axios';
import Web3 from "web3";

import Button from '../button';
import Countdown from '../countdown';
import ProgressBar from '../progressBar';

import GreerCoinContract from "../../contracts/GreerCoin.json";
import GreerCoinIsoContract from "../../contracts/GreerCoinIso.json";

import classnames from 'classnames';
import LayoutContext from '../../context/layoutContext';
import Modal from '../modals';
import ConnectionModal from '../modals/connection';
import PurchaseModal from '../modals/purchase';

export default (props) => {
    const layout = useContext(LayoutContext);
    const [ pageLoading, setPageLoading ] = useState(true);
    const [ web3, setWeb3 ] = useState(null);
    const [ web3Error, setWeb3Error ] = useState(null);
    
    const [ msgHover, setMsgHover ] = useState(false);

    const [ account, setAccount ] = useState(null);
    const [ greerCoin, setGreerCoin ] = useState(null);
    const [ greerCoinIso, setGreerCoinIso ] = useState(null);

    const [ tokenPrice, setTokenPrice ] = useState(0);
    const [ tokenPriceETH, setTokenPriceETH ] = useState(0);
    const [ tokenSupply, setTokenSupply ] = useState(0);
    const [ tokensSold, setTokensSold ] = useState(0);
    const [ tokensAvailableIco, setTokensAvailableIco ] = useState(0);
    const [ tokensAvailableUser, setTokensAvailableUser ] = useState(0);
    
    const [ intialTokenSupply, setIntialTokenSupply ] = useState(0);

    
    const [ usdRate, setUsdRate ] = useState(null);

    const [ connectWeb3Flag, setConnectWeb3Flag ] = useState(false);
    const [ networkName, setNetworkName ] = useState("");
    const [ networkId, setNetworkId ] = useState(null);

    // Async Blockchain Apis
    const [ loadDataFlag, setLoadDataFlag ] = useState(true);
    const [ loadContractsFlag, setLoadContractsFlag ] = useState(false);
    const [ accountChangeFlag, setAccountChangeFlag ] = useState(false);
    const [ networkChangeFlag, setNetworkChangeFlag ] = useState(false); 

    // Modals
    const [ purchaseModalOpen, setPurchaseModalOpen ] = useState(false);
    const [ connectionModalOpen, setConnectionModalOpen ] = useState(false);

    
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
        
        // // Get account
        // await handleAccountChange();

        // await handleNetworkChange();

        // // Load contracts
        // setLoadContractsFlag(true);

        // // Load data
        // setLoadDataFlag(true);
    }

    

    const handleAccountChange = async () => {
        var accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setAccountChangeFlag(false);
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

            // Get GreerCoinIco contract instance
            deployedNetwork = GreerCoinIsoContract.networks[networkId];
            const greerCoinIso = new web3.eth.Contract(
                GreerCoinIsoContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            setGreerCoin(greerCoin);
            setGreerCoinIso(greerCoinIso);
            setLoadContractsFlag(false);

            console.log("GreerCoin address: " + greerCoin.options.address);
            console.log("GreerCoinSale address: " + greerCoinIso.options.address);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert( `Failed to load accounts.`, );
            console.error(error);
        }
    }

   

    // Load contract data
    const loadData = async () => {
        debugger;

        // if (!greerCoin || !greerCoinIso || !loadDataFlag) return;   

        let greerCoinIcoAddr = greerCoinIso.options.address;
        let greerCoinAddr = greerCoin.options.address;

        // Contract is not available on blockchain
        if (!greerCoinAddr || !greerCoinIcoAddr) return;
        //     setTokenSupply(0);
        //     setTokenPrice(0);
        //     setTokensSold(0);
        //     setIntialTokenSupply(0);
        //     setTokensAvailableIco(0);
        //     setTokensAvailableUser(0);
        //     setTokenPriceETH(0)
        //     setLoadDataFlag(false);
        //     return;
        // }

        // Get the value from the contract to prove it worked.
        const totalSupplyRes = await greerCoin.methods.totalSupply().call();
        let tokenPriceRes = await greerCoinIso.methods.tokenPrice().call();
        let tokensSoldRes = await greerCoinIso.methods.tokensSold().call();
        let tokensAvailableICORes = await greerCoin.methods.balanceOf(greerCoinIcoAddr).call();
        let tokensAvailableUserRes = await greerCoin.methods.balanceOf(account).call();
    
        tokensSoldRes = Number.parseFloat(tokensSoldRes)
        tokensAvailableICORes = Number.parseFloat(tokensAvailableICORes)
        tokensAvailableUserRes = Number.parseFloat(tokensAvailableUserRes);

        // Update state with the result.
        setTokenSupply(Number.parseFloat(totalSupplyRes));
        setTokenPrice(tokenPriceRes);
        setTokensSold(Number.parseFloat(tokensSoldRes));
        setIntialTokenSupply(tokensSoldRes + tokensAvailableICORes);
        setTokensAvailableIco(tokensAvailableICORes);
        setTokensAvailableUser(Number.parseFloat(tokensAvailableUserRes));
        setTokenPriceETH(web3.utils.fromWei(tokenPriceRes))
        setLoadDataFlag(false);
    };

    
    // Check for MetaMask
    useEffect(() => {

        window.addEventListener("load", async () => {
            setPageLoading(false);

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
        });

    }, []);

    // Setup event handlers
    useEffect(() => {

        if (!window.ethereum) return;

        window.ethereum.on('accountsChanged', handleAccountChange);
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });

    }, [ web3]);


    // Connect to MetaMask
    useEffect(() => {
        
        if (!connectWeb3Flag) return;
        connectWeb3();
        setConnectWeb3Flag(false);
        
    }, [ connectWeb3Flag ]);

    // Load contracts
    useEffect(() => {
        debugger;
        if (!web3 || !account || !loadContractsFlag) return;
        loadContracts();
        
    }, [ web3, account, loadContractsFlag ]);


    // Load contract data
    useEffect(() => {
        if (!greerCoin || !greerCoinIso || !account || !loadDataFlag) return;
        loadData();
    }, [ greerCoin, greerCoinIso, account, loadDataFlag ]);

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


    // useEffect(() => {
        
        
    // })
    
    // Get conversion rate
    useEffect(() => {

        const getUsd = async () => {
            const url = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR"

            await axios.get(url)
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

        const detectEvents = () => {

            if (!greerCoin || !greerCoinIso) return;

            greerCoinIso.events.Sell()
                .on('data', (event) => {
                    setLoadDataFlag(true);
                })
                .on('error', (err) => console.error(err));


            greerCoin.events.Transfer()
                .on('data', (event) => {
                    setLoadDataFlag(true);
                })
                .on('error', (err) => console.error(err));
        }

        return;
        detectEvents()

    }, [ greerCoin, greerCoinIso ]);

    const getConversionMsg = () => {
        let message = `1 GRC = ${tokenPriceETH} ETH`;
        if (usdRate != null) {
            let usd = usdRate * tokenPriceETH;
            usd = usd.toFixed(2);
            // usd = .43
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

        const icon = <img src="warning_icon.svg" />;

        const networks = [1, 3];
        
        const noMetaMask = (
            <p>This contract is deployed to the blockchain. Please install <a target="_blank" href="https://metamask.io/">MetaMask</a> to trade GreerCoin.</p>
        )

        const notConnected = (
            <p>Please connect your wallet via MetaMask to continue.</p>
        )

        const wrongNetwork = (
            <p>You are connected to the {networkName} network. Please connect to the Mainnet or Ropsten.</p>
        )

        if (!web3) {
            return <>{icon}{noMetaMask}</>;
        } else if (!account) {
            return <>{icon}{notConnected}</>
        } else if (networks.indexOf(networkId) < 0) {
            return <>{icon}{wrongNetwork}</>
        }

        return null;

    }

    const getButton = () => {


        let cta = "";
        let onClick = {};

        // No MetaMask
        if (!web3) {
            cta = "Install MetaMask";
            onClick = () => { }
        } else if (!account) {
            cta = "Connect MetaMask"
            onClick = triggerConnectWeb3;
        } else {
            cta = "Buy Tokens"
            onClick = () => { setPurchaseModalOpen(true) }
        }

        return <Button cta={cta} onClick={onClick} />
    }

    

    const triggerConnectWeb3 = () => {
        setConnectionModalOpen(true);
        setConnectWeb3Flag(true);        
    }

    

    const saleCss = classnames("sale", layout);
    const saleScrollerCss = classnames("sale-scroller", layout);
    const progressBarSecCss = classnames("progress-bar-section", layout)

    return (
        <div className={saleCss}>
            <div className={saleScrollerCss}>

                <div className="warning">
                    {!pageLoading && getWarningMessage()}
                </div>
                        
                <div className="debug">
                    <div><p>{`web3: ${Boolean(web3)}, Account: ${account}`}</p></div>
                </div>

                <div className="sale-content">
                    

                    <div className="sale-description"> 
                        <h1 className="title"><span>GreerCoin</span> ICO</h1>
                        <p><b>GreerCoin (GRC)</b> is an ERC-20 compliant Ethereum token created by me as a demo. Feel free to try it out by buying some coins.</p>

                        <p className="disclaimer">GreerCoin was created soley for demonstration purposes and does not have any real monetary value. Only spend ETH you don't need.</p>
                    </div>


                    <div className="sale-action">
                        <div className="content">
                            <div className="ico-description">
                                <p>ICO sale ends <b>12/31/2021 11:59:59 EST</b></p>
                            </div>

                            <div className="countdown-section">
                                <Countdown />
                            </div>
                            
                            <div className={progressBarSecCss}>
                                <div className="conversion-msg">
                                    <p>{getConversionMsg()}</p>
                                    {networkName ? <p>{`${networkName} Network`}</p> : <p>No connection...</p>}
                                </div>
                               
                                <ProgressBar tokensSold={tokensSold} tokensAvailableIco={tokensAvailableIco} />
                                
                                <div className="token-count">
                                    <div className="tokens-owned">
                                        <p>{`You currently own ${tokensAvailableUser.toLocaleString()} coins`}</p>
                                        
                                    </div>

                                    <div className="tokens-left" 
                                        onMouseEnter={() => { setMsgHover(true) }}
                                        onMouseLeave={() => { setMsgHover(false) }}>
                                        {msgHover ? 
                                            <p>{`${tokensSold.toLocaleString()} / ${intialTokenSupply.toLocaleString()} Sold`}</p> :
                                            <p>{`${tokensAvailableIco.toLocaleString()} GRC left`}</p> }
                                    </div>
                                </div>
                            </div>

                            <div className="button_wrapper">
                                {getButton()}
                            </div>


                            <div>
                                {purchaseModalOpen &&
                                    <Modal
                                        setModalOpen={setPurchaseModalOpen}
                                        content={
                                            <PurchaseModal 
                                                openModal={purchaseModalOpen} 
                                                setOpenModal={setPurchaseModalOpen} 
                                                account={account}
                                                greerCoin={greerCoin} 
                                                greerCoinIso={greerCoinIso} 
                                                tokensAvailableIco={tokensAvailableIco}
                                                tokenPrice={tokenPrice}
                                                setTokenPrice={setTokenPrice} />} />}                                    
                            </div>

                            <div>
                                {connectionModalOpen &&
                                    <Modal 
                                        setModalOpen={setConnectionModalOpen} 
                                        content={<ConnectionModal web3Error={web3Error} />} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* <div className="page">
            <div className="content_wrapper" >
                {props.web3 ? 
                (<div className="banner">
                    <div className="left">
                       

                        <p>Greercoin is a next generation coin that's poised to disrupt everything you thought you knew about finance.</p>

                        <p>Actually, Greercoin is an ERC-20 compliant Ethereum token created by my to demontrate my my crypto skills.</p>

                        <p>Participate in the opportunity of a lifetime by purchasing some Greercoin. 
                            Note: This is deplloyed to the live blockchain, and therefore requires real ether. </p>

                            {/* <p>A GreerCoin can be used for {tokenPrice} wei</p> */

        //                 <div className="button" onClick={() => { buyToken() }}>Buy 1 Token</div>
        //             </div>

        //             <div className="right">
                        
        //             </div>
                    
        //         </div>) :
        //         <div>Loading Web3, accounts, and contract...</div>
        //     }
        //     </div>
        // </div> */}


        // const connectWeb3 = async () => {

        //     if (!connectWeb3Flag) return;
    
        //     // Get network provider and web3 instance.
        //     const web3 = await getWeb32()
        //         .then(() => {
        //             setWeb3(web3)
        //         })
        //         .catch((error) => {
        //             // Catch any errors for any of the above operations.
        //             // alert( `Failed to load web3, accounts, or contract. Check console for details.`, );
        //             // debugger;
        //             setWeb3Error(error);
        //             console.error(error);
        //         })
        //         .finally(() => {
        //             setConnectWeb3Flag(false);
        //         })
        //     return web3;
        // }

    //     // Detect MetaMask account changes
    // useEffect(() => {

    //     if (!web3) return;

    //     window.ethereum.on('chainChanged', async function (accounts) {
    //         // if (!web3) return;

    //         debugger;
    //         setAccount(accounts[0]);

            

    //         setLoadDataFlag(true);
    //     })
        
    // }, []);

    

    // // Detect MetaMask account changes
    // useEffect(() => {

    //     if (!web3) return;

    //     window.ethereum.on('accountsChanged', async function (accounts) {
    //         // if (!web3) return;

    //         debugger;
    //         setAccount(accounts[0]);

    //         // Get name of network
    //         let name = await web3.eth.net.getNetworkType();

    //         // Make network name capitalized
    //         name = name[0].toUpperCase() + name.slice(1);
    //         setNetworkName(name);

    //         setLoadDataFlag(true);
    //     })
        
    // }, []);