'use client'
import React, { useRef } from 'react';
import { ws, EVCODE } from '../modules/socket';


export function GmHod({ ...arg }) {



    function onReqMove() {
        //ws.emit(EVCODE.MESSAGE, { text: '5555' });
        //ws.reqCreRoom('xxxxa123');     
    }
    return (<div><table><tr><td onClick={() => onReqMove()}>AAAAA</td></tr></table></div>);
}