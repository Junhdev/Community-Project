import axios from 'axios';

export const MODAL_CENTER_TOP = '50%';
export const MODAL_CENTER_LEFT = '50%';
export const MODAL_CENTER_TRANSFORM = 'translate(-50%, -50%)';

export const FRIEND_REQUEST_ACTION = {
    ACCEPT: axios.patch,
    REJECT: axios.delete,
  };