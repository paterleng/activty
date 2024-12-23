import { useEffect, useState } from 'react';
import { Record } from '../../apis/manage';
import './UserRecordTable.css'

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

  const getTime = (timestr)=>{
    const date = new Date(timestr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return year + ':' + month + ':' + day + ':' + hours+':' + minutes+':' + seconds;
  }


  return (
      <div className='user-info-model-external'>
        <div className="user-info-model-internal">
          <div className="record-div-style">
            {data.map((item, index) => (
                <div key={index}>
                    <div className="time-style">{getTime(item.CreatedAt)}</div>
                    <span >
                      You Occupied {item.owner} sacred food pit with {item.transaction_amount} SOL! All hail the God O'Dogs!
                    </span>
                </div>
            ))}
          </div>
        </div>
      </div>
)
  ;
};

export default UserRecordTable;
