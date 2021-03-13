import React, { useContext } from 'react';
import './index.scss';

import * as links from '../../constants/links';

import LayoutContext from '../../context/layoutContext';
import classnames from 'classnames';

export default () => {
    const layout = useContext(LayoutContext);

    const footerCss = classnames('footer', layout);

    return (
        <div className={footerCss} >
            <p>GreerCoin. 2021.</p>

            <p>Designed and Developed by <a href={links.personal} target="_blank" rel="noopener noreferrer"><b>Greer Hanshaw</b></a>
            </p>

            {layout.smDown ? 
                <div className="profile">
                    <a href={links.linkedin} target="_blank" rel="noopener noreferrer"><b>LinkedIn</b></a>
                    <a href={links.github} target="_blank" rel="noopener noreferrer"><b>Github</b></a>
                </div> : 
                <>
                    <a href={links.linkedin} className="linkedin" target="_blank" rel="noopener noreferrer"><b>LinkedIn</b></a>
                    <a href={links.github} className="github" target="_blank" rel="noopener noreferrer"><b>Github</b></a>
                </>
            }
        </div>
    )
}