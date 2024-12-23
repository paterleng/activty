import  { useState } from 'react';
import {Button, Input, Modal} from 'antd';
import './Shiled.css'
const Shiled = () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal}>
                Shield Up!
            </Button>
            <Modal
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
                closable={false}
                centered
                width={849} // 设置宽度
                className='model-style'
                style={{ height: '534px', backgroundColor:'#292929'}} // 设置高度
            >
                <div className='div-style-top'>Select Your Shield</div>
                <div className='div-style-bottom'>
                    <div className='div-style-bottom-left'>图片</div>
                    <div className='div-style-bottom-right'>
                        <p>Shield Available:</p>
                        <p>How many shields do you want to use?</p>
                        <Input></Input>
                    </div>

                </div>

            </Modal>
        </>
    );
};
export default Shiled;