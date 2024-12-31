import './ShiledCountDown.css'
import {useEffect, useState} from "react";


const ShiledCountDown = ({durationTime}) => {

    const [countDownTime, setCountDownTime] = useState(0);
    useEffect(() => {
        // 处理成秒
        const targetTime = new Date(durationTime).getTime(); // 将字符串转换为时间戳
        const currentTime = Date.now(); // 当前时间戳
        const remainingTime = Math.max(Math.floor((targetTime - currentTime) / 1000), 0); // 计算剩余秒数
        setCountDownTime(remainingTime);

        // 定时器逻辑
        if (remainingTime <= 0) return; // 如果时间已经过去
        const timer = setInterval(() => {
            setCountDownTime((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer); // 清除定时器，防止内存泄漏
    }, [durationTime]);

    const formatTime = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    };

    return (
        <div className='shiled-div-have-external'>
            <div className='shiled-div-have-internal'>
                <div className='font-div-style'>
                    <div className='time-style-div'>{formatTime(countDownTime)}</div>
                    <div className='shiled-duration-div'>Shield Duration</div>
                </div>

                <svg style={{marginLeft: '115rem'}} width="84" height="84" viewBox="0 0 84 84" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.41">
                        <circle cx="42" cy="42" r="42" fill="url(#paint0_radial_450_1875)"/>
                        <path
                            d="M42.7501 28.25C37.9498 31.4502 31.5493 32.8217 26.749 32.8217C26.749 44.0225 31.5493 55.4518 42.7501 60.2521C53.9508 55.4518 58.7512 44.0225 58.7512 32.8217C53.9508 32.8217 47.5504 31.4502 42.7501 28.25Z"
                            fill="white" fill-opacity="0.73" stroke="#ACDAD2"
                            stroke-opacity="0.49" stroke-width="10" stroke-miterlimit="10"
                            stroke-linecap="square"/>
                    </g>
                    <defs>
                        <radialGradient id="paint0_radial_450_1875" cx="0" cy="0" r="1"
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="translate(52.1257 24.0007) rotate(95.9188) scale(61.8289)">
                            <stop offset="0.02" stop-color="#EDF9F7"/>
                            <stop offset="0.23" stop-color="#B4E4DC"/>
                            <stop offset="0.515" stop-color="#32C2AA"/>
                            <stop offset="1" stop-color="#B4E4DC"/>
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

export default ShiledCountDown;