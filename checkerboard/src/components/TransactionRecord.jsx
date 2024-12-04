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
                提交记录
            </Button>
            <Modal
                title={<p>交易记录</p>}
                footer={
                    <Button type="primary" onClick={showLoading}>
                        刷新
                    </Button>
                }
                open={open}
                onCancel={() => setOpen(false)}
                width={800}
            >  
                <UserRecordTable />
            </Modal>
        </>
    );
};

export default TransactionRecord;
