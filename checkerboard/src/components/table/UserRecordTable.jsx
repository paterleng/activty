import './UserRecordTable.css'
import RecordScrollbar from "../scrollbar/ScrollbarRecord.jsx";

const UserRecordTable = () => {

  return (
      <div className='user-info-model-external'>
        <div className="user-info-model-internal">
          <div className="record-div-style">
            <RecordScrollbar />
          </div>
        </div>
      </div>
  );
};

export default UserRecordTable;
