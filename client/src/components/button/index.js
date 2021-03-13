import React, { useContext } from 'react';

import './index.scss';
import classnames from 'classnames';

import LayoutContext from '../../context/layoutContext';

export default (props) => {
    const { cta, invert, disabled, onClick, minWidth } = props;
    const layout = useContext(LayoutContext);

    const btnClass = classnames('button', layout, {
        'invert': invert,
        'disabled': disabled
    })

    return (
        <div style={{ minWidth: minWidth }} onClick={onClick} className={btnClass}>{cta}</div>
    )
}