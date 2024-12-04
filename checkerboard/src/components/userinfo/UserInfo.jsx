import { useState, useEffect } from "react";
import './UserInfo.css'
import {UserMessage}  from '../../apis/manage';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState({
        username: "pater",
        total: 10000,
        frozen: 5000,
        available: 5000,
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            const response = await UserMessage()
            setUserInfo(response.data)
            console.log(response.data)
        };
        fetchUserInfo();
    }, []); 

    return (
        <div className="user-info">
            <div className="info-row">
                <p>{ userInfo.user_name}</p>
            </div>
            <div className="info-row">
                <p>总数：{userInfo.total}</p>
                <p>冻结数：{userInfo.freeze}</p>
                <p>可用数：{userInfo.available}</p>
            </div>
            <button>充值</button>
        </div>
    );
};



export default UserInfo;
