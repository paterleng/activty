import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Record } from '../../apis/manage';

const UserRecordTable = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

    const fetchData = async (pagination) => {
    setLoading(true);  
    const response = await Record(pagination.current,pagination.pageSize);
    setData(response.data.records);
    setPagination({
        ...pagination,
        total: response.data.total,
    });
      setLoading(false)
  };

  useEffect(() => {
    fetchData(pagination);
  }, []);  

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchData(newPagination);  
  };

  // 表格列配置
  const columns = [
    {
      title: '用户',
      dataIndex: 'name',
    },
    {
      title: '原来值',
      dataIndex: 'old_amount',
    },
    {
      title: '交易价格',
      dataIndex: 'transaction_amount',
    },
    {
      title: '交易时间',
      dataIndex: 'CreatedAt',
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime(),
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (

      <div className='user-info-model-external'>
        <div className="user-info-model-internal">
          <div>
            {data.map((item, index) => (
                <div key={index}>
                  <div>
                    <span>{item.CreatedAt}</span>
                    <span>
                    You Occupied {item.owner} sacred food pit with {item.transaction_amount} SOL! All hail the God O'Dogs!
                  </span>

                  </div>
                </div>
            ))}
          </div>


        </div>
      </div>
  // <Table
  //     columns={columns}
  //     dataSource={data}
  //     pagination={pagination}
  //     loading={loading}
  //     onChange={handleTableChange}
  //     showSorterTooltip={{
  //       target: 'sorter-icon',
  //     }}
  // />
)
  ;
};

export default UserRecordTable;
