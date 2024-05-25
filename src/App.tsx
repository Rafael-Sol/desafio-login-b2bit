
//Code Stuff
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

//Pages
import Login from './login';
import Profile from './profile';

// CSS Stylesheets
import './reset.css';
import './App.css';
// import './ReactToastify.css'; // edited version
import 'react-toastify/dist/ReactToastify.css';

// Main app stuff
export default function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <ToastContainer position='top-center' autoClose={3750}/>
        <Router><Routes>
          <Route path='*' element={<Navigate to='/login' replace />} />
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/profile' element={<Profile/>} />
        </Routes></Router>
      </header>
    </div>
  );
}
