'use client'
//import ws from './modules/socket'
import { useEffect } from "react";
// import { ws } from "./modules/socket";
import { GmHod } from "./game/GmHod";
import { appInfo } from "./modules/appInfo";
import { GmApp } from "./components/GmApp";
import { AppProvider } from "./components/AppContext";
import { Header } from "./components/Header";
import { WebSock } from "./components/WebSock";
import { GbChatBox } from "./components/GbChatBox";
import { LoginTab } from "./components/loginTab";
import { StatusBox } from "./components/StatusBox";
export default function Home() {

  useEffect(() => {
    //ws.init();
    //appInfo.init();
  }, [])

  return (
    <AppProvider>
      <Header></Header>
      <LoginTab></LoginTab>
      <WebSock></WebSock>
      <StatusBox></StatusBox>
      <GmApp></GmApp>

      {/* <GmHod></GmHod> */}
      <GbChatBox></GbChatBox>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">


        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        </footer>
      </div>
    </AppProvider>
  );



}
