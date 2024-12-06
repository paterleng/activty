import { useNavigate } from 'react-router-dom';
import UserInfo from '../../components/userinfo/UserInfo'
import TransactionRecord from '../../components/TransactionRecord';
import RecordTable from '../../components/table/RecordTable';
import ConnectWallet from '../../components/web3wallet/Wallet';
import '../../components/chessboard/ChessBoard.css'
import './Expand.css'
import Header from '../../components/header/Header';

const Expand = () => {
    const navigate = useNavigate();

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
                    <ConnectWallet />
                    <UserInfo />
                    {/* <Countdown initialSeconds={1000} />    */}
                </div>
                
                <div className='gridStyle'>
                    {Array(9).fill().map((_, index) => (
                        <div
                            key={index}
                            className='cellStyle'
                            onClick={index !== 4 ? () => handleClick(index) : undefined}
                        >
                            {index + 1}
                            </div>
                    ))}
                </div>
                <div className='right-dev'>
                    <div className='record-table-dev'>
                            <RecordTable />
                    </div>
                    <div>
                        <div onClick={ruleClickHandle}>
                            规则
                        </div>
                        <TransactionRecord />
                    </div>
                </div>
            </div>
        </div>
        </div>
       
    );
};

export default Expand;

