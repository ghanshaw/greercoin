import React from 'react';

import './index.scss';

export default (props) => {  
    const {
        setModalOpen,
        content
    }  = props;

    const closeModal = (ev) => {
        ev.stopPropagation();
        
        let className = ev.target.className;
        if (className.indexOf("modal-background") === -1) return;
        
        setModalOpen(false);
    }

    return (
        <div className="modal-background" onClick={closeModal}>
            <div className="modal" >
                {content}
            </div>
        </div>
    )
}