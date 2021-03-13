import React from 'react';

import './index.scss';

const ConnectionModal = (props) => {
    const {
        web3Error
    } = props;

    return (
        <div className="connection-modal">
            {!web3Error ?
                <div className="connecting">
                    <img src="spinner.svg" alt=""/>
                    <p>Check MetaMask to finish connecting...</p>
                </div> :
                <div className="error">
                    <p className="title">Connection Failed</p>
                    <p className="message">{web3Error.message}</p>
                    <p>Check your MetaMask extension or refresh the page.</p>
                </div>}
        </div>
    )
}

export default ConnectionModal;