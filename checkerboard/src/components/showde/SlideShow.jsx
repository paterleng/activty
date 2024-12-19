import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';  // 样式文件
import './SlideShow.css';
import Header from "../header/Header.jsx";

const buttonStyle = {
    width: "30px",
    background: 'none',
    border: '0px'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff"><path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z"/></svg></button>,
    nextArrow: <button style={{ ...buttonStyle }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff"><path d="M512 256L270 42.6v138.2H0v150.6h270v138z"/></svg></button>
}


const SlideShow = () => {
    // 幻灯片内容，可以使用图片、文本或自定义组件
    const slides = [
        <div key={1} className="each-slide">
            <div style={{ 'backgroundImage': 'url(https://via.placeholder.com/600x400?text=Slide+1)' }}>
                <h2>Slide 1</h2>
            </div>
        </div>,
        <div key={2} className="each-slide">
            <div style={{ 'backgroundImage': 'url(https://via.placeholder.com/600x400?text=Slide+2)' }}>
                <h2>Slide 2</h2>
            </div>
        </div>,
        <div key={3} className="each-slide">
            <div style={{ 'backgroundImage': 'url(https://via.placeholder.com/600x400?text=Slide+3)' }}>
                <h2>Slide 3</h2>
            </div>
        </div>
    ];

    return (
        <div className="slideshow-container">
            <Header />
            <Slide
                indicators={false}            // 不显示指示器（圆点）
                arrows={true}                 // 显示箭头
                autoplay={false}              // 不开启自动播放
                pauseOnHover={true}           // 鼠标悬停时暂停
                transitionDuration={1000}     // 每次过渡的时间（毫秒）
                slidesToShow={1}              // 每次显示一个幻灯片
                infinite={false}
                {...properties}// 不无限循环
            >
                {slides}
            </Slide>
        </div>
    );
};

export default SlideShow;
