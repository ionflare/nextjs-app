
import { APPSTATUS, appInfo } from '../modules/appInfo';
class Socket {
    instance: WebSocket;
    constructor() {
        this.instance = new WebSocket('ws://0.0.0.0:4000/ws');
        this.instance.onopen = (e) => { console.log('init websocket') }
    }
    init() {
        this.instance.onmessage = (e) => {
            console.log(e);
            const data = JSON.parse(e.data).data;
            if (data.event === EVCODE.MESSAGE) {
                console.log(data.text);
                //this.handleCreRoom();

            }
            else if (data.event === EVCODE.RES_CREROOM) { this.onResCreRoom(e.data); }
            else if (data.event === EVCODE.RES_JOINROOM) { console.log(data.text) }
            else if (data.event === EVCODE.RES_GAMECTRL) { console.log(data.text) }
        }
        //test
        //setTimeout(() => { this.reqCreRoom() }, 1000);
    }

        

    onReqCreRoom() {
        console.log(appInfo.status);
        
        appInfo.set(APPSTATUS.BUSY);
        this.emit(EVCODE.REQ_CREROOM, {});
    }

    onResCreRoom(data: object) {
        
        if(appInfo.status === APPSTATUS.READY) return;
        appInfo.set(APPSTATUS.READY);
    }

    
    reqGameCtrl(roomId: string) {
        // this.emit({
        //     event: EVCODE.REQ_JOINROOM,
        //     data: { room: roomId }
        // });
    }


    reqJoinRoom(roomId: string) {
        this.emit(EVCODE.REQ_JOINROOM, { data: { room: roomId } });
    }

    reqMessage(text: string) {
        this.emit(EVCODE.MESSAGE, { data: { text: text } });
        // this.emit({
        //     event: EVCODE.MESSAGE,
        //     data: { text: text }
        // });
    }

    emit(ev: string, dt: object) {
        this.instance.send(JSON.stringify({ event: ev, data: dt }));
    }

}




export const EVCODE = {
    RES_CONNECT: 'RES_CONNECT',
    REQ_CREROOM: 'REQ_CREROOM',
    RES_CREROOM: 'RES_CREROOM',
    REQ_JOINROOM: 'REQ_JOINROOM',
    RES_JOINROOM: 'RES_JOINROOM',
    REQ_GAMECTRL: 'REQ_GAMECTRL',
    RES_GAMECTRL: 'RES_GAMECTRL',
    MESSAGE: 'MESSAGE',
}

export const ws = new Socket();
//export default ws;