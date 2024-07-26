import './App.css'
import React from 'react';
import { BrowserRouter as Router ,Routes ,Route } from 'react-router-dom';

import Process from './pages/ProcessPage/Process';
import Login from './pages/LoginForm/Login';
import PrivateRoute from './components/privateRoute/PrivateRoute';

function App() {
  

  return (
    <section className='home-section'>
      <Router>
        <Routes>
            <Route path='/'>
            <Route path='/' element = {<PrivateRoute/>}>
                 <Route path='/' element = {<Process/> } />
            </Route>
            <Route path='/login' element={<Login/>}/>
            </Route>
            
        </Routes>
       
      </Router>

    </section>
  )
}

export default App
