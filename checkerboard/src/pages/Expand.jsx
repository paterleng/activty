import { useState } from 'react';
import '../components/chessboard/ChessBoard.css';
import Rule from '../components/Rule';
import UserInfo from '../components/userinfo/UserInfo'
import TransactionRecord from '../components/TransactionRecord';
import { frontURL} from '../config/config'
import RecordTable from '../components/table/RecordTable';



const Expand = () => {
    const gridSize = 10; 
    const mergedIds = [45, 46, 55, 56];
    const boxes = Array.from({ length: gridSize * gridSize }, (_, index) => {
        const id = index + 1;
        const isMerged = mergedIds.includes(id);
        return { id, price: 500, isMerged };
    });

    // eslint-disable-next-line no-unused-vars
    const [currentBox, setCurrentBox] = useState(null);

    const handleBoxClick = (boxId, boxPrice) => {
        const encodedData = encodeURIComponent(JSON.stringify(boxId))
        const newUrl = frontURL+`/newpage`;
        window.open(`${newUrl}#${encodedData}`, '_blank');
        setCurrentBox({ id: boxId, price: boxPrice });
    };

    return (
        <div className="main">
            <div className="container-block">
                <div className="countdown-wrapper">
                    <UserInfo />
                    {/* <Countdown initialSeconds={1000} /> */}   
                </div>
                
                <div className="grid-container">
                    {boxes.map((box) => {
                        if (box.isMerged) {
                            // 渲染合并后的大格子
                            if (box.id === 45) {
                                return (
                                    <div
                                        key="merged"
                                        className="conter-box"
                                        style={{
                                            gridColumn: '5 / 7', // 跨列 (第5列到第6列)
                                            gridRow: '5 / 7', // 跨行 (第5行到第6行)
                                        }}
                                    >
                                        50000
                                    </div>
                                );
                            }
                            return null;
                        }
                        // 渲染普通格子
                        return (
                            <div
                                key={box.id}
                                className="grid-box"
                                onClick={() => handleBoxClick(box.id, box.price)}
                            >
                                {box.id}
                            </div>
                            
                        );
                    })}
                </div>
                <div className='right-dev'>
                    <div className='record-table-dev'>
                        <RecordTable />
                    </div>
                    <div>
                        <Rule />
                        <TransactionRecord />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expand;

