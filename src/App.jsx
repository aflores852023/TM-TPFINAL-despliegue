import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Workspaces from './Pages/Workspaces' 
import Channels from './Pages/Channels'
import DirectMessages from './Pages/DirectMessages'
import Messages from './Pages/Messages'
import Home from './Pages/Home'
import WorkspacesDetails from './Pages/WorkspacesDetails'
import ChannelDetails from './Pages/ChannelDetails'
import { saveTestDataWorkspaces, saveTestDataMessages, saveTestDataChannels, saveTestDataUsers, saveTestDataDirectMessages } from './helpers/testdata'
import { users, workspaces, channels, messages, directMessages } from '../src/data/data.js'
import NewWorkspaces from './Pages/NewWorkspaces.jsx'
import NotFound from './Pages/404NotFound.jsx'
import Register from './screems/Register/Register.jsx'
import Login from './screems/Login/Login.jsx'
import Verify from './screems/Verify/Verify.jsx'
import ResetPassword from './screems/ResetPassword/ResetPassword.jsx'
import ForgotPassword from './screems/ForgotPassword/ForgotPassword.jsx'

function App() {

  /*
  saveTestDataWorkspaces(workspaces) // inicializa los datos de los espacios de trabajo
  saveTestDataMessages(messages) // inicializa los datos de los mensajes
  saveTestDataChannels(channels) // inicializa los datos de los canales
  saveTestDataUsers(users) // inicializa los datos de los usuarios
  saveTestDataDirectMessages(directMessages) // inicializa los datos de los mensajes directos
*/

  return (
    // <Route> siempre esta contenido dentro de Routes
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/forgot-password'element={<ForgotPassword/>}/>
      <Route path="/reset-password/:reset_token" element={<ResetPassword />} />
      <Route path ='/Channels:workspace_id' element={<Channels/>}/>
      <Route path ='/DirectMessages' element={<DirectMessages/>}/>
      <Route path ='/Messages' element={<Messages/>}/>
      <Route path='/Workspaces/:workspace_id' element={<WorkspacesDetails />} />
      <Route path ='/Workspaces' element={<Workspaces />} />
      <Route path ='/Channels' element={<Channels />} />
      <Route path = '/ChannelDetails/:channel_id' element={<ChannelDetails/>} />      
      <Route path ='/Workspaces/New' element={<NewWorkspaces/>} />
      <Route path ='/Home' element={<Home/>} />
      <Route path ='/404NotFound' element={<NotFound/>} />
      <Route path="/verify" element={<Verify />} />



    </Routes>
  )

}
export default App


