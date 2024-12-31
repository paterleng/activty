import { useEffect, useState } from 'react';
import {Avatar, List, Skeleton} from 'antd';
import { Records } from '../../apis/manage';
import InfiniteScroll from 'react-infinite-scroll-component';
import {AntDesignOutlined} from "@ant-design/icons";

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

    const images = [
        '/images/avatar/1.png',
        '/images/avatar/2.png',
        '/images/avatar/3.png',
        '/images/avatar/4.png',
        '/images/avatar/5.png',
        '/images/avatar/6.png',
        '/images/avatar/7.png',
        '/images/avatar/8.png',
    ];

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 450,
        width: 300,
        overflow: 'hidden',  // 隐藏超出边框的内容
        padding: '0 16rem',
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
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '100rem',
                        backgroundColor: '#0f0f0f',
                        borderRadius:'10rem',
                        marginRight:'10rem'

                    }}>
                        <div>
                            <Avatar
                                shape="square" size={50}
                                style={{marginRight:'15rem',marginLeft:'10rem'}}
                                icon={<AntDesignOutlined/>}
                                src= {images[item.avatar_id]}
                            />
                        </div>
                        <div>
                            <span style={{color: '#d8c519'}}>{item.name}</span>&nbsp;
                            Occupied &nbsp;
                            <span style={{color: '#d8c519'}}>{item.old_name}</span>&nbsp;
                            Altar with&nbsp;
                            <span style={{color: '#d8c519'}}>{item.transaction_amount}</span>&nbsp;
                            USDT!&nbsp;
                        </div>
                    </div>
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
