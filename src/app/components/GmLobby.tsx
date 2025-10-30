'use client'
import React, { useRef, useState } from 'react';
// import { ws, EVCODE } from '../modules/socket';
//import { appInfo, APPSTATUS } from '../modules/appInfo';
import { APPSTATUS, useAppActions, useAppState } from './AppContext';
import { EVCODE } from './WebSock';

export function GmLobby({ ...arg }) {

    const { appStatus, room, user } = useAppState();
    const { setWsEvent, setAppStatus } = useAppActions();
    const refInputRoom = useRef<HTMLInputElement>(null);

    function onCreRoom() {
        setAppStatus(APPSTATUS.BUSY);
        setWsEvent({ evName: EVCODE.REQ_CREROOM, data: {} });
        setTimeout(() => {
            setAppStatus(APPSTATUS.READY);
        }, 3000);
    }

    function onJoinRoom() {
        setAppStatus(APPSTATUS.BUSY);
        console.log('fire join');
        setWsEvent({ evName: EVCODE.REQ_JOINROOM, data: { id: refInputRoom.current?.value } });
        setTimeout(() => {
            setAppStatus(APPSTATUS.READY);
        }, 3000);
    }

    return (<div>
        <input name="input_room" style={{ backgroundColor: 'beige' }} ref={refInputRoom} type="text" />
        <button style={{ backgroundColor: "green" }} onClick={() => onJoinRoom()}>JOIN ROOM</button>
        <button style={{ backgroundColor: "orange" }} onClick={() => onCreRoom()}>CREATE ROOM</button>
    </div>);
}