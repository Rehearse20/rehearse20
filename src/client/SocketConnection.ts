import * as dgram from 'dgram';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';

import DummyStreamer from './DummyStreamer';
import TrxStreamer from './TrxStreamer';
import * as actions from './actions';

const SOCKET_SERVER = 'http://149.210.193.195:3000'; // rehearse20.sijben.dev
// const SOCKET_SERVER = 'http://192.168.2.6:3000'; // Ronald lokaal

const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
const sessionId = urlParams.get('sessionId') || 'default';
const startPort = 51352 + Math.floor(Math.random() * 1000);

const isPortFree = async (port) => {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');
    socket.on('listening', () => {
      socket.close();
      resolve(true);
    });
    socket.on('error', () => {
      socket.close();
      resolve(false);
    });
    socket.bind({ port, exclusive: true });
  });
};

let nextFreePort = startPort;
const getFreePort = async (): Promise<number> => {
  return new Promise(async (resolve) => {
    let port;
    do {
      port = nextFreePort;
      nextFreePort += 2; // RTP uses the +1 port too
    } while (!(await isPortFree(port)));
    resolve(port);
  });
};

const ports = new Map<number, number>();

const SocketConnection = (props) => {
  const dispatch = useDispatch();
  const volume = useSelector((state) => state.volume);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = subscribeToSocket();
    setSocket(socket);
    const unsubscribeBeforeUnload = (event) => {
      event.preventDefault();
      unsubscribeFromSocket(socket);
    };
    window.addEventListener('beforeunload', unsubscribeBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', unsubscribeBeforeUnload);
      unsubscribeFromSocket(socket);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('mute microphone', { isMuted: volume.isMuted });
    }
  }, [volume.isMuted]);

  const subscribeToSocket = () => {
    const socket = io(SOCKET_SERVER, { transports: ['websocket'] });
    const streamer = new DummyStreamer();

    socket.on('connect', async () => {
      console.log('connected');
      socket.emit('identify', { name, sessionId }, (currentMembers) => {
        // console.log('currentMembers', currentMembers);
        dispatch(actions.clearMembers());
        currentMembers.forEach((member) => dispatch(actions.addMember(member)));
        socket.emit('start streaming');
      });
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      streamer.stop();
    });

    socket.on('chat message', (msg) => console.log('message:', msg));
    socket.on('user joined', ({ id, name }) => {
      console.log('user joined:', name, id);
      dispatch(actions.addMember({ id, name }));
    });
    socket.on('user left', ({ id, name }) => {
      console.log('user left:', name, id);
      dispatch(actions.removeMember({ id, name }));
    });

    socket.on('start sending', async ({ id, address, port, ssrc }) => {
      console.log(
        `starting to send to ${id} on ${address}:${port} with ${ssrc}`
      );
      let localPort = ports.get(ssrc);
      if (!localPort) {
        localPort = await getFreePort();
        ports.set(ssrc, localPort);
      }
      streamer.startSending(id, localPort, address, port, ssrc);
      dispatch(actions.startSending(id, address, port));
    });

    socket.on('stop sending', ({ id, address }) => {
      console.log(`stop sending to ${id} on ${address}`);
      streamer.stopSending(id, address);
      dispatch(actions.stopSending(id));
    });

    return socket;
  };

  const unsubscribeFromSocket = (socket) => {
    socket.disconnect();
  };

  return null; // no UI to render here
};

export default SocketConnection;
