'use client'
import React, { useEffect, useRef } from 'react';
import { APPSTATUS, useAppActions, useAppState } from './AppContext';
import { EVCODE } from './WebSock';


export function GbChatBox({ ...arg }) {
    const { appStatus, room, user, chatMsg } = useAppState();
    const { setWsEvent, setAppStatus } = useAppActions();
    const refInputChat = useRef<HTMLInputElement>(null);

    function onMessage() {
        setAppStatus(APPSTATUS.BUSY);
        setWsEvent({ evName: EVCODE.MESSAGE, data: { roomId: '', from: user?.id, to: '', message: refInputChat.current?.value } });
    }
    return (<div style={{ backgroundColor: "gray" }}>
        <table className={'border1'}>
            {chatMsg.map((it, k) => {
                return (
                    <tr key={k}>
                        <td style={{width: 100}}>{it.from}</td>
                        <td>{it.message}</td>
                    </tr>
                );
            })}
        </table>
        <input name="input_chat" style={{ backgroundColor: 'beige' }} ref={refInputChat} type="text" />
        <button style={{ backgroundColor: "green" }} onClick={() => onMessage()}>Send Message</button>
    </div>);
}
