import { useState, useRef, useMemo, useEffect } from 'react';
import './Chessboard.css';
import { frontURL } from '../../config/config'
import { BoardInfo } from '../../apis/manage'

const ChessBoard = () => {
    const [blockId, setBlockId] = useState(null);
    const [boxes, setBoxes] = useState(null);
    const [ws, setWs] = useState(null);
    const [selectedBox, setSelectedBox] = useState(null); // 用来保存选中的格子信息

    const getInfo = async (blockId) => {
        const response = await BoardInfo(blockId)
        setBoxes(response.data)
    }

    useEffect(() => {
        const getBoardInfo = async () => {
            try {
                const hash = window.location.hash.substring(1);
                const parsedData = JSON.parse(decodeURIComponent(hash));
                setBlockId(parsedData);
            } catch (error) {
                console.error('Failed to parse URL hash data:', error);
            }
            if (blockId) {
                const response = await BoardInfo(blockId);
                setBoxes(response.data);
            }
        }
        getBoardInfo()

        if (blockId) {
            // 创建 WebSocket 连接
            const socket = new WebSocket(`ws://localhost:9990/api/ws/handle?blockId=${blockId}`);
            setWs(socket);

            socket.onopen = () => {
                console.log('WebSocket Connected');
            };

            socket.onmessage = (event) => {
                // 当数据发生变化时，就去请求接口，更新页面数据
                const data = JSON.parse(event.data);
                // 调用接口更新数据
                console.log("调用接口", data)
                getInfo(blockId)
            };

            socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            socket.onclose = () => {
                console.log('WebSocket Closed');
            };

            // 在组件卸载时关闭 WebSocket 连接
            return () => {
                if (socket.readyState === WebSocket.OPEN) {
                    console.log("组件卸载，链接关闭")
                    socket.close();
                }
            };
        }
    }, [blockId]);

    const goBack = () => {
        window.location.href = frontURL
    };

    const [selectedBoxes, setSelectedBoxes] = useState([]);
    const isDragging = useRef(false); // 是否处于拖动状态

    // 计算选中盒子的总金额
    const totalAmount = useMemo(() => {
        return selectedBoxes.reduce((sum, boxId) => {
            const box = boxes.find((b) => b.ID === boxId);
            return sum + (box ? box.price : 0);
        }, 0);
    }, [selectedBoxes, boxes]);

    // 切换盒子的选中状态
    const toggleBoxSelection = (boxId) => {
        setSelectedBoxes((prevSelected) =>
            prevSelected.includes(boxId)
                ? prevSelected.filter((id) => id !== boxId) // 取消选中
                : [...prevSelected, boxId] // 添加选中
        );
    };

    // 鼠标按下
    const handleMouseDown = (boxId, event) => {
        event.preventDefault();
        isDragging.current = true;
        toggleBoxSelection(boxId);
    };

    // 鼠标进入盒子时，如果该盒子已经选中，则取消选中
    const handleMouseEnter = (boxId, event) => {
        if (isDragging.current) {
            setSelectedBoxes((prevSelected) => {
                if (prevSelected.includes(boxId)) {
                    // 如果该盒子已选中，取消选中
                    return prevSelected.filter((id) => id !== boxId);
                } else {
                    // 否则选中该盒子
                    return [...prevSelected, boxId];
                }
            });
        }
        event.preventDefault();
    };

    // 鼠标抬起
    const handleMouseUp = (event) => {
        event.preventDefault();
        isDragging.current = false;
    };

    // 提交选中的数据
    const handleSubmit = () => {
        setSelectedBoxes([]);
    };

    // 选择一个格子并显示其信息
    const handleBoxClick = (box) => {
        setSelectedBox(box); // 设置当前点击的格子信息
    };

    return (
        <div className='main'>
            <div className="container">
                <div className="countdown-wrapper-son">
                    <div className='total'>
                        <p>总金额: <strong>${totalAmount}</strong></p>
                    </div>
                    <p>当前位置： <strong>{blockId}</strong></p>
                    <button onClick={goBack}>返回上一页</button>
                </div>
                <div className="grid-container" onMouseUp={handleMouseUp}>
                    {boxes && boxes.length > 0 ? (
                        boxes.map((box) => (
                            <div
                                key={box.ID}
                                className={`grid-box ${selectedBoxes.includes(box.ID) ? 'selected' : ''}`}
                                onMouseDown={(event) => handleMouseDown(box.ID, event)}
                                onMouseEnter={(event) => handleMouseEnter(box.ID, event)}
                                onClick={() => handleBoxClick(box)} // 点击格子
                            >
                                <div>{box.price}</div>
                            </div>
                        ))
                    ) : (
                        <p>加载中...</p>
                    )}
                </div>
            </div>

            {/* 显示选中格子的信息 */}
            {selectedBox && (
                <div className="box-details">
                    <h3>格子详细信息</h3>
                    <p>价格: ${selectedBox.price}</p>
                    <p>ID: {selectedBox.ID}</p>
                    {/* 添加其他详细信息 */}
                </div>
            )}

            <button className="submit-button" onClick={handleSubmit}>提交</button>
        </div>
    );
};

export default ChessBoard;
