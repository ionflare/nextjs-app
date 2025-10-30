'use client'
import React, { useRef, useState } from 'react';
// import { ws, EVCODE } from '../modules/socket';
//import { appInfo, APPSTATUS } from '../modules/appInfo';
import { APPSTATUS, CheckerMove, MoveInfo, useAppActions, useAppState } from './AppContext';
import { EVCODE } from './WebSock';

export function GmFrame({ ...arg }) {
    const { setWsEvent, setAppStatus, setGame } = useAppActions();
    const { appStatus, room, user, game } = useAppState();
    const tempA: CheckerMove = { ckId: -1, to: [] };
    const [selectedCk, setSelectedCk] = useState(tempA);
    const [possibleMoves, setPossibleMoves] = useState([{ row: -1, col: -1, killId: -1 }]);

    function getCheckerInfo(c: number) {
        let ckInfo = '';
        game?.data.pObj?.forEach((a, aId) =>
            a.forEach((b, bId) => {
                if (((aId * 8) + bId) == c) ckInfo = b.pid;
            }
            )
        )
        return ckInfo;
    }

    function onClickCell(rIdx: number, cIdx: number) {
        if (game?.data.possibleMoves.pid != user?.id) return;
        if (selectedCk.ckId == -1) {
            const ck = game?.data.possibleMoves.checkers.find(a => a.ckId == game?.data.boardState[rIdx][cIdx]);
            if (ck == undefined) return;
            console.log(ck)
            setSelectedCk(ck);
        }
        else {

            if (game?.data.boardState[rIdx][cIdx] == -1) {
                //req move
                const mv = selectedCk.to.find(a => a.row == rIdx && a.col == cIdx);
                if (mv != undefined) {
                    onReqMove(selectedCk.ckId, mv);
                    setSelectedCk({ ckId: -1, to: [] });
                }
            }
            else {
                //select new ck
                const ck = game?.data.possibleMoves.checkers.find(a => a.ckId == game?.data.boardState[rIdx][cIdx]);
                if (ck == undefined) return;
                setSelectedCk(ck);

            }
        }
    }

    function onReqMove(ckId: number, mv: MoveInfo) {
        console.log(ckId)
        setAppStatus(APPSTATUS.BUSY);
        setWsEvent({ evName: EVCODE.REQ_GAMECTRL, data: { ckId: ckId, mv: mv } });
        setTimeout(() => {
            setAppStatus(APPSTATUS.READY);
        }, 3000);
    }

    function renderCell(rIdx: number, cIdx: number, ckIdx: number) {
        return (<td key={cIdx} className={getCellClass(rIdx, cIdx)} onClick={(e) => onClickCell(rIdx, cIdx)}>
            {(ckIdx > -1) ? getCheckerInfo(ckIdx) : ''}
        </td>)
    }

    function getCellClass(rIdx: number, cIdx: number) {
        let clName = 'checkerTd';
        if(game?.data.boardPattern[rIdx][cIdx] == 0)
        {
            clName += ' unmoveableT';
        }
        else if (game?.data.userIdArr[game?.data.turnNo % game?.data.pObj.length] == user?.id) {
            if (selectedCk.ckId != -1) {
                //clName += ' border1';
                if (game?.data.possibleMoves.checkers.find(a => game?.data.boardState[rIdx][cIdx] == a.ckId) != undefined) {
                    clName += ' border5 movableTile'

                } else {
                    clName += ' border1'
                }
                if (selectedCk.ckId == game?.data.boardState[rIdx][cIdx]) { clName += ' active' }
                else if (selectedCk.to.find(a => a.row == rIdx && a.col == cIdx) != undefined) { clName += ' highlightMoveTile' }
                else {
                    const killedCk = selectedCk.to.find(a => a.killId == game?.data.boardState[rIdx][cIdx]
                        && game?.data.boardState[rIdx][cIdx] != -1);
                    if (killedCk != undefined) { clName += ' highlightOpponent' }
                }
            } else {
                if (game?.data.possibleMoves.checkers.find(a => game?.data.boardState[rIdx][cIdx] == a.ckId) != undefined) {
                    clName += ' border5 movableTile'

                } else {
                    clName += ' border1'
                }
            }
        }
        else { clName += ' border1'; }

        return clName;
    }

    function renderBoard() {
        return <table>
            {game?.data.boardState?.map((r, rIdx) => (<tr key={rIdx}>
                {r.map((c, cIdx) => renderCell(rIdx, cIdx, c))}
            </tr>)
            )}
        </table>
    }

    function onMoveCk(rIdx: number, cIdx: number) {
        const ck = game?.data.possibleMoves.checkers.find(a => a.ckId == game?.data.boardState[rIdx][cIdx]);
        if (ck == undefined) return;
        console.log(ck);
    }

    return (<>
        {game?.data.gameOver == true? <div>Winner : {game.data.userIdArr[game.data.winnerPIdx]}</div> :<></>}
        <div style={{ width: 500, height: 500, border: 1, borderColor: 'black'}}>
            {renderBoard()}
        </div>
    </>);
}