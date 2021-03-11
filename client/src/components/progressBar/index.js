import React, { useState } from 'react';

import './index.scss';
// import classnames from classnames;

export default (props) => {
    // const [ progress, setProgress ] = useState(0);
    let { tokensSold, tokensAvailableIco } = props;    

    // const progress = Math.floor(tokensSold / (tokensSold + tokensAvailableIco));
    // const progress = tokensSold / (Number(tokensSold) + Number(tokensAvailableIco));
    // const num = tokensSold;
    // const denom = (tokensSold + tokensAvailableIco);
    // console.log(num, denom, num/denom)
    

    const getProgress = () => {
        tokensSold = Number.parseInt(tokensSold)
        tokensAvailableIco = Number.parseInt(tokensAvailableIco);
        if (tokensAvailableIco > 0) {
            // debugger;
            return (tokensSold / (tokensSold + tokensAvailableIco)).toFixed(2);
            // console.log(val);
            // return val;
        }
        return 0
    }

    const progressPct = (getProgress() * 100) + '%';

    return (
        <div className="progress-bar">
            <div className="progress-bar_shell">
                <div className="progress" style={{width: progressPct}}>
                    <div className="progress_label"><span>{progressPct}</span></div>
                    {/* <div>{progress}</div> */}
                </div>
            </div>
        </div>
    )
}