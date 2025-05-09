import {getSocket} from './Socket'; // your socket init file

class SocketManager {
  constructor() {
    this.socket = getSocket();
    this.listeners = new Map();
  }

  emit(event, data, ackCallback) {
    if (!this.socket) {
      console.warn(`Socket not initialized - cannot emit ${event}`);
      return;
    }
    this.socket.emit(event, data, ackCallback);
  }

  on(event, callback) {
    if (!this.socket) {
      console.warn(`Socket not initialized - cannot listen to ${event}`);
      return;
    }
    this.off(event);
    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  off(event) {
    if (!this.socket) return;
    const callback = this.listeners.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  offAll() {
    if (!this.socket) return;
    for (let [event, callback] of this.listeners) {
      this.socket.off(event, callback);
    }
    this.listeners.clear();
  }
}

const socketManager = new SocketManager();
export default socketManager;
