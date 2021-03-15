import React from 'react';

import './index.scss';

import { etherscan } from '../../../constants/links';

const MAINNET_ID = 1; 
const ROPSTEN_ID = 3;

const ConfirmationModal = (props) => {            
    const { 
        txHash,
        units,
        networkId,
        networkName,
        setConfirmationModalOpen
    } = props;

    const getTxUrl = () => {

        let url;
        if (networkId === ROPSTEN_ID) {
            url = etherscan.tx.ropsten + txHash;
        } else if (networkId === MAINNET_ID) {
            url = etherscan.tx.mainnet + txHash;
        }
        return url;
    }

    const getWaitTime = () => {
        if (networkId === ROPSTEN_ID) {
            return '<1 minute';
        } else if (networkId === MAINNET_ID) {
            return '15 - 20 minutes'
        }
    }

    const closeModal = (ev) => {
        ev.stopPropagation()
        setConfirmationModalOpen(false);
    }
                    
    return (
        <div className="confirmation-modal" onClick={closeModal}>
            <div className="check">
                <img src="checkmark.svg" alt="" />
            </div>
            <p className="thank-you">Success! You purchased {units} GreerCoin</p>

            <p className="message">Your is being confirmed on the {networkName}. Please allow {getWaitTime()} for transaction to reflect.</p>

            <p className="tx-link"><a href={getTxUrl()} target="_blank" rel="noopener noreferrer" >View Transaction</a> </p>
        </div>
    )
}

export default ConfirmationModal;