import  { useState } from 'react';
import {Button, Input, Modal} from 'antd';
import './Shiled.css'
import {AddShiled} from "../../apis/manage.js";
const Shiled = ({gId}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const showModal = () => {
        setOpen(true);
    };

    const addShiled = async () => {
        let param = {
            "shield_amount":value,
            "grid_id":gId,
        }
        const response = await AddShiled(param);
        if (response.code === 200||response.code === 1021) {
            setOpen(false);
        }
    }
    const handleOk = () => {
        addShiled();
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };
    return (
        <>
            <Button type="primary" onClick={showModal}>
                Shield Up!
            </Button>
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
            >
                <div className='div-style-top'>
                    <p>Select Your Shield</p>
                </div>
                <div className='shild-wenzi-style'>Shiled</div>
                <div className='div-style-bottom'>
                    <div className='div-style-bottom-left'>
                        <div className='button-left-style'>Diamond</div>
                        <svg className='button-left-image' width="132" height="132" viewBox="0 0 132 132"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <circle cx="66" cy="66" r="66" fill="url(#paint0_radial_420_336)" fillOpacity="0.12"/>
                            <circle cx="66" cy="67" r="40" fill="url(#paint1_radial_420_336)"/>
                            <path
                                d="M72.5585 54.2326L53.062 73.3361C53.062 73.3361 48.6019 77.3841 44.7995 77.3841C40.997 77.3841 40.2557 82.9728 41.6607 84.3495C43.0656 85.7262 46.617 84.5077 48.2372 84.5077C49.8574 84.5077 51.7108 84.6716 51.7108 86.4525C51.7108 88.2334 50.551 94.0681 53.6898 94.0681C56.8286 94.0681 59.9734 91.9651 59.9734 88.7255C59.9734 85.486 58.6521 81.6019 63.441 76.9036C68.2299 72.2054 78.8062 59.2589 78.8062 59.2589C78.8062 59.2589 81.2874 57.15 83.7685 57.6362C86.2497 58.1224 89.7113 57.8002 91.3674 55.6971C93.0235 53.594 92.8561 49.0599 90.0462 49.0599C87.2362 49.0599 83.7685 51.9889 83.7685 50.0265C83.7685 48.064 84.4262 41.2861 80.1275 41.2861C75.8288 41.2861 73.0248 43.3891 73.0248 46.4647C73.0248 49.5402 74.6271 52.2115 72.5585 54.2326Z"
                                fill="white" fillOpacity="0.55"/>
                            <defs>
                                <radialGradient id="paint0_radial_420_336" cx="0" cy="0" r="1"
                                                gradientUnits="userSpaceOnUse"
                                                gradientTransform="translate(66 38.5) rotate(90) scale(93.5)">
                                    <stop stopColor="#88DFD0"/>
                                    <stop offset="1" stopColor="#4A7971"/>
                                </radialGradient>
                                <radialGradient id="paint1_radial_420_336" cx="0" cy="0" r="1"
                                                gradientUnits="userSpaceOnUse"
                                                gradientTransform="translate(75.6436 49.8578) rotate(95.9188) scale(58.8846)">
                                    <stop offset="0.02" stopColor="#EDF9F7"/>
                                    <stop offset="0.23" stopColor="#B4E4DC"/>
                                    <stop offset="0.515" stopColor="#32C2A8"/>
                                    <stop offset="1" stopColor="#B4E4DC"/>
                                </radialGradient>
                            </defs>
                        </svg>
                        <div className='button-left-button'>
                            <p className='button-left-button-p'>Dinmond:</p>
                            <p style={{fontWeight: '400', color: '#986D5A', fontSize: '16px'}}>4h</p>
                        </div>
                    </div>
                    <div className='div-style-bottom-right'>
                        <div className='buttom-right-top'>
                            <p>Shield Available:</p>
                            <p className="buttom-right-top-p">20</p>
                        </div>
                        <p style={{color: "#65574A", fontSize: "12px", fontWeight: "400"}}>How many shields do you want
                            to use?</p>
                        <Input className="buttom-right-input"  placeholder="请输入内容" value={value} onChange={handleChange}></Input>
                    </div>
                </div>
                <div className="button-shiled-div-style">
                    <button className="buttom-update-shiled" onClick={()=>handleOk()}>Shiled Up!</button>
                    <button className="buttom-confirm-shiled" onClick={handleCancel}>Confirm</button>
                </div>
            </Modal>
        </>
    );
};
export default Shiled;