import { useState, useEffect } from "react";
import { AntDesignOutlined,EditTwoTone } from '@ant-design/icons';
import {  Modal,Avatar } from 'antd';
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
                <h1>CHIHUAHUA</h1>
                <div className="info-row">
                    <Avatar
                        size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
                        icon={<AntDesignOutlined/>}
                        src={images[image]}
                    />
                    <div className="icon-container">
                        <EditTwoTone className="edit-icon" onClick={showModal}/>
                    </div>
                </div>
                <div>{user.user_name}</div>
                <div>{t('total')}：{user.total}</div>
                <div>冻结数：{user.frozen}</div>
                <div>可用数：{user.available}</div>
                <button>退款</button>
                <div>
                    <TransactionRecord/>
                    <a>Dmail</a>
                </div>
                <Modal
                    open={open}
                    cancelText="取消"
                    okText="修改"
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                    maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
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
                        <button className="buttom-update" onClick={handleOk} >Update</button>
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

    );
};

export default UserInfo;



