import React from 'react';
import { Carousel } from 'antd';
import StoryFirst from "../story/StoryFirst.jsx";
import StorySecond from "../story/StorySecond.jsx";
import StoryThree from "../story/StoryThree.jsx";
import StoryFour from "../story/StoryFour.jsx";
import StoryFive from "../story/StoryFive.jsx";
import './SlideShow.css'

const SlideShow = () => (
    <>
        <Carousel
            className="carousel-container"
            arrows
            dotPosition="left"
            adaptiveHeight={true}
            // fade
            infinite={false}>
            <div><StoryFirst/></div>
            <div><StorySecond/></div>
            <div><StoryThree/></div>
            <div><StoryFour/></div>
            <div><StoryFive/></div>
        </Carousel>
    </>
);
export default SlideShow;