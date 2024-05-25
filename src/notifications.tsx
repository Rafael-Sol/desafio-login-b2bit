// Code stuff
import {toast} from 'react-toastify';

// Let's have some toast!
export function DisplaySuccess(message:string) {
  toast.success(message, 
    { className: 'Notification' }
  );
}

export function DisplayError(message:string) {
  toast.error(message, 
    { className: 'Notification' }
  );
  console.log(message);
}