import { useState, useRef, useMemo, useEffect} from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import { AntDesignOutlined,CaretLeftFilled,CaretRightFilled } from '@ant-design/icons';
import { Avatar,Button, Input, Space } from 'antd';
import './Chessboard.css';
import { BoardInfo } from '../../apis/manage'
import UserInfo from '../userinfo/UserInfo';

const ChessBoard = () => {
    const [selectedBoxes, setSelectedBoxes] = useState([]);
    const isDragging = useRef(false); // 是否处于拖动状态
    const [blockId, setBlockId] = useState(null);
    const [boxes, setBoxes] = useState(null);
    const [ws, setWs] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // 控制弹窗显示与否
    const [message, setMessage] = useState(null); // 存储弹窗信息
    const { id } = useParams();
    const navigate = useNavigate();

    const getInfo = async (blockId) => {
        const response = await BoardInfo(blockId)
        setBoxes(response.data)
    }

    useEffect(() => {
        const getBoardInfo = async () => {
            try {
                const idInt = parseInt(id)
                setBlockId(idInt);
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
        setMessage(box); 
        setShowPopup(true);
        if (showPopup) {
            setSelectedBoxes([]);
            toggleBoxSelection(box.ID);
        }  
    };

    // 关闭弹窗
    const closePopup = () => {
        setSelectedBoxes([]);
        setShowPopup(false);
    };

    // 向左
    const leftHandle = (id) => {
        console.log(id);
        let nextId = id - 1
        navigate(`/board/${nextId}`);
    }
    // 向右
    const rightHandle = (id) => {
        console.log(id);
        let nextId = id + 1
        navigate(`/board/${nextId}`);
    }

    const goHome = () => {
        navigate("/")
    }

    return (
        <div className='main'>
            <UserInfo />
            <div className="container">
                <div className="countdown-wrapper-son">
                    <CaretLeftFilled  />
                    <button onClick={()=>leftHandle(blockId)}>向左</button>
                    <div className='total'>
                        <p>总金额: <strong>${totalAmount}</strong></p>
                    </div>
                    <p>当前位置： <strong>{blockId}</strong></p>
                    <button onClick={()=>goHome}>返回主页</button>
                    <button onClick={()=>leftHandle(blockId + 1)}>向右</button>
                    <CaretRightFilled onClick={rightHandle(blockId+1)}/>
                </div>
                <div className="grid-container" onMouseUp={handleMouseUp}>
                    {boxes && boxes.length > 0 ? (
                        boxes.map((box) => (
                            <div
                                key={box.ID}
                                className={`grid-box ${selectedBoxes.includes(box.ID) ? 'selected' : ''}`}
                                onMouseDown={(event) => handleMouseDown(box.ID, event)}
                                onMouseEnter={(event) => handleMouseEnter(box.ID, event)}
                                onClick={() => handleBoxClick(box)}
                            >
                                <div>{box.price}</div>
                            </div>
                        ))
                    ) : (
                        <p>加载中...</p>
                    )}
                </div>
            </div>

            <div>
                {showPopup && (
                    <div className="popupStyle">
                        <div>
                            {/* 头像 */}
                            <Avatar
                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                icon={<AntDesignOutlined />}
                                src="/images/avatar/1.png"
                            />
                            {/* owner为空的话就展示未被占领 */}
                            {message.owner != "" ? (
                                <p>{ message.owner}</p>
                            ): (
                               <p>未被占领</p>     
                            )}
                            {/* 哪个价格高展示哪个 */}
                            {message.price > message.price_increase ? (
                            <div>
                                <Space.Compact
                                    style={{
                                    width: '100%',
                                    }}
                                >
                                    <Input defaultValue={ message.price } />
                                    <Button type="primary">Submit</Button>
                                </Space.Compact>
                                <p>{ message.price}</p>
                            </div>
                            ): (
                               <p>{ message.price_increase}</p>     
                            )}
                            
                            <button onClick={closePopup}>Close</button>
                        </div>
                    </div>
                )}
            </div>

            <button className="submit-button" onClick={handleSubmit}>提交</button>
        </div>
    );
};

export default ChessBoard;
