import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppState, useAppActions, APPSTATUS } from './AppContext';
import { setFips } from 'crypto';



export const EVCODE = {
  RES_CONNECT: 'RES_CONNECT',
  REQ_UPSOCKET: 'REQ_UPSOCKET',
  RES_UPSOCKET: 'RES_UPSOCKET',
  REQ_CREROOM: 'REQ_CREROOM',
  RES_CREROOM: 'RES_CREROOM',
  REQ_JOINROOM: 'REQ_JOINROOM',
  RES_JOINROOM: 'RES_JOINROOM',
  REQ_GAMECTRL: 'REQ_GAMECTRL',
  RES_GAMECTRL: 'RES_GAMECTRL',
  REQ_QUITROOM: 'REQ_QUITROOM',
  RES_QUITROOM: 'RES_QUITROOM',
  REQ_ROOMCTRL: 'REQ_ROOMCTRL',
  RES_ROOMCTRL: 'RES_ROOMCTRL',
  REQ_CREGAME: 'REQ_CREGAME',
  RES_CREGAME: 'RES_CREGAME',
  MESSAGE: 'MESSAGE',
}

let ws: WebSocket;
export function WebSock({ ...arg }) {
  const [seed, setSeed] = useState(0);
  const { setAppStatus, setRoom, setChatMsg, setWsLoader, setGame } = useAppActions();
  const { user, appStatus, wsEvent, wsLoader, room } = useAppState();
  useEffect(() => {
    ws = new WebSocket('ws://localhost:4000/ws');
    ws.onopen = (e) => {
      console.log('init websocket'); setAppStatus(1);
      //console.log(room);
    }
    ws.onmessage = (e) => {
      //observe error from ws server
      //if (e.data.result.ok != true) console.log(e.data.result.errorMessage);

      const data = JSON.parse(e.data);
      if (data.event === EVCODE.MESSAGE) {
        if (data.ok == true) setChatMsg({ from: data.body.from, message: data.body.message });
        console.log(data.body);
      }
      else if (data.event === EVCODE.REQ_UPSOCKET) {
        setAppStatus(APPSTATUS.READY);
      }
      else if (data.event === EVCODE.RES_CREROOM) {
        console.log(data)
        if (data.ok == true) { setRoom({ id: data.body.id, members: data.body.members }); }
        setAppStatus(APPSTATUS.READY);
      }
      else if (data.event === EVCODE.RES_QUITROOM) {
        if (data.ok == true) {
          setRoom({ id: data.body.id, members: data.body.members });
          setGame(data.body.game);
        }
        setAppStatus(APPSTATUS.READY);
      }
      else if (data.event === EVCODE.RES_JOINROOM) {
        console.log(data)
        if (data.ok == true) {
          setRoom({ id: data.body.id, members: data.body.members });
          setGame(data.body.game);
        }
        setAppStatus(APPSTATUS.READY);
      }
      else if (data.event === EVCODE.RES_ROOMCTRL) {
        console.log(data);
        if (data.ok == true) { setRoom({ id: data.body.id, members: data.body.members }); }
        setAppStatus(APPSTATUS.READY);
      }
      else if (data.event === EVCODE.RES_GAMECTRL) {
        console.log(data.body)
        if (data.ok == true) { setGame({ id: data.body.id, data: data.body.data }); }
        setAppStatus(APPSTATUS.READY);
      }
      else if (data.event === EVCODE.RES_CREGAME) {
        if (data.ok == true) { setGame({ id: data.body.id, data: data.body.data }); }
        setAppStatus(APPSTATUS.READY);
      }
    }
  }, [wsLoader]);

  useEffect(() => {
    if (ws.readyState == 1) {
      if (wsEvent.evData.evName == EVCODE.REQ_CREROOM) emit(EVCODE.REQ_CREROOM, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.MESSAGE) emit(EVCODE.MESSAGE, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.REQ_UPSOCKET) emit(EVCODE.REQ_UPSOCKET, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.REQ_QUITROOM) emit(EVCODE.REQ_QUITROOM, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.REQ_JOINROOM) emit(EVCODE.REQ_JOINROOM, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.REQ_ROOMCTRL) emit(EVCODE.REQ_ROOMCTRL, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.REQ_CREGAME) emit(EVCODE.REQ_CREGAME, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.REQ_GAMECTRL) emit(EVCODE.REQ_GAMECTRL, wsEvent.evData.data);
      else if (wsEvent.evData.evName == EVCODE.REQ_UPSOCKET) {
        ws.close();
        setWsLoader();
      }
      else { }
    }

  }, [wsEvent])

  function emit(ev: string, dt: object) {
    ws.send(JSON.stringify({ event: ev, data: dt }));
  }

  return <></>
};

// export class WsModel{
//   evName: string;
//   payload : object;
//   constructor(_evName : string ){

//   }
// }