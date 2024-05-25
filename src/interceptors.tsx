// Code stuff
import axios from 'axios';
import {DisplaySuccess, DisplayError} from './notifications';

// Graphics
import emptyAvatar from'./empty_avatar.png';

const axiosInstance = axios.create({
  baseURL: '(((REMOVIDO)))', 
  headers: {
    'Accept': 'application/json;version=v1_web',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        DisplayError('Error: Couldn\'t login, please verify your credentials and try again!');
      } else if (status >= 400 && status < 500) {
        DisplayError(`Error: Client Error Number ${status}`);
      } else if (status >= 500 && status < 600) {
        DisplayError(`Error: Server Error Number ${status}`);
      } else {
        DisplayError(`Error: Unexpected Error Number ${status}`);
      }
    } else {
      DisplayError(`Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export async function SubmitLoginInfo(email: string, password: string): Promise<void> {
  try {
    const response = await axiosInstance.post('login/', {email, password});
    const json = response.data;
    if (json.tokens && json.tokens.access) {
      localStorage.setItem('accessToken', json.tokens.access);
      window.location.assign('./profile?login=success');   
    } else {
      DisplayError('Error: Failed to obtain access tokens!');
    }
  } catch (error){
    // Free from error handling here!
  }
}

export async function GetProfileData(
  setInfoName: (name: string) => void,
  setInfoEmail: (email: string) => void,
  setInfoAvatar: (avatar: string) => void,
): Promise<void> {

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    DisplayError('Error: Invalid access token!');
    return;
  }

  try {
    const response = await axiosInstance.get('profile/');
    const data = response.data;
    if (data) {
      setInfoName(data.name || '(No Username)');
      setInfoEmail(data.email || '(No Email)');
      setInfoAvatar(data.avatar.low || emptyAvatar);
      document.title = (data.name ||'(No Username)') +'\'s Profile';
    } else {
      DisplayError('Error: Failed to fetch user data!');
    }
  } catch (error) {
    // Free from error handling here!
  }
}

