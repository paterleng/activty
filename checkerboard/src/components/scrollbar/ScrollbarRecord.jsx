import  { useRef, useState, useEffect } from "react";
import "./Scrollbar.css";
import {Record} from "../../apis/manage.js";

const RecordScrollbar = ({data}) => {
    const [scrollPosition, setScrollPosition] = useState(0); // 滚动条位置
    const [thumbHeight, setThumbHeight] = useState(0); // 滑块高度
    const contentRef = useRef(null); // 内容容器引用
    const trackRef = useRef(null); // 滚动条轨道引用
    const thumbRef = useRef(null); // 滑块引用
    const isDragging = useRef(false); // 是否在拖动滑块
    const startY = useRef(0); // 滑块拖动的起始位置
    const startScrollTop = useRef(0); // 内容滚动的初始位置
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const response = await Record();
        setData(response.data.records);
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
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
    const getTime = (timestr)=>{
        const date = new Date(timestr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return year + ':' + month + ':' + day + ':' + hours+':' + minutes+':' + seconds;
    }

    return (
        <div className="custom-scroll-container">
            {/* 内容区域 */}
            <div
                className="content"
                ref={contentRef}
                onScroll={handleContentScroll}
            >
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="time-style">{getTime(item.CreatedAt)}</div>
                        <span >
                        You Occupied {item.owner} sacred food pit with {item.transaction_amount} SOL! All hail the God O'Dogs!
                      </span>
                    </div>
                ))}
            </div>
            {/* 滚动条轨道 */}
            <div className="scrollbar-track" ref={trackRef}>
                {/*滑块*/}
                <div
                    className="scrollbar-thumb"
                    ref={thumbRef}
                    style={{
                        height: `${thumbHeight}px`,
                        top: `${scrollPosition}px`,
                    }}
                    onMouseDown={handleThumbMouseDown} // 添加鼠标事件
                ></div>
            </div>
        </div>
    );
};

export default RecordScrollbar;
