import { ChildProcess, execFile } from 'child_process';
import * as path from 'path';
import * as dgram from 'dgram';

interface StreamerData {
  child: ChildProcess;
  timer: NodeJS.Timeout;
  localPort: number;
  remoteAddress: number;
  remotePort: number;
  ssrc: Number;
}

class DummyStreamer {
  ticker: NodeJS.Timeout;
  streamers: Map<string, StreamerData>;

  constructor() {
    this.streamers = new Map();
  }

  startSending(id, localPort, remoteAddress, remotePort, ssrc, extra = '') {
    const child = this.trx(localPort, remoteAddress, remotePort, ssrc, extra);
    child.on('close', (code) => {
      console.log(`trx exited with code ${code}`);
      // console.log('streamers:', this.streamers.keys());
    });
    const timer = setInterval(() => child.kill('SIGUSR1'), 5000);
    this.streamers.set(id, {
      child,
      timer,
      localPort,
      remoteAddress,
      remotePort,
      ssrc,
    });
    // console.log('streamers:', this.streamers.keys());
  }

  stopSending(id, address?) {
    const streamer = this.streamers.get(id);
    this.streamers.delete(id);
    if (streamer) {
      if (streamer.child) {
        streamer.child.kill();
      }
      if (streamer.timer) {
        clearTimeout(streamer.timer);
      }
    } else {
      console.log('??? No trx child?');
    }
  }

  stop() {
    this.streamers.forEach((streamer, id) => {
      this.stopSending(id);
    });
  }

  restart(extraParams: string) {
    // need to make shallow copy first :/
    [...this.streamers.entries()].forEach(([id, streamer]) => {
      this.stopSending(id);
      this.startSending(
        id,
        streamer.localPort,
        streamer.remoteAddress,
        streamer.remotePort,
        streamer.ssrc,
        extraParams
      );
    });
  }

  trx(localPort, remoteAddress, remotePort, ssrc, extra) {
    // console.log('node', [
    //   path.join(__dirname, 'trx', 'dummy_trx.js'),
    //   localPort,
    //   remoteAddress,
    //   remotePort,
    //   ssrc,
    // ]);
    // const child = spawn('node', [
    //   path.join(__dirname, 'trx', 'dummy_trx.js'),
    //   localPort,
    //   remoteAddress,
    //   remotePort,
    //   ssrc,
    // ]);
    console.log(
      path.join(__dirname, 'trx', 'trx'),
      [
        '-p',
        localPort,
        '-h',
        remoteAddress,
        '-s',
        remotePort,
        '-S',
        ssrc,
        ...extra.split(' '),
      ].join(' ')
    );
    // https://www.electronjs.org/docs/tutorial/application-packaging#executing-binaries-inside-asar-archive
    // only execFile is supported to execute binaries inside asar archive.
    const child = execFile(path.join(__dirname, 'trx', 'trx'), [
      '-p',
      localPort,
      '-h',
      remoteAddress,
      '-s',
      remotePort,
      '-S',
      ssrc,
      ...extra.split(' '),
    ]);
    child.stdout.on('data', (data) => console.log(data.toString()));
    child.stderr.on('data', (data) => console.error(data.toString()));
    return child;
  }
}

export default DummyStreamer;
