'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function TableBoard({ ...arg }) {


    const playerList = ['P1', 'P2']
    const boardPattern =
        [[1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1]];

    const [selectedCell, setSelectedCell] = useState(new Coor(-1, -1));
    const [board, setBoard] = useState([[0]]);
    const [phase, setPhase] = useState(Phase.IDLE);
    const [checkers, setCheckers] = useState([new Checker('', 0, new Coor(-1, -1))]);

    const turnNum = useRef<number>(0);
    const [forceMoveList, setforceMoveList] = useState<Coor[]>([]);


    useEffect(() => {
        setBoard(initBoard());
        setCheckers(initChecker());
    }, []);

    useEffect(() => {
        const forceMoveArr: Coor[] = [];
        setCheckers(prev => {
            prev.map((a, aId) => {
                if (a.active == true) {
                    const tempPath: MoveInfo[] = [];
                    a.movePatterns.map(it =>
                        getPossibleMove(board, a.coor, it.dir, it.len).map(res => tempPath.push(res)))
                    a.possiblePath = (tempPath.find(b => b.killFlg == true) != undefined) ?
                        tempPath.filter(b => b.killFlg == true) : tempPath;
                }
                return a;
            })

            prev.filter(it =>
                it.active == true &&
                it.ownerId == playerList[turnNum.current % playerList.length] &&
                (it.possiblePath.find(b => b.killFlg == true) != undefined)
            ).map(a => forceMoveArr.push(a.coor))
            return prev;
        });
        setforceMoveList(forceMoveArr);

    });

    function initBoard() {
        const arrRow = [];
        let cnt = 0;
        for (let i = 0; i < 8; i++) {
            const arrCol = [];
            for (let j = 0; j < 8; j++) {
                if (boardPattern[i][j] == 1 && (i < 2 || i > 5)) {
                    arrCol.push(cnt);
                    cnt++;
                }
                else { arrCol.push(-1); }
            }
            arrRow.push(arrCol);
        }
        return arrRow;
    }

    function initChecker() {
        let cnt = 0;
        const ck = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (boardPattern[i][j] == 1) {
                    if (i < 2) {
                        ck.push(new Checker('P1', 0,
                            new Coor(i, j)));
                        cnt++;
                    }
                    if (i > 5) {
                        ck.push(new Checker('P2', 1,
                            new Coor(i, j)));
                        cnt++;
                    }
                }
            }
        }
        return ck;
    }

    function onSelectChecker(rowIdx: number, colIdx: number) {
        const ckId = board[rowIdx][colIdx];
        if (board[rowIdx][colIdx] === -1) return;
        if (checkers[board[rowIdx][colIdx]].ownerId != playerList[turnNum.current % playerList.length]) return;
        if (forceMoveList.length > 0) {
            if (forceMoveList.find(a => a.row == rowIdx && a.col == colIdx) == undefined) return;
        }
        setSelectedCell(new Coor(rowIdx, colIdx));
        setPhase(Phase.SELECTED);
    }

    function onMoveChecker(rowIdx: number, colIdx: number) {
        if (boardPattern[rowIdx][colIdx] !== 1) return;
        const ckId = board[selectedCell.row][selectedCell.col];
        const movement = checkers[ckId].possiblePath.find(a => a.dest.row == rowIdx && a.dest.col == colIdx);
        if (movement == undefined) return;

        if (movement.killFlg == true) {
            //try to use tempBoard to find if it is chainable move
            const chainMoves: MoveInfo[] = [];
            const tempBoard: number[][] = [];
            board.forEach(a => {
                const r: number[] = [];
                a.forEach(b => {
                    r.push(b);
                })
                tempBoard.push(r);
            })
            tempBoard[rowIdx][colIdx] = tempBoard[selectedCell.row][selectedCell.col];
            tempBoard[selectedCell.row][selectedCell.col] = -1;
            tempBoard[movement.kill.row][movement.kill.col] = -1;
            checkers[ckId].movePatterns.map(it =>
                getPossibleMove(tempBoard, new Coor(rowIdx, colIdx), it.dir, it.len).filter(a => a.killFlg == true).map(res =>
                    chainMoves.push(res)));

            //set State
            if (chainMoves.length > 0 &&
                !(checkers[ckId].type == 0 && rowIdx == 7 && checkers[ckId].level == 1) &&
                !(checkers[ckId].type == 1 && rowIdx == 0 && checkers[ckId].level == 1)
            ) {
                setPhase(Phase.CHAINMOVE);
            }
            else {
                if (checkers.filter(it => it.ownerId != playerList[turnNum.current % playerList.length] &&
                    it.active === true).length == 1) {
                    setPhase(Phase.GAMEOVER);
                }
                else {
                    setPhase(Phase.IDLE);
                    turnNum.current += 1;
                }

            }

            const KilledCkId = board[movement.kill.row][movement.kill.col];
            const checkersTemp = checkers;
            checkersTemp[ckId].coor = new Coor(rowIdx, colIdx);
            checkersTemp[ckId].possiblePath = chainMoves;
            checkersTemp[KilledCkId].active = false;
            if (checkersTemp[ckId].type == 0 && rowIdx == 7) { checkersTemp[ckId].LevelUp(); }
            else if (checkersTemp[ckId].type == 1 && rowIdx == 0) { checkersTemp[ckId].LevelUp(); }
            setCheckers(checkersTemp);

            const boardTemp = board;
            boardTemp[rowIdx][colIdx] = boardTemp[selectedCell.row][selectedCell.col];
            boardTemp[selectedCell.row][selectedCell.col] = -1;
            boardTemp[movement.kill.row][movement.kill.col] = -1;
            setBoard(boardTemp);
        }
        else { //normal move


            if (checkers[ckId].type == 0 && rowIdx == 7) { checkers[ckId].LevelUp(); }
            else if (checkers[ckId].type == 1 && rowIdx == 0) { checkers[ckId].LevelUp(); }

            checkers[ckId].coor = new Coor(rowIdx, colIdx);
            setCheckers(checkers);


            board[rowIdx][colIdx] = board[selectedCell.row][selectedCell.col];
            board[selectedCell.row][selectedCell.col] = -1;
            setBoard(board);

            setPhase(Phase.IDLE);
            turnNum.current += 1;
        }
        setSelectedCell(new Coor(rowIdx, colIdx));
    }

    function onHandleClick(rowIdx: number, colIdx: number) {
        switch (phase) {

            case (Phase.IDLE):
                onSelectChecker(rowIdx, colIdx);
                break;

            case (Phase.SELECTED):
                if (board[rowIdx][colIdx] !== -1) {
                    onSelectChecker(rowIdx, colIdx);
                    return;
                }
                onMoveChecker(rowIdx, colIdx);
                break;

            case (Phase.MOVE):
                break;


            case (Phase.CHAINMOVE):
                onMoveChecker(rowIdx, colIdx);
                break;
        }

    }

    //bind with board & boardPattern
    //function getPossibleMove(cPosX: number, cPosY: number, dirX: number, dirY: number, moveLen: number) {
    function getPossibleMove(bd: number[][], origin: Coor, dir: Coor, moveLen: number) {
        const pList = []; // possible move list
        let destroyCkR = -1;
        let destroyCkC = -1;
        for (let i = 1; i <= moveLen; i++) {
            const searchR = origin.row + (dir.row * (i));
            const searchC = origin.col + (dir.col * (i));

            if (searchR < 0 || searchC < 0) continue;
            if (bd.length <= searchR || bd[0].length <= searchC) continue;
            if (bd[searchR][searchC] != -1) {
                //if searching found his/her own checker.
                if (checkers[bd[origin.row][origin.col]].ownerId ==
                    checkers[bd[searchR][searchC]].ownerId) {
                    break;
                }
                //if searching found opponent checker.
                else {
                    //if behind this opponent checker is movable then it is the last tile to find.
                    const nextIdxR = origin.row + (dir.row * (i + 1));
                    const nextIdxC = origin.col + (dir.col * (i + 1));

                    if (nextIdxR < 0 || nextIdxC < 0) break;
                    if (bd.length <= nextIdxR || bd[0].length <= nextIdxC) break;
                    if (bd[nextIdxR][nextIdxC] != -1) break;
                    //if the next tile of found checker is empty then push it to array.
                    destroyCkR = searchR;
                    destroyCkC = searchC;
                    //pList.push([nextIdxR, nextIdxC, destroyCkR, destroyCkC]);
                    pList.push(new MoveInfo(new Coor(nextIdxR, nextIdxC), new Coor(destroyCkR, destroyCkC)));
                    break;
                }
            }
            pList.push(new MoveInfo(new Coor(searchR, searchC), new Coor(destroyCkR, destroyCkC)));
            //pList.push([searchR, searchC, destroyCkR, destroyCkC]);
        }
        return pList;
    }


    function cellClassStyle(rowIdx: number, colIdx: number) {
        let cName = 'checkerTd';
        if (phase == Phase.IDLE) {
            if (forceMoveList.find(a => a.row == rowIdx && a.col == colIdx) != undefined) cName += ' forceMoveTile'
        }
        if (phase == Phase.SELECTED || phase == Phase.CHAINMOVE) {
            if (selectedCell.row == rowIdx && selectedCell.col == colIdx) cName += ' active';
            else {
                const ckId = board[selectedCell.row][selectedCell.col];
                if (checkers[ckId].possiblePath.find(a => a.dest.row == rowIdx && a.dest.col == colIdx) != undefined) cName += ' highlightMoveTile';
                else if (checkers[ckId].possiblePath.find(a => a.kill.row == rowIdx && a.kill.col == colIdx) != undefined) cName += ' highlightOpponent';
            }
        }
        if (phase == Phase.GAMEOVER) {
            cName += ' unmoveableT';
            //if (selectedCell.row == rowIdx && selectedCell.col == colIdx) cName += ' active';
        }

        return cName;
    }
    return (
        <>{(phase != Phase.GAMEOVER) ? 
            'TURN : ' + (turnNum.current % 2 == 0 ? 'P1' : 'P2') :
            (turnNum.current % 2 == 0 ? 'P1' : 'P2') + ' WINS!!'}
            <table>
                {
                    board.map((r, rId) => {
                        return (<tr key={rId}>
                            {
                                r.map((c, cId) => {
                                    return ((boardPattern[rId][cId] == 1) ?
                                        <td key={cId} onClick={(e) => onHandleClick(rId, cId)} className={cellClassStyle(rId, cId)}>
                                            {(board[rId][cId] != -1) ? checkers[board[rId][cId]].label : ''}
                                        </td>
                                        : <td key={cId} onClick={(e) => onHandleClick(rId, cId)} className={'checkerTd unmoveableT'}> </td>)
                                })
                            }
                        </tr>);
                    })
                }
            </table></>);
}
class MoveInfo {
    dest: Coor;
    kill: Coor;
    killFlg: boolean
    constructor(_dest: Coor, _kill: Coor) {
        this.dest = _dest;
        this.kill = _kill;

        this.killFlg = (_kill.col >= 0 && _kill.row >= 0) ? true : false;
    }
}

class Coor {
    row: number;
    col: number;
    constructor(_row: number, _col: number) {
        this.row = _row;
        this.col = _col;
    }
}

class ForceMove {
    checkerId: number;
    to: Coor[];
    constructor(_checkerId: number, _to: Coor[]) {
        this.checkerId = _checkerId;
        this.to = _to;
    }
}

class MovePattern {
    dir: Coor;
    len: number;
    constructor(_dir: Coor, _len: number) {
        this.dir = _dir;
        this.len = _len;
    }
}

class Checker {
    ownerId: string;
    movePatterns: MovePattern[];
    coor: Coor;
    possiblePath: MoveInfo[];
    active: boolean
    level: number;
    type: number;
    label: string;
    constructor(_ownerId: string, _type: number, _coor: Coor) {
        this.ownerId = _ownerId;
        this.coor = _coor;
        this.possiblePath = [];
        this.active = true;
        this.level = 1;
        this.type = _type;
        this.label = (_type == 0) ? 'a' : 'b';
        this.movePatterns = (_type == 0) ?
            [
                new MovePattern(new Coor(1, 1), 1),
                new MovePattern(new Coor(1, -1), 1)
            ] :
            [
                new MovePattern(new Coor(-1, 1), 1),
                new MovePattern(new Coor(-1, -1), 1)
            ];
    }
    LevelUp() {
        if (this.level > 1) return;

        this.level = 2;
        this.label = (this.type == 0) ? 'A' : 'B';
        this.movePatterns = [
            new MovePattern(new Coor(1, 1), 8),
            new MovePattern(new Coor(1, -1), 8),
            new MovePattern(new Coor(-1, 1), 8),
            new MovePattern(new Coor(-1, -1), 8)
        ]
    }
}
enum Phase {
    IDLE = 0,
    SELECTED = 1,
    MOVE = 2,
    CHAINMOVE = 3,
    GAMEOVER = 4,
}