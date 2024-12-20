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
                <UserRecordTable></UserRecordTable>
            </Modal>
        </>
    );
};

export default TransactionRecord;
