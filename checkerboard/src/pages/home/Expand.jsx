import { useNavigate } from 'react-router-dom';
import UserInfo from '../../components/userinfo/UserInfo'
import RecordTable from '../../components/table/RecordTable';
import '../../components/chessboard/ChessBoard.css'
import './Expand.css'
import Header from '../../components/header/Header';
import Countdown from "../../components/Countdown.jsx";
import RulePopup from '../../components/rulePopup/rulePopup.jsx';
import {useEffect, useState} from "react";
import {GetAmountTotal} from "../../apis/manage.js";

const Expand = () => {
    const navigate = useNavigate();
    const [total, setTotal] = useState(46.2);
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

    return (
        <div className='page'>
            <Header />
            <div className="main">
                <div className="container-block">
                    <div className="countdown-wrapper">
                        <UserInfo/>
                    </div>
                    <div className="grid-style-external">
                        <div className="grid-style-internal">
                            <div className='grid-style-margin'>
                                <div className='title'>Total Bones Count:</div>
                                <div className='content'>{total}K/1M</div>
                            </div>
                            <div className='grid-style-margin'>
                                <div className='title'>Countdown unitl Next boost:</div>
                                <Countdown initialSeconds={3600}/>
                            </div>
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
                    </div>
                    <div>
                        <RulePopup/>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Expand;

