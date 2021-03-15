import React from 'react';

import './index.scss';

import { etherscan } from 'constants/links';
import { networkIds } from 'constants/app';

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
        if (networkId === networkIds.ROPSTEN) {
            url = etherscan.tx.ropsten + txHash;
        } else if (networkId === networkIds.MAINNET) {
            url = etherscan.tx.mainnet + txHash;
        }
        return url;
    }

    const getWaitTime = () => {
        if (networkId === networkIds.ROPSTEN) {
            return '1 - 2 minutes';
        } else if (networkId === networkIds.MAINNET) {
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
            <p className="thank-you">Success! You purchased {units.toLocaleString()} GreerCoin</p>

            <p className="message">Your transaction is being confirmed on {networkId > 1000 ? 'a' : 'the'} {networkName} network. Please allow {getWaitTime()} for it to reflect.</p>

            <p className="tx-link"><a href={getTxUrl()} target="_blank" rel="noopener noreferrer" >View Transaction</a> </p>
        </div>
    )
}

export default ConfirmationModal;