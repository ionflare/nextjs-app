'use client'
import React, { useRef, useState } from 'react';
// import { ws, EVCODE } from '../modules/socket';
//import { appInfo, APPSTATUS } from '../modules/appInfo';
import { APPSTATUS, useAppActions, useAppState } from './AppContext';
import { EVCODE } from './WebSock';
import { GmRoom } from './GmRoom';
import { GmLobby } from './GmLobby';
import { GmContainer } from './GmContainer';

export function GmApp({ ...arg }) {

    const { appStatus, room, game } = useAppState();
    return (<>

        {(room?.id != null) ?
            (<>{(game?.id != null) ? (<GmContainer></GmContainer>) : (<GmRoom></GmRoom>)}</>) :
            (<GmLobby></GmLobby>)}

    </>);
}