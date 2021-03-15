import React, { useEffect } from 'react';

import animate from './animation';
import './index.scss';

export default () => {

    useEffect(() => {
        const pointColor = {
            r: 179,
            g: 183,
            b: 212
        };

        animate(null, pointColor);
    }, [])

    return (
        <div className="background">
            <canvas id="scene" width="100" height="200" />
        </div>
    )

}
