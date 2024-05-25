// Code Stuff
import {useNavigate} from 'react-router-dom'
import {useRef, useState, useEffect} from 'react';
import {SubmitLoginInfo} from './interceptors';
import {DisplaySuccess, DisplayError} from './notifications';

// Graphics
import logo from'./logo.png';

// Remove all info from local storage
function removeStoredData(){
  localStorage.removeItem('loginEmail');
  localStorage.removeItem('loginPassword');
  localStorage.removeItem('accessToken');
}

// =======================
// Our main function here
// -----------------------
export default function Login() {

  function LoginProcess(email:string, password:string) {
      const data = ValidateFields(email, password);
      if (data.email.length > 0 && data.password.length > 0 ){
          SubmitLoginInfo(data.email, data.password);
      }
  }

  // State variables for validation purposes
  const [hasErrorEmail, setHasErrorEmail] = useState(false);
  const [hasErrorPassword, setHasErrorPassword] = useState(false);
  const [errorEmailMsg, setHasErrorEmailMsg] = useState('');
  const [errorPasswordMsg, setHasErrorPasswordMsg] = useState('');

  // Should we be here at this page?
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  useEffect(() => {
    if (accessToken) {
      navigate('/profile');
    }
  }, []);

  // Check wheter our fields hava valid data
  function ValidateFields(email:string, password:string)  {

    // Check email
    const emailString = email.trim();
    let hasError = false;

    if (emailString.length === 0) {
      DisplayError('Email required!');
      removeStoredData();
      setHasErrorEmail(true);
      setHasErrorEmailMsg('Email field can\'t be empty!');
      hasError = true;
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailString)) {
      DisplayError('This email is invalid!');
      setHasErrorEmail(true);
      setHasErrorEmailMsg('Email field has an invalid format!');
      removeStoredData();
      hasError = true;
    } else {
      setHasErrorEmail(false);
      localStorage.setItem('loginEmail', email);
    }

    // Check password
    const passwordString = password.trim();
    if (passwordString.length === 0) {
      DisplayError('Password required!');
      setHasErrorPassword(true);
      setHasErrorPasswordMsg('Password field can\'t be empty!');
      localStorage.removeItem('loginPassword');
      hasError = true;
    }
    else   if (passwordString.length < 8) {
      DisplayError('Password must be 8 characters or longer!');
      setHasErrorPassword(true);
      setHasErrorPasswordMsg('Password field need at least 8 characters!');
      localStorage.removeItem('loginPassword');
      hasError = true;
    }

    // Data is okay... Probably
    if (!hasError) {
      localStorage.setItem('loginPassword', password);
      return {email: email, password: password};
    }
    return {email: '', password: ''};
  };

  // Handle Login button
  function handleClick() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    LoginProcess(email, password);
  }

  const handleKeys = (event:any) => {
    if (event.target.id === 'email') {
      switch (event.key.toLowerCase()) {
        case 'enter': case 'arrowdown':
          passwordRef.current.focus();
          event.preventDefault();
          break;
      } // end switch
    } else if (event.target.id === 'password') {
      switch (event.key.toLowerCase()) {
        case 'arrowup':
          emailRef.current.focus();
          event.preventDefault();
          break;
        case 'arrowdown':
          signInRef.current.focus();
          event.preventDefault();
          break;
        case 'enter':
          signInRef.current.focus();
          handleClick();
          event.preventDefault();
          break;
      } // end switch
    } else if (event.target.id === 'signIn'){
      if (event.key.toLowerCase() === 'arrowup') {
        passwordRef.current.focus();
        event.preventDefault();
      }
    }
  };

  // Clear our controls from error state if text changes
  function handleEmailChange(){setHasErrorEmail(false);}
  function handlePasswordChange(){setHasErrorPassword(false);}

  // Our stuff we will need real soon
  let emailRef = useRef<HTMLInputElement>(null!);
  let passwordRef = useRef<HTMLInputElement>(null!);
  let signInRef = useRef<HTMLInputElement>(null!);
  const [email, setEmail] = useState(localStorage.getItem('loginEmail')||'');
  const [password, setPassword] = useState(localStorage.getItem('loginPassword')||'');

  // Set page title here, just in case
  useEffect(() => {
    document.title = 'B2Bit Login Screen Challenge';
  }, []);

  // Let's render the page
  return (
    <div className='Login-Box'>
      <img src={logo} className='App-logo' alt='logo' />
      <br/><br/>
      <label className='Login-Label'>E-mail</label>
      <input type='email' id='email' className='Login-Texts' ref={emailRef}
          onInput={handleEmailChange} onKeyDown={handleKeys}
          style={{border: hasErrorEmail ? 'solid 2px red':'0'}} defaultValue={email} required/>
      <a className='Login-Error' id='error-email'
          style={{display: hasErrorEmail ? 'inline': 'none'}}>{errorEmailMsg}</a>
      <br/>
      <label className='Login-Label'>Password</label>
      <input type='password' id='password' className='Login-Texts' ref={passwordRef}
          onInput={handlePasswordChange} onKeyDown={handleKeys}
          style={{border: hasErrorPassword ? 'solid 2px red':'0'}} defaultValue={password} required/>
      <a className='Login-Error' id='error-password'
          style={{display: hasErrorPassword ? 'inline':'none'}}>{errorPasswordMsg}</a>
      <br/><br/>
      <input type='button' id='signIn' className='Login-Button' value='Sign In'
          ref={signInRef} onClick={handleClick} onKeyDown={handleKeys} />
    </div>
  );
}