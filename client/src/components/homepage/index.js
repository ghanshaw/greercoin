import React, { useState, useEffect } from 'react';

import './index.scss';

import Header from '../header';
import Background from '../background';
import Sale from '../sale';
import Footer from '../footer';

export default (props) => {
    return (
        <div className="homepage">
            <Sale />
        </div>
    )
}