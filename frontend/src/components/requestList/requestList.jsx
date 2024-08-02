import './requestList.css'
import Request from './request';
import { useEffect } from 'react';

export default function requestList({requests, setRequestData, num, setNum, toRemove, setRequests, setToRemove}) {


  return (
    <div className="request-list">
      {requests.length === 0 ? (
        <div className="noRequestDiv"><h3>No requests made yet...</h3></div>
        
      ) : (
        requests.map((request, id) => (
          <div key={id} className="request-element">
            <Request request={request} setRequestData={setRequestData} num={num} setNum={setNum}/>
          </div>
        ))
      )}
    </div>
  );
}
