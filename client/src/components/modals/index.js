import React, { useState, useEffect } from 'react';

import './index.scss';

import classnames from 'classnames';

// import Button from '../button';

export default (props) => {  
    const {
        setModalOpen,
        content
    }  = props;

    const closeModal = (ev) => {
        let className = ev.target.className;
        if (className.indexOf("modal_background") == -1) return;
        ev.stopPropagation();
        setModalOpen(false);
    }

    return (
        <div className="modal_background" onClick={closeModal}>
            <div className="modal" >
                {content}
            </div>
        </div>
    )
}