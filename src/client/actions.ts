export const ADD_MEMBER = 'ADD_MEMBER';
export const REMOVE_MEMBER = 'REMOVE_MEMBER';
export const CLEAR_MEMBERS = 'CLEAR_MEMBERS';

export const START_SENDING = 'START_SENDING';
export const STOP_SENDING = 'STOP_SENDING';
export const START_RECVING = 'START_RECVING';
export const STOP_RECVING = 'STOP_RECVING';

export const MUTE_MICROPHONE = 'MUTE_MICROPHONE';
export const UNMUTE_MICROPHONE = 'UNMUTE_MICROPHONE';
export const TOGGLE_MICROPHONE = 'TOGGLE_MICROPHONE';

export const SET_TRX_PARAMETERS = 'SET_TRX_PARAMETERS';
export const SET_TRX_INFO = 'SET_TRX_INFO';

export const addMember = (member) => ({
  type: ADD_MEMBER,
  member,
});

export const removeMember = (member) => ({
  type: REMOVE_MEMBER,
  member,
});

export const clearMembers = () => ({ type: CLEAR_MEMBERS });

export const startSending = (id, address = undefined, port = undefined) => ({
  type: START_SENDING,
  id,
  address,
  port,
});

export const stopSending = (id) => ({ type: STOP_SENDING, id });

export const startRecving = (id, port = undefined) => ({
  type: START_RECVING,
  id,
  port,
});

export const stopRecving = (id) => ({ type: STOP_RECVING, id });

export const muteMicrophone = () => ({ type: MUTE_MICROPHONE });
export const unmuteMicrophone = () => ({ type: UNMUTE_MICROPHONE });
export const toggleMicrophone = () => ({ type: TOGGLE_MICROPHONE });

export const setTrxInfo = (trxInfo) => ({
  type: SET_TRX_INFO,
  ...trxInfo,
});

export const setTrxParameters = (trxParameters: string) => ({
  type: SET_TRX_PARAMETERS,
  trxParameters,
});
