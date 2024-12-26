import { useState, useEffect } from "react";
import { AntDesignOutlined,EditTwoTone } from '@ant-design/icons';
import {Modal, Avatar, message, Switch} from 'antd';
import { UserMessage,UpdateUserInfo } from '../../apis/manage';
import { useTranslation } from 'react-i18next';
import TransactionRecord from "../TransactionRecord";
import './UserInfo.css'
import ConnectWallet from "../web3wallet/Wallet.jsx";
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from "../../store/store.js";

const UserInfo = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [avatar, setAvatar] = useState(0)
    const [selectedIndex, setSelectedIndex] = useState(null); // 用于跟踪选中的头像索引
    const [image, setImage] = useState(0); // 用于控制头像使用哪一个
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);

    const [userInfo, setUserInfo] = useState({
        user_name: "pater",
        total: 0,
        frozen: 0,
        available: 0,
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            // 当用户登录的时候才会调用
            if (localStorage.getItem("token")) {
                const response = await UserMessage()
                setUserInfo(response.data)
                console.log(response.data);
                dispatch(setUser(response.data))
                setImage(response.data.avatar_id-1)
            }
        };
        fetchUserInfo();
    }, [token,image,dispatch]);
  
    const showModal = () => {
        setOpen(true);
    };
    
    const handleOk = async () => {
        setConfirmLoading(true);
        // 调用修改用户信息接口
        const data = {
            "user_name": userInfo.user_name,
            "avatar_id":avatar
        }
        const response = await UpdateUserInfo(data)
        if (response.code == 200) {
            setOpen(false);
            setConfirmLoading(false);
            setImage(avatar)
            setSelectedIndex(null);
        } else {
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedIndex(null);
        setOpen(false);
    };

    const divClickHandle = (index) => {
        // 设置用户头像记录，在点击提交时修改数据提交上去  
        setAvatar(index)
        setSelectedIndex(index-1)
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
        <div className="user-info">
            <div className={`user-info-internal ${localStorage.getItem("token") ? '' : ''}`}>
                <div className="info-row">
                    <Avatar
                        sx={{
                            borderRadius: '12px',
                        }}
                        style={{marginLeft: "30px"}}
                        shape="square" size={80}
                        icon={<AntDesignOutlined/>}
                        src={images[image]}
                    />
                    <div className="icon-container">
                        <svg className="edit-icon" onClick={showModal} width="24" height="24" viewBox="0 0 24 24"
                             fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="#4A7971"/>
                            <g clipPath="url(#clip0_0_1)">
                                <path
                                    d="M12.0003 13.3334C12.7367 13.3334 13.3337 12.7365 13.3337 12.0001C13.3337 11.2637 12.7367 10.6667 12.0003 10.6667C11.2639 10.6667 10.667 11.2637 10.667 12.0001C10.667 12.7365 11.2639 13.3334 12.0003 13.3334Z"
                                    fill="#F6F5F4"/>
                                <path
                                    d="M17.253 11.7835L15.253 9.45014C15.2086 9.39861 15.1496 9.36187 15.0838 9.34484C15.018 9.32782 14.9485 9.33134 14.8847 9.35491C14.821 9.37849 14.7659 9.42101 14.727 9.47676C14.6881 9.53251 14.6671 9.59882 14.667 9.66681V14.3335C14.667 14.4016 14.6879 14.4681 14.7269 14.524C14.7659 14.58 14.821 14.6226 14.885 14.6461C14.9488 14.6696 15.0183 14.6729 15.084 14.6558C15.1498 14.6386 15.2088 14.6018 15.253 14.5501L17.253 12.2168C17.3046 12.1564 17.333 12.0796 17.333 12.0001C17.333 11.9207 17.3046 11.8439 17.253 11.7835Z"
                                    fill="#F6F5F4"/>
                                <path
                                    d="M9.11599 9.35417C9.05218 9.33074 8.98273 9.32738 8.91696 9.34453C8.85118 9.36169 8.79222 9.39855 8.74799 9.45017L6.74799 11.7835C6.69635 11.8439 6.66797 11.9207 6.66797 12.0002C6.66797 12.0796 6.69635 12.1565 6.74799 12.2168L8.74799 14.5502C8.79234 14.6017 8.85138 14.6384 8.91721 14.6555C8.98303 14.6725 9.05249 14.669 9.11626 14.6454C9.18003 14.6218 9.23506 14.5793 9.27398 14.5236C9.3129 14.4678 9.33384 14.4015 9.33399 14.3335V9.66683C9.33397 9.59868 9.31307 9.53217 9.27409 9.47627C9.23511 9.42036 9.17993 9.37775 9.11599 9.35417Z"
                                    fill="#F6F5F4"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_0_1">
                                    <rect width="10.6667" height="10.6667" fill="white"
                                          transform="translate(6.66699 6.66675)"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h3 style={{marginLeft: '30px'}}>{user.user_name}</h3>
                </div>
                <div className='line-style'></div>
                <div className='line-under-div'>
                    <div className="data-style">
                        <div className='sol-avaliable'>SOL Available</div>
                        <div className='sol-avaliable-amount' style={{color: "#F5E01B"}}>{user.available}</div>
                    </div>
                    <div style={{marginTop: '30px'}}>{message.user_id}
                        <button className='user-info-btn'>Withdraw</button>
                        <button className='user-info-btn' style={{marginLeft: '10px'}}>Top Up</button>
                    </div>
                    <div style={{marginTop: '50px'}}>
                        <div className="data-style-middle">
                            <div className='data-style-middle-font'>Bowls Occupied:</div>
                            <div className='data-style-middle-amount'>18</div>
                        </div>
                        <div className="data-style-middle">
                            <div className='data-style-middle-font'>Value Staked:</div>
                            <div className='data-style-middle-amount'>10.12</div>
                        </div>
                        <div className="data-style-middle">
                            <div className='data-style-middle-font'>Bones Secured:</div>
                            <div className='data-style-middle-svg'>
                                <svg width="17" height="20" viewBox="0 0 17 20" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_398_1574)">
                                        <path
                                            d="M7.90992 18.9754C12.2488 18.9754 15.7661 14.7397 15.7661 9.51458C15.7661 4.28949 12.2488 0.0537109 7.90992 0.0537109C3.57105 0.0537109 0.0537109 4.28949 0.0537109 9.51458C0.0537109 14.7397 3.57105 18.9754 7.90992 18.9754Z"
                                            fill="#FFE711" stroke="#231815" stroke-width="0.10712"
                                            stroke-miterlimit="10"/>
                                        <path
                                            d="M7.5332 18.9765C11.8726 18.9765 15.3894 14.741 15.3894 9.51563C15.3894 4.2903 11.8726 0.0537109 7.5332 0.0537109H9.09073C13.4302 0.0537109 16.9469 4.2903 16.9469 9.51563C16.9469 14.741 13.4302 18.9765 9.09073 18.9765H7.5332Z"
                                            fill="#B7A60C" stroke="#231815" stroke-width="0.10712"
                                            stroke-miterlimit="10"/>
                                        <path d="M10.6699 0.858398H12.1664" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M11.9395 1.64648H13.4241" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M12.7559 2.43359H14.2748" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M13.4463 3.22266H14.9545" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M13.9561 4.01074H15.4643" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M14.3652 4.79785H15.9067" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M14.6709 5.58594H16.2124" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M14.9521 6.375H16.485" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M15.1309 7.16211H16.728" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M15.3096 7.9502H16.8435" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M15.4111 8.73926H16.9462" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M15.3896 9.52734H16.9472" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M15.3604 10.3145H16.9468" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M15.2842 11.1035H16.8289" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M15.1309 11.8916H16.6852" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M14.9521 12.6787H16.5118" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M14.6709 13.4668H16.2091" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M14.3135 14.2559H15.8924" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M13.9043 15.043H15.4747" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M13.3711 15.8311H14.9565" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M12.751 16.6201H14.2785" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M11.8857 17.4072H13.4283" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path d="M10.6699 18.1953H12.1739" stroke="#231815" stroke-width="0.10712"
                                              stroke-miterlimit="10"/>
                                        <path
                                            d="M8.68365 7.34879L5.19045 10.842C5.19045 10.842 4.39133 11.5822 3.71005 11.5822C3.02876 11.5822 2.89593 12.6041 3.14767 12.8559C3.3994 13.1076 4.03569 12.8848 4.32599 12.8848C4.61629 12.8848 4.94836 12.9148 4.94836 13.2404C4.94836 13.5661 4.74055 14.633 5.30293 14.633C5.86531 14.633 6.42876 14.2484 6.42876 13.656C6.42876 13.0637 6.19203 12.3534 7.05006 11.4943C7.9081 10.6352 9.80306 8.26789 9.80306 8.26789C9.80306 8.26789 10.2476 7.88226 10.6922 7.97117C11.1367 8.06008 11.7569 8.00115 12.0536 7.61659C12.3504 7.23203 12.3204 6.40293 11.8169 6.40293C11.3135 6.40293 10.6922 6.93853 10.6922 6.57967C10.6922 6.22082 10.81 4.98145 10.0398 4.98145C9.26959 4.98145 8.7672 5.36599 8.7672 5.92837C8.7672 6.49075 9.05428 6.97922 8.68365 7.34879Z"
                                            fill="white" stroke="#231815" stroke-width="0.321361"
                                            stroke-miterlimit="10"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_398_1574">
                                            <rect width="17" height="19.0299" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <div className='data-style-middle-amount' style={{marginLeft: '5px'}}>18</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='line-style-under'></div>
                <div className='line-under-button-div'>
                    <div className='user-info-botton-div'>
                        <div>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="6" cy="6" r="6" fill="#65574A"/>
                                <circle cx="6" cy="6" r="2" fill="#191919"/>
                            </svg>
                        </div>
                        <div className='user-info-botton-div-font'>Shield Left</div>
                        <div className='user-info-botton-div-amount'>10</div>
                    </div>
                    <div className='user-info-botton-div'>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_398_1857)">
                                    <path
                                        d="M3.75284 6.41683L5.33309 3.78308C5.49876 3.50716 5.85751 3.41733 6.13343 3.58358C6.24251 3.6495 6.32767 3.74866 6.37492 3.86708L8.27134 8.60841L9.41642 6.69975C9.52201 6.52416 9.71159 6.41683 9.91634 6.41683H13.4163V2.3335C13.4163 1.36691 12.6329 0.583496 11.6663 0.583496H2.33301C1.36642 0.583496 0.583008 1.36691 0.583008 2.3335V6.41683H3.75284Z"
                                        fill="#65574A"/>
                                    <path
                                        d="M10.2465 7.58367L8.66626 10.2174C8.56068 10.393 8.37109 10.5003 8.16634 10.5003H8.11968C7.89859 10.4828 7.70668 10.3411 7.62442 10.1352L5.72801 5.39209L4.58292 7.30076C4.47734 7.47634 4.28776 7.58367 4.08301 7.58367H0.583008V11.667C0.583008 12.6336 1.36642 13.417 2.33301 13.417H11.6663C12.6329 13.417 13.4163 12.6336 13.4163 11.667V7.58367H10.2465Z"
                                        fill="#65574A"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_398_1857">
                                        <rect width="14" height="14" fill="white"/>
                                    </clipPath>
                                </defs>
                        </svg>
                        <div className='user-info-botton-div-font'>
                            <TransactionRecord />
                        </div>

                    </div>
                    <div className='user-info-botton-div'>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.7031 5.20466C13.7022 5.19883 13.7022 5.19329 13.7011 5.18745C13.6938 5.1542 13.6801 5.12329 13.662 5.095C13.6602 5.09208 13.66 5.08858 13.6582 5.08566C13.6562 5.08246 13.6527 5.081 13.6503 5.07808C13.6311 5.05212 13.6092 5.02791 13.5815 5.00925L13.5757 5.00516L13.5751 5.00487L7.16453 0.634246C7.06537 0.566579 6.93499 0.566579 6.83583 0.634246L0.426159 5.00458C0.426159 5.00458 0.425284 5.00516 0.424701 5.00545L0.419159 5.00925C0.391742 5.02791 0.369576 5.05212 0.350326 5.07808C0.347992 5.08129 0.344492 5.08275 0.342451 5.08595C0.340409 5.08887 0.340409 5.09237 0.338659 5.09529C0.320576 5.12387 0.306867 5.1545 0.299576 5.18775C0.298409 5.19358 0.298409 5.19912 0.297534 5.20466C0.295201 5.21983 0.291992 5.2347 0.291992 5.25016V11.9585C0.291992 12.7626 0.9462 13.4168 1.75033 13.4168H12.2503C13.0545 13.4168 13.7087 12.7626 13.7087 11.9585V5.25016C13.7087 5.2347 13.7055 5.21983 13.7031 5.20466ZM7.00033 1.22808L12.8993 5.25016L7.00033 9.27225L1.10137 5.25016L7.00033 1.22808Z"
                                fill="#65574A"/>
                        </svg>
                        <div className='user-info-botton-div-font'>Email Alert</div>
                        <Switch
                            className="switch-style"
                            size="small"
                            defaultChecked />
                    </div>
                    <div className='email-address-style'>Please link your email address</div>

                    <Modal
                        open={open}
                        cancelText="取消"
                        okText="修改"
                        onOk={handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        destroyOnClose={true}
                        maskStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
                        className='user-info-model'
                        width="auto"
                        height="auto"
                        footer={null}
                        centered
                    >
                        <div className='user-info-model-external'>
                            <div className="user-info-model-internal">
                                <div className="font-style">Change your avatar</div>
                                <div className="image-grid-container">
                                    {images.map((image, index) => (
                                        <div
                                            className={`image-box ${selectedIndex == index ? "selected" : ""}`}
                                            key={index}
                                            onClick={() => divClickHandle(index + 1)}>
                                            <img src={image} alt={`image-${index}`}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="button-div-style">
                            <button className="buttom-update" onClick={handleOk}>Update</button>
                            <button className="buttom-confirm" onClick={handleCancel}>Confirm</button>
                        </div>
                    </Modal>
                    {!localStorage.getItem("token") && (
                        <div className="overlay-box">
                            <ConnectWallet/>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default UserInfo;



