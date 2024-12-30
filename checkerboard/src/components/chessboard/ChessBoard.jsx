import { useState, useRef, useMemo, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { AntDesignOutlined,StopTwoTone } from '@ant-design/icons';
import {Avatar, Input, Modal, Spin} from 'antd';
import './Chessboard.css';
import { BoardInfo, BoardInfoNoLogin, SeizeGrid} from '../../apis/manage'
import {useDispatch, useSelector} from "react-redux";
import Shiled from "../shiled/Shiled.jsx";
import {setPage} from "../../store/store.js";
import ShiledCountDown from "../shiledcountdown/ShiledCountDown.jsx";

const ChessBoard = ({gId}) => {
    const [selectedBoxes, setSelectedBoxes] = useState([]);
    const [detailBoxes, setDetailBoxes] = useState([]);// 记录多选盒子的详细信息
    const multipleChoice = useRef(false);
    const [increaseValue, setIncreaseValue] = useState(10); // 用于记录多选状态下的上涨值
    const [modelValue, setModelValue] = useState(1);
    const isChoiceing = useRef(false) // 是否处于多选状态
    const isDragging = useRef(false); // 是否处于拖动状态
    const [blockId, setBlockId] = useState(null);
    const [gridId, setGridId] = useState(null);
    const [boxes, setBoxes] = useState(null);
    const [ws, setWs] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // 控制弹窗显示与否
    const [message, setMessage] = useState(""); // 存储弹窗信息
    const [value, setValue] = useState('0');
    const [open, setOpen] = useState(false);
    const [betValue, setbetValue] = useState(10);
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const page = useSelector((state) => state.page);
    const dispatch = useDispatch();

    const getBoardInfo = async () => {
        if (blockId !==null) {
            if (localStorage.getItem("token")) {
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
        setBlockId(page);
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
            multipleChoice.current = true
            const hoveredBox = boxes.find((box) => box.ID === boxId);
            setDetailBoxes((prevHovered) => {
                if (prevHovered.some((box) => box.ID === hoveredBox.ID)) {
                    // 如果已经存在，移除这个盒子
                    return prevHovered.filter((box) => box.ID !== hoveredBox.ID);
                } else {
                    // 如果不存在，添加这个盒子,并且选中不加盾的盒子
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
            multipleChoice.current = true
            isChoiceing.current=false
        }
        if (selectedBoxes.length===0) {
            setSelectedBoxes([])
            isChoiceing.current=false
            setShowPopup(false)
            multipleChoice.current = true
        }
    };

    // 提交单个格子数据
    const seizeHandle = async () => {
        var data=new Array();
        const a = {
            "transaction_amount": betValue,
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
        // 先判断用户的可用余额是否充足，不够就弹出弹框充值
        if (user.available<totalIncreaseAmount){
            // 打开弹框,充值
            setOpen(true)
            return
        }
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
            multipleChoice.current = true
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

    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setSelectedBoxes([]);
        setShowPopup(false);
        multipleChoice.current = true
        setDetailBoxes([])
        isChoiceing.current = false;
        setOpen(false);
    };

    const handleChange = (e) => {
        setIncreaseValue(e.target.value);
    };
    const betValueChange =(e)=>{
        setbetValue(e.target.value);
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
        <div>
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
                                onMouseDown={(event) => handleMouseDown(box.ID, event)}
                                onMouseEnter={(event) => handleMouseEnter(box.ID, event)}
                                onClick={() => handleBoxClick(box)}
                            >
                                {box.is_shield == 1 ?
                                    <div className='shiled-div'>
                                        <svg width="40" height="40" viewBox="0 0 137 137" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="68.39" cy="68.39" r="68.39" fill="url(#paint0_radial_450_4)"/>
                                            <path
                                                d="M69.6117 46C61.7952 51.211 51.3732 53.4443 43.5566 53.4443C43.5566 71.6829 51.3732 90.2936 69.6117 98.1101C87.8503 90.2936 95.6668 71.6829 95.6668 53.4443C87.8503 53.4443 77.4282 51.211 69.6117 46Z"
                                                fill="white" fill-opacity="0.73" stroke="#DAACC1" stroke-opacity="0.49"
                                                stroke-width="10" stroke-miterlimit="10" stroke-linecap="square"/>
                                            <defs>
                                                <radialGradient id="paint0_radial_450_4" cx="0" cy="0" r="1"
                                                                gradientUnits="userSpaceOnUse"
                                                                gradientTransform="translate(84.878 39.0812) rotate(95.9188) scale(100.678)">
                                                    <stop offset="0.02" stop-color="#F9EDF2"/>
                                                    <stop offset="0.23" stop-color="#E4B4CA"/>
                                                    <stop offset="0.515" stop-color="#C23273"/>
                                                    <stop offset="1" stop-color="#E4B4CA"/>
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    :
                                    <div
                                        className={`grid-box ${box.status == 1 ? 'have' : `${box.status == 2 ? 'preempted' : ''}`}`}
                                    >
                                        {/*加盾*/}
                                        <svg className="svg-style" width="44" height="15" viewBox="0 0 34 10"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M0 1.84219C0 1.23467 0.492487 0.742188 1.1 0.742188H34V4.24219C34 7.27975 31.5376 9.74219 28.5 9.74219H0V1.84219Z"
                                                fill={box.status == 1 ? '#4A7971' : box.status == 2 ? '#B35649' : '#6076C1'}/>
                                            <svg x="0" y="2" width="5" height="6" viewBox="0 0 4 5" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_390_20353)">
                                                    <path
                                                        d="M2.45209 1.72751L0.942007 3.17022C0.942007 3.17022 0.597205 3.47587 0.302175 3.47587C0.00714429 3.47587 -0.0496735 3.89767 0.059014 4.00165C0.167702 4.10563 0.442944 4.01382 0.57097 4.01382C0.698996 4.01382 0.839615 4.026 0.839615 4.16048C0.839615 4.29497 0.749667 4.73511 0.993277 4.73511C1.23689 4.73511 1.4796 4.57627 1.4796 4.33164C1.4796 4.08701 1.37721 3.79368 1.74824 3.4392C2.11928 3.08472 2.93841 2.1072 2.93841 2.1072C2.93841 2.1072 3.1303 1.94837 3.32234 1.98503C3.51438 2.0217 3.78302 1.99721 3.91105 1.83823C4.03908 1.67925 4.02618 1.33694 3.80866 1.33694C3.59113 1.33694 3.32234 1.55693 3.32234 1.41027C3.32234 1.26361 3.37346 0.75 3.0408 0.75C2.70814 0.75 2.49047 0.908981 2.49047 1.14129C2.49047 1.3736 2.61175 1.57469 2.45209 1.72751Z"
                                                        fill="white"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_390_20353">
                                                        <rect width="4" height="4" fill="white"
                                                              transform="translate(0 0.742188)"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <text x="5" y="8" fill="white" fontSize="6" fontFamily="Arial"
                                                  fontWeight="bold">
                                                {box.price > box.price_increase ? box.price : box.price_increase}
                                            </text>
                                        </svg>
                                        {selectedBoxes.includes(box.ID) ?
                                            <div>
                                                <svg className="selected-style" width="15" height="15"
                                                     viewBox="0 0 15 15"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="15" height="15" rx="1.25" fill="#F5E01B"/>
                                                    <path d="M4.375 7.545L6.42763 9.625L10.375 5.625" stroke="#3C342F"
                                                          strokeWidth="1.875" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                            : ''}
                                    </div>
                                }

                            </div>
                        ))
                    ) : (
                        <Spin/>
                    )}
                </div>
            </div>
            {/*是否处于多选状态*/}
            {
                (isChoiceing.current) ?
                    (
                        <div className='betch-container-right'>
                            <div>
                                <Avatar
                                    shape="square" size={150}
                                    icon={<AntDesignOutlined/>}
                                    src={images[user.avatar_id]}
                                    className='batch-avatar'
                                />
                            </div>
                            <div className='batch-number-div'>X {detailBoxes.length}</div>
                            <div className="total-comount">Total Value</div>
                            <div className='total-comount-div'>{totalAmount} SOL</div>
                            <Input className="batch-buttom-right-input" placeholder="请输入内容" value={increaseValue}
                                   onChange={handleChange}></Input>
                            <button onClick={batchHandle} className='batch-button-style'>Caputure ALL!</button>
                        </div>
                    ) :
                    (
                        <div className='container-right'>
                            <div className='container-right-internal'>
                                <div>
                                    <Avatar
                                        shape="square" size={150}
                                        icon={<AntDesignOutlined/>}
                                        src={images[message.avatar_id - 1]}
                                        className='batch-avatar'
                                    />
                                </div>
                                {
                                    message.user_id === "" ?
                                        <div className="is-owner" style={{color: '#B35649'}}>Under Takenn!</div> :
                                        (
                                            user.user_id === message.user_id ? <div
                                                    className="is-owner" style={{color: '#2FF519'}}>Occupied!</div> :
                                                <div className="is-owner" style={{color: '#B35649'}}>Not Owned!</div>
                                        )
                                }
                                {
                                    message.user_id === "" ? '' : <div className='owner-div'>Owner:&nbsp;&nbsp;
                                        <span>
                                            {message.owner}
                                        </span>
                                    </div>
                                }
                                {
                                    message.user_id === "" ?
                                        (<div className='value-div-noowner'>
                                            <div className='value-amount-font'>Current Value:</div>
                                            <div className='amount-div-value' style={{color: '#2FF519'}}>
                                                {message.price > message.price_increase ? message.price : message.price_increase} SOL
                                            </div>
                                        </div>) :
                                        (
                                            message.user_id === user.user_id ?
                                                <div className='value-div-owner'>Value Stakedown</div> :
                                                <div className='value-div-owner'>
                                                    <div className='value-amount-font'>Current Value:</div>
                                                    <div className='amount-div-value' style={{color: '#2FF519'}}>
                                                    {message.price > message.price_increase ? message.price : message.price_increase} SOL
                                                </div>
                                            </div>
                                        )
                                }
                                {/*判断是否是当前用户的*/}
                                {
                                    user.user_id === "" ?
                                        (
                                            <div className='div-btn-style'>
                                                <Input className="batch-buttom-right-input" placeholder="请输入内容"
                                                       value={betValue}
                                                       onChange={betValueChange}></Input>
                                                <button onClick={seizeHandle} className='button-style'>Reoccupy</button>
                                            </div>
                                        ):
                                        (user.user_id === message.user_id ?
                                            <div className='div-btn-style'>
                                                <button className='button-style' style={{marginTop: '50px'}}
                                                        onClick={seizeHandle}>Buy More
                                                </button>
                                                <Shiled gId={message.ID}/>
                                            </div>
                                        :
                                        //     需要在判断当前格子是否有盾，有盾就不展示输入框及按钮，当前处于保护状态
                                                (message.is_shield === 1 ? '' :
                                                        <div className='div-btn-style'>
                                                            <Input className="batch-buttom-right-input"
                                                                   placeholder="请输入内容" value={betValue}
                                                                   onChange={betValueChange}></Input>
                                                            <button onClick={seizeHandle}
                                                                    className='button-style'>Occupy
                                                            </button>
                                                        </div>
                                                ))
                                }
                            </div>
                        </div>
                    )
            }
            {/*当前格子是否有盾*/}



            {/*余额不足时展示的模态框*/}
            <Modal
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                closable={false}
                centered
                width={849} // 设置宽度
                className='model-style'
                style={{height: '534px', backgroundColor: '#000000'}} // 设置高度
                destroyOnClose={true}
            >
                <div className='div-style-top'>
                    <p>Occupy All!</p>
                </div>
                <div className='shild-wenzi-style-chess'>Total Bones Cost</div>
                <div className='chess-div-style-bottom'>
                    <div className='chess-div-style-bottom-left'>
                        <svg className="svg-chess-choice" width="68" height="77" viewBox="0 0 68 77" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_390_16466)">
                                <path
                                    d="M31.6397 75.9008C48.9951 75.9008 63.0645 58.9577 63.0645 38.0573C63.0645 17.157 48.9951 0.213867 31.6397 0.213867C14.2842 0.213867 0.214844 17.157 0.214844 38.0573C0.214844 58.9577 14.2842 75.9008 31.6397 75.9008Z"
                                    fill="url(#paint0_linear_390_16466)" stroke="#231815" strokeWidth="0.428481"
                                    strokeMiterlimit="10"/>
                                <path
                                    d="M30.1328 75.9051C47.4906 75.9051 61.5576 58.9629 61.5576 38.0616C61.5576 17.1602 47.4906 0.213867 30.1328 0.213867H36.3629C53.7207 0.213867 67.7878 17.1602 67.7878 38.0616C67.7878 58.9629 53.7207 75.9051 36.3629 75.9051H30.1328Z"
                                    fill="#B7A60C" stroke="#231815" strokeWidth="0.428481" strokeMiterlimit="10"/>
                                <path d="M42.6797 3.43262H48.6656" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M47.7578 6.58496H53.6966" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M51.0234 9.7334H57.0993" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M53.7852 12.8896H59.8182" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M55.8242 16.042H61.8572" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M57.4609 19.1904H63.6268" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M58.6836 22.3428H64.8494" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M59.8086 25.499H65.9402" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M60.5234 28.6475H66.9121" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M61.2383 31.7998H67.3741" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M61.6445 34.9561H67.7847" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M61.5586 38.1084H67.7887" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M61.4414 41.2568H67.7872" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M61.1357 44.4121H67.3145" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M60.5234 47.5654H66.7407" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M59.8086 50.7139H66.0473" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M58.6836 53.8662H64.8366" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M57.2539 57.0225H63.5697" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M55.6172 60.1709H61.8987" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M53.4844 63.3232H59.8259" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M51.0039 66.4795H57.114" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M47.543 69.6279H53.7131" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path d="M42.6797 72.7803H48.6956" stroke="#231815" strokeWidth="0.428481"
                                      strokeMiterlimit="10"/>
                                <path
                                    d="M34.7346 29.3942L20.7618 43.367C20.7618 43.367 17.5653 46.3278 14.8402 46.3278C12.1151 46.3278 11.5837 50.4155 12.5907 51.4225C13.5976 52.4294 16.1428 51.5382 17.304 51.5382C18.4651 51.5382 19.7934 51.6581 19.7934 52.9607C19.7934 54.2632 18.9622 58.5309 21.2117 58.5309C23.4612 58.5309 25.7151 56.9927 25.7151 54.6232C25.7151 52.2537 24.7681 49.4128 28.2002 45.9764C31.6324 42.54 39.2122 33.0706 39.2122 33.0706C39.2122 33.0706 40.9904 31.528 42.7686 31.8837C44.5468 32.2393 47.0277 32.0036 48.2146 30.4654C49.4015 28.9271 49.2815 25.6108 47.2677 25.6108C45.2538 25.6108 42.7686 27.7531 42.7686 26.3177C42.7686 24.8823 43.2399 19.9248 40.1591 19.9248C37.0784 19.9248 35.0688 21.463 35.0688 23.7125C35.0688 25.962 36.2171 27.9159 34.7346 29.3942Z"
                                    fill="white" stroke="#231815" strokeWidth="1.28544" strokeMiterlimit="10"/>
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_390_16466" x1="21" y1="30" x2="54.5" y2="76"
                                                gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FFE711"/>
                                    <stop offset="1" stopColor="#998B0A"/>
                                </linearGradient>
                                <clipPath id="clip0_390_16466">
                                    <rect width="68" height="76.1197" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <div className='chess-button-left-button'>
                            <p className='chess-button-left-button-p'>{totalAmount}</p>
                            <p style={{fontWeight: '860', fontSize: '20px',marginTop:"40px",color:'#F5E01B'}}>SOL</p>
                        </div>
                    </div>
                    <div className='div-style-bottom-right'>
                        <div className='buttom-right-top'>
                            <div className='buttom-right-top-div'>
                                <p>Bones Available:</p>
                                <p className="buttom-right-top-p">20 SOL</p>
                            </div>
                            <div className='buttom-right-top-div'>
                                <p>Extra Bones Needed:</p>
                                <p className="buttom-right-top-p">{totalIncreaseAmount} SOL</p>
                            </div>
                        </div>
                        <Input className="buttom-right-input" placeholder="请输入内容" value={modelValue}
                               onChange={handleChange}></Input>
                    </div>
                </div>
                <div className="button-shiled-div-style">
                    <button className="buttom-update-shiled" onClick={() => handleOk}>Shiled Up!</button>
                    <button className="buttom-confirm-shiled" onClick={handleCancel}>Confirm</button>
                </div>
            </Modal>
        </div>
    {message.is_shield === 1 ?
        <ShiledCountDown durationTime={message.end_shield_time}/> :
        ''
    }
    </div>
    );
};

export default ChessBoard;
