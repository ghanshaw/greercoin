import React, { useEffect } from 'react';


import animate from './animation';
import './index.scss';

export default () => {

    useEffect(() => {
        // Pass background color as param
        const backgroundColor = {
            r: 0,
            g: 78,
            b: 140
        }

        // turquoise
        // const backgroundColor = {
        //     r: 0,
        //     g: 206,
        //     b: 203
        // }

        // dark turquoise
        // const backgroundColor = {
        //     r: 25,
        //     g: 164,
        //     b: 150
        // }

        // White
        // const pointColor = {
        //     r: 255,
        //     g: 255,
        //     b: 255
        // }

        let pointColor = {};

        // Dark blue
        pointColor = {
            r: 46,
            g: 40,
            b: 128
        }

        pointColor = {
            r: 79,
            g: 79,
            b: 100
        }

        // #eee
        pointColor = {
            r: 190,
            g: 190,
            b: 190
        }

        pointColor = {
            r: 179,
            g: 183,
            b: 212
        }

        animate(backgroundColor, pointColor);
    }, [])

    return (
        <div className="background">
            <canvas id="scene" width="100" height="200" />
        </div>
    )

}
