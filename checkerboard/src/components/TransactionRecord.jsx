import { useState } from 'react';
import { Button, Modal } from 'antd';
import UserRecordTable from './table/UserRecordTable'

const TransactionRecord = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const showLoading = () => {
        setOpen(true);
        setLoading(true);
        setData(null);
    };

    const closeModal = () => {
        setOpen(false);
    }

    return (
        <>
            <Button type="primary" onClick={showLoading}>
                个人战报
            </Button>
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                destroyOnClose={true}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                className='user-info-model'
                width="auto"
                height="auto"
                footer={null}
                centered
            >
                <div onClick={closeModal} className='close-btn'>
                    <svg width="30" height="30" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.70703 1.29297L17.707 16.8892" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M17.707 1.69678L1.7071 17.293" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>

                </div>
                <UserRecordTable />
            </Modal>
        </>
    );
};

export default TransactionRecord;
