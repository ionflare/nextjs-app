import React, { createContext, useContext, useMemo, useReducer, Dispatch, useState, useEffect } from 'react';



type Theme = 'light' | 'dark';

type AppState = {
    theme: Theme;
    user: { id: string; name: string } | null;
    appStatus: number;
    focusApp: string;
    wsEvent: { evData: WsData, cnt: number };
    game: Game | null;
    room: Room | null;
    chatMsg: ChatMsg[];
    wsLoader: number;
};

type ChatMsg = {
    from: string;
    message: string;
    //timestamp : string;
}

type WsData = {
    evName: string;
    data: object;
};


export const APPSTATUS = {
    READY: 1,
    BUSY: 2,
}

export const CTACT = {
    THEME_SET: 'SET_THEME',
    SIGN_IN: 'SIGN_IN',
    SIGN_OUT: 'SIGN_IN',
    WS_EVENT: 'WS_EVENT',
    APP_STATUS: 'APP_STATUS',

}

export type RoomMember = { id: string; status: number }

type GDataCheckerTH = {
    turnNo: number;
    gameOver: boolean;
    winnerPIdx: number;
    userIdArr: string[];
    movePattern: MovePattern[][];
    boardPattern: number[][];
    boardState: number[][];
    pObj: PlayerObject[][];
    possibleMoves: PossibleMoves;
}
export type PlayerObject = {
    pid: string; lv: number; mPattern: number, row: number, col: number
}

type MovePattern = {
    row: number;
    col: number;
    dst: number;
}

export type MoveInfo = {
    row: number;
    col: number;
    killId: number;
}

type PossibleMoves = {
    turn: number;
    pid: string;
    checkers: CheckerMove[];
}

export type CheckerMove = {
    ckId: number;
    to: MoveInfo[]
}

type CheckerMoveCate = {
    normal: MoveInfo[]
    tokill: MoveInfo[]
}


type Room = { id: string | null; members: RoomMember[] }
type Game = {
    id: string | null; data: GDataCheckerTH
}

type Action =
    | { type: 'THEME_SET'; theme: Theme }
    | { type: 'SIGN_IN'; user: { id: string; name: string } }
    | { type: 'SIGN_OUT' }
    | { type: 'APPSTATUS_SET', appStatus: number }
    | { type: 'FOCUSAPP_SET', focusApp: string }
    | { type: 'GAME_SET', game: Game }
    | { type: 'ROOM_SET', room: Room }
    | { type: 'CHATMSG_SET', newMsg: ChatMsg }
    | { type: 'WS_EVENT', evData: WsData }
    | { type: 'WS_LOADER' };



const initialState: AppState = {
    theme: 'light',
    user: null,
    room: { id: null, members: [] },
    game: { id: null, data: { turnNo: 0, gameOver: false, winnerPIdx: -1, userIdArr :[],boardPattern: [], boardState: [], movePattern: [], pObj: [], possibleMoves: {turn: 0, pid:'', checkers: []} } },
    focusApp: 'GAME',
    chatMsg: [],
    appStatus: APPSTATUS.READY,
    wsEvent: { evData: { evName: '', data: {} }, cnt: 0 },
    wsLoader: 0,
};

function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'THEME_SET':
            return { ...state, theme: action.theme };
        case 'SIGN_IN':
            return { ...state, user: action.user };
        case 'SIGN_OUT':
            return { ...state, user: null };
        case 'APPSTATUS_SET':
            return { ...state, appStatus: action.appStatus };
        case 'ROOM_SET':
            return { ...state, room: action.room };
        case 'GAME_SET':
            return { ...state, game: action.game };
        case 'CHATMSG_SET':
            const a = state.chatMsg.concat(action.newMsg);
            return { ...state, chatMsg: a }
        case 'WS_EVENT':
            const obj = { evData: action.evData, cnt: (state.wsEvent.cnt + 1) % 100 }
            return { ...state, wsEvent: obj }
        case 'FOCUSAPP_SET':
            return { ...state, focusApp: action.focusApp };
        case 'WS_LOADER':
            return { ...state, wsLoader: (state.wsLoader + 1) % 100 }
        default:
            return state;
    }
}


// Split contexts to minimize re-renders
const StateContext = createContext<AppState | undefined>(undefined);
const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    // stable references for children
    const stateValue = useMemo(() => state, [state]);

    return (
        <StateContext.Provider value={stateValue}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

export function useAppState() {
    const ctx = useContext(StateContext);
    if (!ctx) throw new Error('useAppState must be used within <AppProvider>');
    return ctx;
}

export function useAppDispatch() {
    const ctx = useContext(DispatchContext);
    if (!ctx) throw new Error('useAppDispatch must be used within <AppProvider>');
    return ctx;
}

// Optional: convenience action creators
export function useAppActions() {
    const dispatch = useAppDispatch();
    return useMemo(
        () => ({
            setTheme: (theme: Theme) => dispatch({ type: 'THEME_SET', theme }),
            signIn: (user: { id: string; name: string }) => dispatch({ type: 'SIGN_IN', user }),
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            setRoom: (room: Room) => dispatch({ type: 'ROOM_SET', room: room }),
            setGame: (game: Game) => dispatch({ type: 'GAME_SET', game: game }),
            setAppStatus: (status: number) => dispatch({ type: 'APPSTATUS_SET', appStatus: status }),
            setFocusApp: (focusApp: string) => dispatch({ type: 'FOCUSAPP_SET', focusApp: focusApp }),
            setChatMsg: (newMessage: ChatMsg) => dispatch({ type: 'CHATMSG_SET', newMsg: newMessage }),
            setWsEvent: (ev: WsData) => dispatch({ type: 'WS_EVENT', evData: ev }),
            setWsLoader: () => dispatch({ type: 'WS_LOADER' }),
        }),
        [dispatch]
    );
}
