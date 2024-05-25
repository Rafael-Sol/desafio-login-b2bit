// Code Stuff
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import {DisplaySuccess, DisplayError} from './notifications';
import {toast} from 'react-toastify';
import {GetProfileData} from './interceptors';

// =======================
// Our main function here
// -----------------------
export default function Profile() {
  const [infoName, setInfoName] = useState('');
  const [infoEmail, setInfoEmail] = useState('');
  const [infoAvatar, setInfoAvatar] = useState('');

  // Should we be here at this page?
  const accessToken = localStorage.getItem('accessToken')||'';
  const navigate = useNavigate();
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, []);

  // Handle Logout button
  function handleClick() {
    localStorage.removeItem('accessToken');
    navigate('/login');
    DisplaySuccess('User logout was successful! Good bye!');
  }

  // Display login message once
  const queryParameters = new URLSearchParams(window.location.search)
  const queryType = queryParameters.get('login')
  useEffect(() => {
    const showMessage = (queryType === 'success');
    toast.promise(GetProfileData(setInfoName, setInfoEmail, setInfoAvatar), {
      pending: (showMessage) ? 'Loading user info...' : undefined,
      success: (showMessage) ? 'User login was successful!' : undefined,
      error: 'Error: Error loading user info!',
    }, {className: 'Notification'});
    window.history.replaceState({},'','./profile');
  }, []);

  // It's time to render the page
  return (
    <div className='Profile-Page'>
      <main className='Main-Body'>
        <div className='Profile-Box'>
          <br/><br/>
          <label className='Profile-Avatar-Text'>Profile picture</label>
          <img className='Profile-Picture' src={infoAvatar} />
          <br/><br/>
          <label className='Profile-Text'>Your <strong>Name</strong></label>
          <label className='Profile-Info'>{infoName}</label>
          <br/>
          <label className='Profile-Text'>Your <strong>E-mail</strong></label>
          <label className='Profile-Info'>{infoEmail}</label>
          <br/><br/>
        </div>
      </main>
      <nav className='Navigation-Top'>
        <button id='signIn' className='Logout-Button' onClick={handleClick}>Logout</button>
      </nav>
    </div>
  );
};