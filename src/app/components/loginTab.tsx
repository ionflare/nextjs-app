'use client'
import React, { useEffect, useRef } from 'react';
import { useAppActions, useAppState } from './AppContext';
import { EVCODE } from './WebSock';


export function LoginTab({ ...arg }) {
  const refInputId = useRef<HTMLInputElement>(null);
  const refInputPwd = useRef<HTMLInputElement>(null);
  const { signIn, signOut, setWsEvent, setWsLoader } = useAppActions();
  const { user } = useAppState();

  useEffect(() => {
    // Read-only; for HttpOnly cookies this will be EMPTY by design.
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='))
      ?.split('=')[1] ?? null;
    console.log("cookie : " + value);
    if (!!value) { 
      setTimeout(()=>{onCookieLogin(value) }, 1000);
    };
  }, []);


  async function onLogin() {
    const res = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: refInputId.current?.value, pwd: refInputPwd.current?.value }),
    });
    if (res.ok == true) {
      await res.json().then((x) => {
        signIn({ id: x.data.userId, name: x.data.userId });
        setWsEvent({ evName: EVCODE.REQ_UPSOCKET, data: {} });
        if (x.data.roomId != undefined) {
          setWsEvent({ evName: EVCODE.REQ_JOINROOM, data: { id: x.data.roomId } });
        }
      })
    }
  }

  async function onCookieLogin(authCookie: string) {
    const res = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: authCookie, pwd: authCookie }),
    });
    if (res.ok == true) {
      await res.json().then((x) => {
        console.log("xxx", x.body);
        signIn({ id: x.data.userId, name: x.data.userId });
        //window.location.reload();
        setWsEvent({ evName: EVCODE.REQ_UPSOCKET, data: {} });
        if (x.data.roomId != undefined && x.data.roomId != null) {
          setWsEvent({ evName: EVCODE.REQ_JOINROOM, data: { id: x.data.roomId } });
        }
        if (x.data.gameId != undefined && x.data.gameId != null) {
          //setWsEvent({ evName: EVCODE.REQ_JOINROOM, data: { id: x.data.roomId } });
        }
      })
    }
  }

  function onLogout() {
    document.cookie = [
      'auth=',
      'Max-Age=0',           // or: expires=Thu, 01 Jan 1970 00:00:00 GMT
      'path=/',              // MUST match how it was set
      // 'domain=.yourdomain.com', // include if it was set with a domain
      // 'Secure',                    // include if it was set with Secure
      // 'SameSite=Lax',              // optional; match if needed
    ].join('; ');
    signOut();
    window.location.reload();
  }

  return (<>
    {(user != null) ? (<div>
      <span>Welcome,      {user.name}       </span>
      <button style={{ backgroundColor: "orange" }} onClick={() => onLogout()}>Logout</button>
    </div>) :
      (<div>
        <span> Guest</span >
        <input name="input_id" style={{ backgroundColor: 'beige' }} ref={refInputId} type="text" />
        <input name="input_pwd" style={{ backgroundColor: "green" }} ref={refInputPwd} type="password" />
        <button style={{ backgroundColor: "orange" }} onClick={() => onLogin()}>Login</button>
      </div>)}
  </>);
}
