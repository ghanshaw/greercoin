import React, { useContext } from 'react';

import './index.scss';
import classnames from 'classnames';

import LayoutContext from '../../context/layoutContext';

export default (props) => {
    const { cta, invert, disabled, onClick } = props;
    const layout = useContext(LayoutContext);

    const btnClass = classnames('button', layout, {
        'invert': invert,
        'disabled': disabled
    })

    return (
        <div onClick={onClick} className={btnClass}>{cta}</div>
    )
}