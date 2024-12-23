import { useEffect, useState } from 'react';
import { List, Skeleton } from 'antd';
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
    const response = await Records();
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
        height: 500,
        width: 300,
        overflow: 'hidden',  // 隐藏超出边框的内容
        padding: '0 16px',
        position: 'relative',
        background: '#191919',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          animation: 'scrolling 70s linear infinite', 
        }}
      >
        <div className="scrollContent" style={{ margin: 0, padding: 0 }}>
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
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item style={{ margin: 0 ,color: 'white'}}>
                  <div>{item.owner} Occupied {item.old_owner} Altar with {item.transaction_amount} USDT!</div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>

        {/* 内容区域 2 */}
        <div className="scrollContent" style={{ margin: 0, padding: 0 }}>
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
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item style={{ margin: 0 ,color: 'white' }}>
                  <div>{item.owner} Occupied {item.old_owner} Altar with {item.transaction_amount} USDT!</div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </div>

      <style>
        {`
          @keyframes scrolling {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default RecordTable;
