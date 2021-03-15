import React, { useContext } from 'react';

import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';

import './index.scss';
import LayoutContext from '../../context/layoutContext';

export default () => {
    const layout = useContext(LayoutContext);
    const location = useLocation();

    const isAboutPage = () => {
        return location && (location.pathname === '/about');
    }

    const aboutLinkCss = classnames('about-link', 'link', {
        "active": isAboutPage()
    })

    const headerCss = classnames("header", layout);

    return (
        <div className={headerCss} >
            <Link to="/" >
                <div className="brand">
                    <img src='logo_white.svg' alt=""/>
                    <p>GreerCoin</p>
                </div>
            </Link>

            <Link to={isAboutPage() ? '/' : '/about'} className={aboutLinkCss}>
                <p>About</p>
            </Link>
        </div>
    )
}