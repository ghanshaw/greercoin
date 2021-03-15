import React from 'react';

import './index.scss';

export default (props) => {
    let { tokensSold, tokensAvailableSale } = props;        

    const getProgress = () => {
        tokensSold = Number.parseInt(tokensSold)
        tokensAvailableSale = Number.parseInt(tokensAvailableSale);
        if (tokensAvailableSale > 0 || tokensSold > 0) {
            return (tokensSold / (tokensSold + tokensAvailableSale));
        }
        return 0
    }

    const progressPct = (getProgress() * 100).toFixed(0) + '%';

    return (
        <div className="progress-bar">
            <div className="progress-bar_shell">
                <div className="progress" style={{width: progressPct}}>
                    <div className="progress-label"><span>{progressPct}</span></div>
                </div>
            </div>
        </div>
    )
}