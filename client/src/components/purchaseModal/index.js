import React, { useState, useEffect } from 'react';

import './index.scss';

import classnames from 'classnames';

import Button from '../button';

export default (props) => {
    const { 
        openModal, 
        setOpenModal, 
        tokenPrice,
        account,
        greerCoin,
        greerCoinIso,
        tokensAvailableIco
    } = props;
    const [ units, setUnits ] = useState(1);
    const [ buyTokenFlag, setBuyTokenFlag ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ disabled, setDisabled ] = useState(false);

    const [ tokensSold, setTokensSold ] = useState(0);

    const closeModal = (ev) => {
        let className = ev.target.className;
        if (className.indexOf("modal_background") == -1) return;
        ev.stopPropagation();
        setOpenModal(false);
    }

    

    

    // curl https://mainnet.infura.io/v3/1ef7e6ae9b5f4abda10188b9f4a6cc84 \
    // -X POST \
    // -H "Content-Type: application/json" \
    // -d '{"jsonrpc":"2.0","method":"eth_blockNumber", "params": [], "id":1}'

    // curl — user 76cda17deca048c9ad5af0360c54e40e \
    // https://mainnet.infura.io/v3/1ef7e6ae9b5f4abda10188b9f4a6cc84

    useEffect(() => {
        
        const buyTokenTransaction =  async () => {

            if (!greerCoin || !greerCoinIso || !buyTokenFlag) return;

            setDisabled(false);
            setErrorMessage(null);

            let wei = units * tokenPrice;

            let receipt = await greerCoinIso.methods.buyTokens(units)
                .send({ value: wei, from: account })
                .catch((err) => {
                    let message = err.message;
                    let colon = message.indexOf(':');
                    if (colon >= 0) {
                        message = message.substring(colon+1);
                    }
                    message = `${message} Please try again.`
                    setErrorMessage(message);
                    console.log(err);
                })

            console.log("Step 2")
            await greerCoinIso.methods.tokensSold().call()
                .then((tokensSoldRes) => {
                    console.log(tokensSoldRes);
                    console.log("Step 4")
                    setTokensSold(tokensSoldRes);
                })
                .catch((err) => {
                    console.log(err);
                })

            console.log("Step 3")
            setBuyTokenFlag(false);
        }

        buyTokenTransaction();

    }, [ buyTokenFlag ]);


    const sendBuyTokens = (ev) => {
        ev.stopPropagation();
        setBuyTokenFlag(true);
    }

    return (
        <>
            {openModal &&
                <div className="modal_background" onClick={closeModal}>
                    <div className="modal" >

                        
                    </div>
                </div>}
        </>
    )
}