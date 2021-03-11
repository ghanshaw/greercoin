import React, { useState, useEffect } from 'react';

import './index.scss';
import Button from '../../button';

const PurchaseModal = (props) => {
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
    const [ processing, setProcessing ] = useState(false);

    const [ tokensSold, setTokensSold ] = useState(0);


    const getEthValue = () => {
        return (Math.max(units * .0044, 0)).toFixed(4);
    }

    const updateUnits = (event) => {
        let newUnits = event.target.value;
        
        setUnits(newUnits);
        setErrorMessage(null);
        setDisabled(false);

        newUnits = Number.parseInt(newUnits);
        if (!Number.isInteger(newUnits)) {
            setErrorMessage("Please enter valid integer value.");
            setDisabled(true);
        }
        else if (newUnits == 0) {
            setErrorMessage("Please select at least 1 GreerCoin.");
            setDisabled(true);
        }
        else if (newUnits < 0) {
            setErrorMessage("You cannot buy a negative quantity.");
            setDisabled(true);
        }
        else if (newUnits > tokensAvailableIco) {
            setErrorMessage("Not enough GreerCoins available.");
            setDisabled(true);
        }
    }

    useEffect(() => {
        
        const buyTokenTransaction =  async () => {

            if (!greerCoin || !greerCoinIso || !buyTokenFlag) return;

            setDisabled(false);
            setErrorMessage(null);

            setProcessing(true)

            let wei = units * tokenPrice;

            let receipt = await greerCoinIso.methods.buyTokens(units)
                .send({ value: wei, from: account })
                .catch((err) => {
                    setProcessing(false);
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
        <div className="purchase-modal">
            <p>How many GRC do you want to purchase?</p>

            <div className="input-purchase">
                <div className="left">
                {/* <span class="input" role="textbox" contenteditable>{units}</span> */}
                    <input type="number" value={units} onChange={updateUnits} />
                    <span> GRC </span>
                </div>

                <div className="right">
                    <span>= {`${getEthValue()} ETH`}</span> 
                </div>
            </div>

            
            <div className="status">
                {errorMessage && <p className="error">{`* ${errorMessage}`}</p>}

                {processing && <img src="spinner.svg" />}
            </div>

            

            <div className='button-wrapper'>
                <Button onClick={sendBuyTokens} cta={"Confirm"} disabled={disabled} invert/>
            </div>
        </div>
    )
}

export default PurchaseModal;