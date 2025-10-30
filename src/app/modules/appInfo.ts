export const APPSTATUS = {
    READY: 0,
    BUSY: 1,
}

class AppInfo {
    status = 0;
    ticker: NodeJS.Timeout | undefined;
    constructor() {
        this.status = APPSTATUS.READY;
    }
    init(){
        this.status = APPSTATUS.READY;
    }
    set(_status: number) {
        this.status = _status;
        if (_status === APPSTATUS.BUSY) {
            this.ticker = setTimeout(() => { this.status === APPSTATUS.READY }, 5000);
        }
    }
}

export const appInfo = new AppInfo();
