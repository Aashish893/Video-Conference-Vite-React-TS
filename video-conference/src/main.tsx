import ReactDOM from 'react-dom/client'
import React from 'react'
import './index.css'
import { RoomProvider } from './ReactContexts/RoomConnectContext.tsx'
import { BrowserRouter,Route, Routes } from 'react-router-dom'
import { Home } from './Pages/Home.tsx';
import RoomDisplay from "./Pages/Room.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/"  element={<Home/>}  />
          <Route path="/room/:id"  element={<RoomDisplay/>}  />
        </Routes>
      </RoomProvider>
    </BrowserRouter>    
  </React.StrictMode>
)
