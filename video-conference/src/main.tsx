import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RoomProvider } from './ReactContexts/RoomConnectContext.tsx'
import { BrowserRouter,Route, Routes } from 'react-router-dom'
import { Home } from './assets/Pages/Home.tsx'
import { Room } from './assets/Pages/Room.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/"  element={<Home/>}  />
          <Route path="/room/:id"  element={<Room/>}  />
        </Routes>
      </RoomProvider>
    </BrowserRouter>    
  </React.StrictMode>,
)
