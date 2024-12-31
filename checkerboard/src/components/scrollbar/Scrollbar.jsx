import  { useRef, useState, useEffect } from "react";
import "./Scrollbar.css";

const CustomScroll = () => {
    const [scrollPosition, setScrollPosition] = useState(0); // 滚动条位置
    const [thumbHeight, setThumbHeight] = useState(0); // 滑块高度
    const contentRef = useRef(null); // 内容容器引用
    const trackRef = useRef(null); // 滚动条轨道引用
    const thumbRef = useRef(null); // 滑块引用
    const isDragging = useRef(false); // 是否在拖动滑块
    const startY = useRef(0); // 滑块拖动的起始位置
    const startScrollTop = useRef(0); // 内容滚动的初始位置

    useEffect(() => {
        // 初始化滑块高度
        updateThumbHeight();
    }, []);

    const updateThumbHeight = () => {
        if (contentRef.current && trackRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            const visibleHeight = contentRef.current.clientHeight;
            const trackHeight = trackRef.current.offsetHeight;

            const calculatedThumbHeight = (visibleHeight / contentHeight) * trackHeight; // 滑块高度
            setThumbHeight(calculatedThumbHeight);
        }
    };

    const handleContentScroll = () => {
        const contentHeight = contentRef.current.scrollHeight;
        const visibleHeight = contentRef.current.clientHeight;
        const trackHeight = trackRef.current.offsetHeight;
        const maxScroll = trackHeight - thumbHeight;

        // 同步滑块位置
        const contentScroll = contentRef.current.scrollTop;
        const newScrollPosition = (contentScroll / (contentHeight - visibleHeight)) * maxScroll;
        setScrollPosition(newScrollPosition);
    };

    const handleThumbMouseDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        startY.current = e.clientY; // 鼠标点击位置
        startScrollTop.current = scrollPosition; // 滑块初始位置
        document.addEventListener("mousemove", handleThumbMouseMove);
        document.addEventListener("mouseup", handleThumbMouseUp);
    };

    const handleThumbMouseMove = (e) => {
        if (!isDragging.current) return;

        const trackHeight = trackRef.current.offsetHeight;
        const deltaY = e.clientY - startY.current; // 鼠标移动的距离
        const maxScroll = trackHeight - thumbHeight;
        const newScrollPosition = Math.min(
            Math.max(startScrollTop.current + deltaY, 0),
            maxScroll
        );
        setScrollPosition(newScrollPosition);

        // 同步内容滚动位置
        const contentHeight = contentRef.current.scrollHeight;
        const visibleHeight = contentRef.current.clientHeight;
        const contentScroll = (newScrollPosition / maxScroll) * (contentHeight - visibleHeight);
        contentRef.current.scrollTop = contentScroll;
    };

    const handleThumbMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleThumbMouseMove);
        document.removeEventListener("mouseup", handleThumbMouseUp);
    };

    return (
        <div className="custom-scroll-container">
            {/* 内容区域 */}
            <div
                className="content"
                ref={contentRef}
                onScroll={handleContentScroll}
            >
                <h3>1.Choose your favorite grid, pledge SOL, and support Chico to fight the challenge!</h3>
                <p>
                    In this challenging world, only the brave can change their fate. Choose a grid you love, pledge your SOL, and help Chico guard the magical bowl. Every warrior who supports Chico will become an important part of his rise!
                </p>
                <h3>2.Chico adds 5% rewards to your pledge every hour. Join early and get more!</h3>
                <p>
                    After Chico reoccupys the glowing bowls, he will personally check and increase the reward by 5% every hour to those who support him. The sooner you join the adventure, the more rewards you will reap! This is not only an opportunity to support Chico, but also a moment to change your own destiny.
                </p>
                <h3>3.The central grid has been guarded and other adventurers cannot enter!</h3>
                <p>
                    Chico's persistence is not only for himself, but also for the hope of all little warriors. The central grid has been guarded by Chico and his most loyal supporters, and the resources of these grids are temporarily closed to other adventurers. Only those brave and loyal partners can get Chico's rewards and rewards, while others cannot easily enter.
                </p>
                <h3>
                    4.The grid is limited, defend your position and defeat the invaders!
                </h3>
                <p>
                    In this world of the survival of the fittest, there are limited grid positions! If other warriors stake more SOL in your grid, Chico will not hesitate to take your rewards! In order to ensure that you can continue to get rewards, you must constantly increase your stake and protect your grid from invasion.
                </p>
                <h3>
                    5.Chico's adventure is full of changes: mysterious protection shields will drop from time to time!
                </h3>
                <p>
                    Chico's adventure is full of unknowns, and mysterious protection shields will drop from time to time to help you resist threats from the outside world. The duration of the protection shield varies, it may be 1 hour, 3 hours, 5 hours, or even 24 hours! Always pay attention to Chico's news and communities (X, Discord, Telegram), and seize the opportunity to fight for protection for yourself.
                </p>
            </div>
            {/* 滚动条轨道 */}
            <div className="scrollbar-track" ref={trackRef}>
                {/*滑块*/}
                <div
                    className="scrollbar-thumb"
                    ref={thumbRef}
                    style={{
                        height: `${thumbHeight}rem`,
                        top: `${scrollPosition}rem`,
                    }}
                    onMouseDown={handleThumbMouseDown} // 添加鼠标事件
                ></div>
            </div>
        </div>
    );
};

export default CustomScroll;
