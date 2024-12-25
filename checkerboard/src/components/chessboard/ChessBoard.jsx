import { useState, useRef, useMemo, useEffect} from 'react';
import { useNavigate, useSearchParams} from 'react-router-dom';
import { AntDesignOutlined,StopTwoTone } from '@ant-design/icons';
import { Avatar,Spin } from 'antd';
import './Chessboard.css';
import {BoardInfo, BoardInfoNoLogin, SeizeGrid} from '../../apis/manage'
import {useDispatch, useSelector} from "react-redux";
import Shiled from "../shiled/Shiled.jsx";
import {setPage} from "../../store/store.js";

const ChessBoard = ({bId,gId}) => {
    const [selectedBoxes, setSelectedBoxes] = useState([]);
    const [detailBoxes, setDetailBoxes] = useState([]);// 记录多选盒子的详细信息
    const [multipleChoice, setMultipleChoice] = useState(false);
    const [increaseValue, setIncreaseValue] = useState(10); // 用于记录多选状态下的上涨值
    const isChoiceing = useRef(false) // 是否处于多选状态
    const isDragging = useRef(false); // 是否处于拖动状态
    const [blockId, setBlockId] = useState(null);
    const [gridId, setGridId] = useState(null);
    const [boxes, setBoxes] = useState(null);
    const [ws, setWs] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // 控制弹窗显示与否
    const [message, setMessage] = useState(""); // 存储弹窗信息
    const [value, setValue] = useState('0');
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const page = useSelector((state) => state.page);
    const dispatch = useDispatch();

    const getBoardInfo = async () => {
        if (blockId !==null) {
            if (localStorage.getItem("token")) {
                console.log("进来了")
                const response = await BoardInfo(page);
                setBoxes(response.data.boards);
                setMessage(response.data.boards[gridId])
            }else{
                const response = await BoardInfoNoLogin(page);
                setBoxes(response.data.boards);
                setMessage(response.data.boards[gridId])
            }
        }
    }
    useEffect(()=>{
        setBlockId(bId);
        setGridId(gId);
        // 如果page发生变化，就重新渲染组件数据
        getBoardInfo();

    },[page,blockId])

    useEffect(() => {
        if (blockId && localStorage.getItem("token")) {
            const socket = new WebSocket(`ws://localhost:9990/api/ws/handle?blockId=${blockId}&token=${localStorage.getItem('token')}`);
            setWs(socket);
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
                getBoardInfo(blockId)
            };
            // 在组件卸载时关闭 WebSocket 连接
            return () => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            };
        }
    }, [blockId,token]);

    // 计算选中盒子的总金额
    const totalAmount = useMemo(() => {
        return selectedBoxes.reduce((sum, boxId) => {
            const box = boxes.find((b) => b.ID === boxId);
            return sum + (box ? (box.price>box.price_increase ? box.price : box.price_increase) : 0);
        }, 0);
    }, [selectedBoxes, boxes]);

    // 计算加价后的金额
    const totalIncreaseAmount = useMemo(() =>{
        return totalAmount+increaseValue*detailBoxes.length;
    })

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
        setDetailBoxes([])
        setSelectedBoxes([])
        const hoveredBox = boxes.find((box) => box.ID === boxId);
        if (hoveredBox) {
            if (hoveredBox.is_shield !== 1||isChoiceing.current === false){
                toggleBoxSelection(boxId);
                setDetailBoxes([hoveredBox]);
            }
        }
    };

    // 鼠标进入盒子时，如果该盒子已经选中，则取消选中
    const handleMouseEnter = (boxId, event) => {
        if (isDragging.current) {
            // 在单选状态下进行多选,就去掉单选框
            setShowPopup(false)
            isChoiceing.current = true
            setMultipleChoice(true)
            const hoveredBox = boxes.find((box) => box.ID === boxId);
            setDetailBoxes((prevHovered) => {
                if (prevHovered.some((box) => box.ID === hoveredBox.ID)) {
                    // 如果已经存在，移除这个盒子
                    return prevHovered.filter((box) => box.ID !== hoveredBox.ID);
                } else {
                    // 如果不存在，添加这个盒子
                    if (hoveredBox.is_shield != 1) {
                        return [...prevHovered, hoveredBox];
                    }
                    return prevHovered;
                }
            });
            setSelectedBoxes((prevSelected) => {
                if (prevSelected.includes(boxId)) {
                    // 如果该盒子已选中，取消选中
                    return prevSelected.filter((id) => id !== boxId);
                } else {
                    // 否则选中该盒子
                    if (hoveredBox.is_shield != 1) {
                        return [...prevSelected, boxId];
                    }
                    return prevSelected;

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

    // 选择一个格子并显示其信息
    const handleBoxClick = (box) => {
        if (selectedBoxes.length>1&&isChoiceing.current){
            return
        }

        box.price>box.price_increase ?(setValue(box.price)):(setValue(box.price_increase))
        setMessage(box); 
        setShowPopup(true);
        if (showPopup) {
            setSelectedBoxes([]);
            toggleBoxSelection(box.ID);
        }
        if (selectedBoxes.length ===1){
            setMultipleChoice(false)
            isChoiceing.current=false
        }
        if (selectedBoxes.length===0) {
            setSelectedBoxes([])
            isChoiceing.current=false
            setShowPopup(false)
            setMultipleChoice(false)
        }
    };

    // 关闭弹窗
    const closePopup = () => {
        setSelectedBoxes([]);
        setShowPopup(false);
        setMultipleChoice(false)
        setDetailBoxes([])
        isChoiceing.current = false;
    };

    // 提交单个格子数据
    const seizeHandle = async () => {
        var data=new Array();
        const a = {
            "transaction_amount": value,
            "grid_id":message.ID,
            "block_id": message.block_id
        }
        data.push(a)
        const response = await SeizeGrid(data)
        if (response.code === 200) {
            setSelectedBoxes([]);
            setShowPopup(false);
        }
    }
    // 批量提交
    const batchHandle = async () => {
        if (increaseValue<10) {
            return
        }
        var data=new Array();
        detailBoxes.forEach((box) => {
            const temp  = {
                "transaction_amount": box.price+increaseValue,
                "grid_id":box.ID,
                "block_id": box.block_id
            }
            if (box.price <box.price_increase){
                temp.transaction_amount = box.price_increase+increaseValue;
            }
            data.push(temp);
        });
        const response = await SeizeGrid(data)
        if (response.code === 200) {
            setSelectedBoxes([]);
            setMultipleChoice(false)
            setDetailBoxes([])
            isChoiceing.current = false;
        }
    }

    // 向左
    const leftHandle = (id) => {
        let nextId = id - 1
        dispatch(setPage(nextId))
    }
    // 向右
    const rightHandle = (id) => {
        let nextId = id + 1
        dispatch(setPage(nextId))
    }

    const goHome = () => {
        navigate("/")
    }

    const images = [
        '/images/avatar/1.png',
        '/images/avatar/2.png',
        '/images/avatar/3.png',
        '/images/avatar/4.png',
        '/images/avatar/5.png',
        '/images/avatar/6.png',
        '/images/avatar/7.png',
        '/images/avatar/8.png',
    ];


    return (
        <div className="container">
            <div className='container-left'>
                <div className="countdown-wrapper-son">
                    <button onClick={() => leftHandle(blockId)}>向左</button>
                    <div>BarkingCanyon</div>
                    <p>当前位置： <strong>{page}</strong></p>
                    <button onClick={goHome}>返回主页</button>
                    <button onClick={() => rightHandle(blockId)}>向右</button>
                </div>
                <div className="grid-container" onMouseUp={handleMouseUp}>
                    {boxes && boxes.length > 0 ? (
                        boxes.map((box) => (
                            <div
                                key={box.ID}
                                className={`grid-box ${selectedBoxes.includes(box.ID) ? 'selected' : ''} ${box.status == 1 ? 'have' : `${box.status == 2 ? 'preempted' : ''}`}`}
                                onMouseDown={(event) => handleMouseDown(box.ID, event)}
                                onMouseEnter={(event) => handleMouseEnter(box.ID, event)}
                                onClick={() => handleBoxClick(box)}
                            >
                                {box.is_shield == 1 ? <StopTwoTone/> : ''}
                                <div>{box.price > box.price_increase ? box.price : box.price_increase}</div>
                            </div>
                        ))
                    ) : (
                        <Spin/>
                    )}
                </div>
            </div>
            <div className='container-right'>
                <div>
                    <Avatar
                        shape="square" size={130}
                        icon={<AntDesignOutlined/>}
                        src={images[user.avatar_id]}
                    />
                </div>
                {
                    message.user_id === "" ? <p style={{color: 'red'}}>Under Takenn!</p>:
                        (
                            user.user_id === message.user_id ? <p style={{color: 'green'}}>Occupied!</p> :
                                <p style={{color: 'red'}}>Not Owned!</p>
                        )
                }
                {
                    message.user_id === "" ? '' : <p>Owner: {message.owner}</p>

                }

                {
                    message.user_id === user.user_id ? <p>Value Stakedown</p> :
                        <div>
                            <p>Current Value:</p>
                            <p style={{color: 'green'}}>
                                {message.price>message.price_increase ? message.price:message.price_increase}
                            </p>
                        </div>
                }

                {/*判断是否是当前用户的*/}
                {
                    user.user_id === message.user_id ?
                        <div>
                            <button className='button-style'>Buy More</button>
                            <Shiled gId={message.ID}/>
                        </div>
                        :
                        <div>
                            <button className='button-style'>Buy More</button>
                            <Shiled gId={message.ID}/>
                        </div>
            }
        </div>
    </div>
    );
};

export default ChessBoard;
