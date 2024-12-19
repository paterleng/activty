import { useNavigate } from 'react-router-dom';
import UserInfo from '../../components/userinfo/UserInfo'
import RecordTable from '../../components/table/RecordTable';
import '../../components/chessboard/ChessBoard.css'
import './Expand.css'
import Header from '../../components/header/Header';
import Countdown from "../../components/Countdown.jsx";
import {useEffect, useState} from "react";
import {GetAmountTotal} from "../../apis/manage.js";

const Expand = () => {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0.00);
    useEffect(() => {
        const getAmountTotal = async () => {
            const response = await GetAmountTotal()
            if (response.code === 200){
                setTotal(response.data)
            }
        }
        getAmountTotal()
    }, []);
    const handleClick = (index) => {
        navigate(`/board/${index + 1}`);
    };

    const ruleClickHandle = () => {
        navigate("/rule")
    }

    return (
        <div className='page'>
            <Header />
            <div className="main">
            <div className="container-block">
                <div className="countdown-wrapper">
                        <UserInfo />
                    {/* <Countdown initialSeconds={1000} />    */}
                </div>
                <div className="grid-style-external">
                    <div className="grid-style-internal">
                        <div>{total}</div>
                        <Countdown initialSeconds={ 3600} />
                        <div className='gridStyle'>
                            {Array(9).fill().map((_, index) => (
                                <div
                                    key={index}
                                    className='cellStyle'
                                    onClick={index !== 4 ? () => handleClick(index) : undefined}
                                >
                                    1
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='right-dev'>
                    <div className='record-table-dev'>
                        <RecordTable/>
                    </div>
                    <div>
                        <div onClick={ruleClickHandle}>
                            规则
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>

    );
};

export default Expand;

