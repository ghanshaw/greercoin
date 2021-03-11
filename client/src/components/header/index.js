import React from 'react';

import './index.scss';

import { Link } from 'react-router-dom';

export default () => {

    return (
        <div className="header">
            <Link to="/" >
                <div className="brand">
                    <img src='insular_g_svg.svg' />
                    <p >GreerCoin</p>
                </div>
            </Link>

            <Link to="/about" className="link">
                <p className="link">About</p>
            </Link>
        </div>
    )
}