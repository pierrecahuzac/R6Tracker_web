import { Route, Routes } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'

import Home from './pages/home'
import Signin from './pages/signin'
import Signup from './pages/signup'
import Stats from './pages/stats'
import Maps from './pages/maps'
import Operator from './pages/operator'
import SideChoice from './pages/sideChoice'
import Round from './pages/round'
import PasswordForgot from './pages/passwordForgot'
import GameModeChoice from './pages/gameModeChoice'
import EndGame from './pages/endGame'
import Player from './pages/player'

import './styles/App.css'


function App() { 

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-mode-choice" element={<GameModeChoice />} />
        {/* <Route path="/profil/:playerId" element={<NewGame />} /> */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stats/:playerId" element={<Stats />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/sideChoice" element={<SideChoice />} />
        <Route path="/round" element={<Round />} />
        <Route path="/password-forgot" element={<PasswordForgot />} />
        <Route path="/end-game" element={<EndGame />} />
        <Route path="/player/:playerId" element={<Player />} />
      </Routes>

    </>
  )
}

export default App
