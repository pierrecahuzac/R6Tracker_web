import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'


import NewGame from './pages/newGame'
import Signin from './pages/signin'
import Signup from './pages/signup'
import Stats from './pages/stats'
import Maps from './pages/maps'
import Operator from './pages/operator'
import SideChoice from './pages/sideChoice'
import Round from './pages/round'
import PasswordForgot from './pages/passwordForgot'
import { ToastContainer } from 'react-toastify'
import EndGame from './pages/endGame'

import './styles/App.css'
import Player from './pages/player'

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newGame" element={<NewGame />} />
        {/* <Route path="/profil/:playerId" element={<NewGame />} /> */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stats" element={<Stats />} />
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
