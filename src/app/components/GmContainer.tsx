'use client'
import React, { useRef, useState } from 'react';
// import { ws, EVCODE } from '../modules/socket';
//import { appInfo, APPSTATUS } from '../modules/appInfo';
import { APPSTATUS, useAppActions, useAppState } from './AppContext';
import { EVCODE } from './WebSock';
import { GmFrame } from './GmFrame';

export function GmContainer({ ...arg }) {
    const { setWsEvent, setAppStatus, setGame } = useAppActions();
    const { appStatus, room, user, game } = useAppState();
    function onQuitGame() {
        setAppStatus(APPSTATUS.BUSY);
        setWsEvent({ evName: EVCODE.REQ_QUITROOM, data: { id: room?.id } });
        setTimeout(() => {
            setAppStatus(APPSTATUS.READY);
        }, 3000);
    }
    return (<>
        <GmFrame></GmFrame>
        <div><button style={{ backgroundColor: "orange" }} onClick={() => onQuitGame()}>QUIT GAME</button></div>
    </>);
}