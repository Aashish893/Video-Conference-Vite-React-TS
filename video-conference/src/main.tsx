import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import { RoomProvider } from "./ReactContexts/RoomConnectContext.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home.tsx";
import RoomDisplay from "./Pages/Room.tsx";
import { UserProvider } from "./ReactContexts/UserContext.tsx";
import { ChatProvider } from "./ReactContexts/ChatContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoomProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/room/:id"
              element={
                <ChatProvider>
                  <RoomDisplay />
                </ChatProvider>
              }
            />
          </Routes>
        </RoomProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
