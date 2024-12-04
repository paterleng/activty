import { useEffect, useState } from 'react';
import { Divider, List, Skeleton } from 'antd';
import { Records } from '../../apis/manage';
import InfiniteScroll from 'react-infinite-scroll-component';

const RecordTable = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true); 
    const response = await Records()  
    setData(response.data);
    setLoading(false);
  };
  useEffect(() => {
    loadMoreData();
    const intervalId = setInterval(() => {
      loadMoreData();
    }, 10 * 60 * 1000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);
    
  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        width: 400,
        overflow: 'auto',
        padding: '0 16px',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>仅展示最近50条记录</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
                <div>{ item.owner}Occupied {item.old_owner} Altar with {item.transaction_amount} USDT!</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};
export default RecordTable;