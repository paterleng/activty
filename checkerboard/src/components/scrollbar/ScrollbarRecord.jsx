import  { useRef, useState, useEffect } from "react";
import "./Scrollbar.css";
import {Record} from "../../apis/manage.js";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const RecordScrollbar = () => {
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
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();


    const fetchData = async () => {
        setLoading(true);
        const response = await Record();
        setData(response.data);
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        updateThumbHeight(); // 数据变化时更新滑块高度
    }, [data]);


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
    const getTime = (timestr) => {
        const date = new Date(timestr);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份补齐两位
        const day = date.getDate().toString().padStart(2, '0');         // 日期补齐两位
        const hours = date.getHours().toString().padStart(2, '0');      // 小时补齐两位
        const minutes = date.getMinutes().toString().padStart(2, '0');  // 分钟补齐两位
        const seconds = date.getSeconds().toString().padStart(2, '0');  // 秒数补齐两位

        return `${year}:${month}:${day}:${hours}:${minutes}:${seconds}`;
    };

    const jumpPage = (blockId,gridId)=>{
        navigate(`/board?blockId=${blockId}&gridId=${gridId}`);
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
                    <div key={index} className="record-li-div">
                        <div className="time-style">{getTime(item.CreatedAt)}</div>
                        {
                            user.user_id === item.owner ?
                                <span className="span-style">
                                    You Occupied {item.name} sacred food pit with {item.transaction_amount} SOL! All hail the God O'Dogs!
                                </span> :
                                <div className="no-owner-div-style">
                                    <span className="no-owner-span-style" style={{color: '#f51987'}}>
                                        {item.name} Occupied Your sacred food pit with {item.transaction_amount} SOL! Your deposit is available for your next digging.
                                    </span>
                                    <button onClick={() => jumpPage(item.block_id, item.ID)}
                                            className='no-owner-button-style'>Reoccupy my bow!
                                    </button>
                                </div>
                        }
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
                        height: `${thumbHeight}rem`,
                        top: `${scrollPosition}rem`,
                    }}
                    onMouseDown={handleThumbMouseDown}
                ></div>
            </div>
        </div>
    );
};

export default RecordScrollbar;
