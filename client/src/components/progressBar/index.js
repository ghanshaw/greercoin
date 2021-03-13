import React from 'react';

import './index.scss';

export default (props) => {
    let { tokensSold, tokensAvailableIco } = props;        

    const getProgress = () => {
        tokensSold = Number.parseInt(tokensSold)
        tokensAvailableIco = Number.parseInt(tokensAvailableIco);
        if (tokensAvailableIco > 0 || tokensSold > 0) {
            return (tokensSold / (tokensSold + tokensAvailableIco)).toFixed(2);
        }
        return 0
    }

    const progressPct = (getProgress() * 100) + '%';

    return (
        <div className="progress-bar">
            <div className="progress-bar_shell">
                <div className="progress" style={{width: progressPct}}>
                    <div className="progress-label"><span>{progressPct}</span></div>
                    {/* <div>{progress}</div> */}
                </div>
            </div>
        </div>
    )
}