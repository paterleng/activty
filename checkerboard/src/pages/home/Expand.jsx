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
import Bowl1 from '../../assets/img/Bowl1.png'
import Bowl2 from '../../assets/img/Bowl2.png'
import Bowl3 from '../../assets/img/Bowl3.png'
import Bowl4 from '../../assets/img/Bowl4.png'
import Bowl5 from '../../assets/img/Bowl5.png'
import Bowl6 from '../../assets/img/Bowl6.png'
import Bowl7 from '../../assets/img/Bowl7.png'
import Bowl8 from '../../assets/img/Bowl8.png'
import Bowl9 from '../../assets/img/Bowl9.png'

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
    // 九宫格数组对象
    const cellArray = [
        {
            price:10.12,
            img:Bowl1,
            title:'Barking Bowl'
        },
        {
            price:10.12,
            img:Bowl2,
            title:'Howl Bowl'
        },
        {
            price:10.12,
            img:Bowl3,
            title:'Courage Bowl'
        },
        {
            price:10.12,
            img:Bowl4,
            title:'Angry Bowl'
        },
        {
            price:10.12,
            img:Bowl5,
            title:'Offical Line Pool'
        },
        {
            price:10.12,
            img:Bowl6,
            title:'Against Bowl'
        },
        {
            price:10.12,
            img:Bowl7,
            title:'Courage Bowl'
        },
        {
            price:10.12,
            img:Bowl8,
            title:'Revolut Bowl'
        },
        {
            price:10.12,
            img:Bowl9,
            title:'confidence Bowl'
        },
    ]

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
                                {cellArray.map((cell, index) => (
                                    <div
                                        key={index}
                                        className='cellStyle'
                                        onClick={index !== 4 ? () => handleClick(index) : undefined}
                                    >
                                        <div className='price'>${cell.price}</div>
                                        <div className='img'>
                                            <img src={cell.img} alt="" style={{ width: '50px', height: '50px' }} />
                                        </div>
                                        <div className='cellTitle'>{cell.title}</div>
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

