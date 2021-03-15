import React, { useState, useEffect } from 'react';

import './index.scss';
import Button from '../../button';

import classnames from 'classnames';


const PurchaseModal = (props) => {
    const { 
        tokenPrice,
        tokenPriceETH,
        account,
        setTxHash,
        units,
        setUnits,
        greerCoin,
        greerCoinSale,
        tokensAvailableSale,
        setPurchaseModalOpen,
        setConfirmationModalOpen, 
    } = props;

    const [ buyTokenFlag, setBuyTokenFlag ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ disabled, setDisabled ] = useState(true);
    const [ processing, setProcessing ] = useState(false);

    const getEthValue = () => {
        if (!units || errorMessage) return <span className="placeholder">{(0).toFixed(2)}</span>;
        return (Math.max(units * tokenPriceETH, 0)).toFixed(4);
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
        else if (newUnits === 0) {
            setErrorMessage("Please select at least 1 GreerCoin.");
            setDisabled(true);
        }
        else if (newUnits < 0) {
            setErrorMessage("You cannot buy a negative quantity.");
            setDisabled(true);
        }
        else if (newUnits > tokensAvailableSale) {
            setErrorMessage("Not enough GreerCoins available.");
            setDisabled(true);
        }
    }

    useEffect(() => {
        
        const buyTokenTransaction =  async () => {

            if (!greerCoin || !greerCoinSale || !buyTokenFlag) return;

            setDisabled(false);
            setErrorMessage(null);
            setProcessing(true);

            let wei = units * tokenPrice;

            await greerCoinSale.methods.buyTokens(units)
                .send({ value: wei, from: account })
                .on("transactionHash", (txHash) => {
                    setTxHash(txHash);
                    setPurchaseModalOpen(false);
                    setConfirmationModalOpen(true);
                })
                .catch((err) => {
                    setProcessing(false);
                    console.log(err);
                    setErrorMessage("Transaction failed. Please check console or try again.");
                })

            setBuyTokenFlag(false);
        }

        buyTokenTransaction();

    }, [ buyTokenFlag, greerCoin, greerCoinSale ]);

    const sendBuyTokens = (ev) => {
        ev.stopPropagation();

        if (Boolean(errorMessage) || !units) return;
        setBuyTokenFlag(true);
    }

    const statusCss = classnames("status", {
        show: Boolean(errorMessage)
    })

    return (
        <div className="purchase-modal">
            <div className="header">
                <p>Trade</p>
            </div>

            <div className="trade">
                    
                <div className="quantity">
                    <div className="label">Quantity</div>
                    <div className="value">
                        <input 
                            pattern="^[0-9]*$"
                            type="number" 
                            value={units} 
                            placeholder="0"
                            onChange={updateUnits} />
                        <div className="currency">GRC</div>
                    </div>
                </div>

                <div className="arrow">
                    <img src="down_arrow.svg" alt="" />
                </div>

                <div className="price">
                    <div className="label">Price</div>
                    <div className="value">
                        <p className="num">{getEthValue()}</p>

                        <div className="currency">ETH</div>
                    </div>
                </div>
            </div>
            
            <div className={statusCss}>
                {errorMessage && <p className="error">{`${errorMessage}`}</p>}
            </div>

            <div className='button-wrapper'>
                <Button 
                    minWidth="120px"
                    onClick={sendBuyTokens} 
                    cta={processing ? <img src="spinner_white.svg" alt="" /> : "Confirm"} 
                    disabled={disabled} invert/>
            </div>
        </div>
    )
}

export default PurchaseModal;