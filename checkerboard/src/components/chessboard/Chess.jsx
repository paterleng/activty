import './Chessboard.css';
import UserInfo from '../userinfo/UserInfo';
import Header from "../header/Header.jsx";
import ChessBoard from "./ChessBoard";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {setPage} from "../../store/store.js";
import {useDispatch} from "react-redux";

const Chess = () => {
    const [blockId, setBlockId] = useState(null);
    const [gridId, setGridId] = useState(null);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(()=>{
        try {
            const id = searchParams.get("blockId");
            let strGridId = searchParams.get("gridId");
            if (strGridId===null) {
                strGridId = "0"
            }

            const idInt = parseInt(id)
            const intGridId = parseInt(strGridId)
            setGridId(intGridId)
            setBlockId(idInt);
            dispatch(setPage(idInt))
        } catch (error) {
            console.error('Failed to parse URL hash data:', error);
        }
    },[])
    return (
        <div className='checkerboard'>
            <div>
                <Header/>
            </div>
            <div className='main'>
                <UserInfo/>
                {blockId !== null && gridId !== null && <ChessBoard gId={gridId} />}2
            </div>
        </div>
    );
};

export default Chess;
