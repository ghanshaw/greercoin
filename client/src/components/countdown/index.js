import React, { useEffect, useState } from 'react';

import './index.scss';

export default (props) => {
    const { endDate } = props;
    const [ currDate, setCurrDate ]  = useState(new Date());

    const diff = Math.abs(endDate - currDate);    
    const one_second = 1000;
    const one_minute = one_second * 60;
    const one_hour = one_minute * 60;
    const one_day = one_hour * 24;

    const getDays = () => {
        return Math.floor(diff / one_day).toString().padStart(2, '0');
    }

    const getHours = () => {
        return Math.floor((diff % one_day) / one_hour).toString().padStart(2, '0');
    }

    const getMinutes = () => {
        return Math.floor((diff % one_hour) / one_minute).toString().padStart(2, '0');;
    }

    const getSeconds = () => {
        return Math.floor((diff % one_minute) / one_second).toString().padStart(2, '0');;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrDate(new Date());
        }, 1000);

        return () => clearTimeout(timer);
    }, [])

    return (
        <div className="countdown_wrapper">
            <div className="countdown">
                <div className="days counter_box">
                    <div className="value">{getDays()}</div>
                    <div className="text">DAYS</div>
                </div>

                <div className="counter_box">
                    <div className="separator">:</div>
                </div>
                

                <div className="hours counter_box">
                    <div className="value">{getHours()}</div>
                    <div className="text">HOURS</div>
                </div>

                <div className="counter_box">
                    <div className="separator">:</div>
                </div>

                <div className="minutes counter_box">
                    <div className="value">{getMinutes()}</div>
                    <div className="text">MINUTES</div>
                </div>

                <div className="counter_box">
                    <div className="separator">:</div>
                </div>

                <div className="seconds counter_box">
                    <div className="value">{getSeconds()}</div>
                    <div className="text">SECONDS</div>
                </div>
            </div>
        </div>
    )
}