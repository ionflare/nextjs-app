'use client'
import React, { useRef, useState } from 'react';
// import { ws, EVCODE } from '../modules/socket';
//import { appInfo, APPSTATUS } from '../modules/appInfo';
import { APPSTATUS, useAppActions, useAppState } from './AppContext';
import { EVCODE } from './WebSock';
import { GmFrame } from './GmFrame';

export function GmRoom({ ...arg }) {

    const { appStatus, room, user, game } = useAppState();
    const { setWsEvent, setAppStatus, setGame } = useAppActions();
    const refInputRoom = useRef<HTMLInputElement>(null);

    function onQuitRoom() {
        setAppStatus(APPSTATUS.BUSY);
        setWsEvent({ evName: EVCODE.REQ_QUITROOM, data: { id: room?.id } });
        setTimeout(() => {
            setAppStatus(APPSTATUS.READY);
        }, 3000);
    }

    function onSetReady() {
        setAppStatus(APPSTATUS.BUSY);
        setWsEvent({ evName: EVCODE.REQ_ROOMCTRL, data: { id: room?.id, status: 1 } });
        setTimeout(() => {
            setAppStatus(APPSTATUS.READY);
        }, 3000);
    }

    function onStartGame() {
        setAppStatus(APPSTATUS.BUSY);
        setWsEvent({ evName: EVCODE.REQ_CREGAME, data: { gName : "CHECKER_TH"} });
        setTimeout(() => {
            setAppStatus(APPSTATUS.READY);
        }, 3000);
    }

    function onKickPlayer() { }

    return (
        <>
            {(room?.id != null) ? (<div> room : {room?.id}
                {room.members?.map((memb, k) => {
                    return (
                        // <div key={k}> {memb} </div>
                        <div key={k}>
                            <span> {memb.id} </span>  <span> Status : {memb.status} </span>
                            {(user?.id != null && user?.id == room.members[0].id && user?.id != memb.id) ?
                                <span><button style={{ backgroundColor: "orange" }} onClick={() => onKickPlayer()}>Kick!!</button></span> : <></>}
                        </div>
                    )
                })}
                <br></br>
                {(room?.members[0].id == user?.id) ?
                    (<button onClick={() => onStartGame()}>Game START</button>) :
                    (<button onClick={() => onSetReady()}>Game Ready</button>)}
                <br></br><button onClick={() => onQuitRoom()}>QUIT ROOM</button>
            </div>) :
                <></>}
        </>
    );
}