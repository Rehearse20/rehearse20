const dgram = require('dgram');

class UdpEchoServer {
  constructor() {
    this.socket = dgram.createSocket('udp4');

    this.socket.on('listening', () => {
      const props = this.socket.address();
      console.log(`Listening on ${props.address}:${props.port}`);
    });

    this.socket.on('message', (message, remote) =>
      this.echoBack(message, remote)
    );
  }

  listen(port) {
    this.socket.bind(port);
  }

  echoBack(message, remote) {
    console.log('Data received from client : ' + message.toString());
    this.socket.send(
      new Buffer(`udp://${remote.address}:${remote.port}`),
      remote.port,
      remote.address,
      (error) => {
        console.log(`UDP message sent to ${remote.address}:${remote.port}`);
      }
    );
  }
}

module.exports = UdpEchoServer;