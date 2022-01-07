import { API_URL } from "./client";

type ReconnectStrategy = (attempt: number) => number

const defaultReconnectStrategy: ReconnectStrategy = attempt => 1000 * ([1, 5, 5, 10, 10, 10, 20, 20, 30, 30][attempt - 1] ?? 30)

type WSOptions = {
  reconnectStrategy: (attempt: number) => number
}

function fillOptions(opts: Partial<WSOptions>): WSOptions {
  return {
    reconnectStrategy: defaultReconnectStrategy,
    ...opts
  }
}

class WSClient {
  private _ws: WebSocket;
  private _disposing: boolean = false
  private _opts: WSOptions
  private _reconnectionAttempt: number = 0
  private _reconnectionTimeout
  private _path: string

  constructor(path: string, options?: Partial<WSOptions>) {
    if (path.startsWith("/"))
      path = path.substring(1)
    this._path = path
    this._opts = fillOptions(options)
  }

  private _connect() {
    if (this._ws && this._ws.readyState != WebSocket.CLOSED)
      throw new Error("WS is already open")
    
    this._ws = new WebSocket(API_URL + this._path);
    this._ws.addEventListener("close", () => this._onClose())
    this._ws.addEventListener("message", this._onMessage.bind(this)))
  }

  private _clearSocket() {
    delete this._ws
  }

  private _onMessage(event: MessageEvent) {
    if (typeof event.data === "string") {
      let data
      try {
        data = JSON.parse(event.data)
      } catch {
        return
      }

      console.log(data)
    }
  }

  private _onClose() {
    this._clearSocket()
    this._reconnectionAttempt++
    const timeout = this._opts.reconnectStrategy(this._reconnectionAttempt)
    if (this._reconnectionTimeout)
      clearTimeout(this._reconnectionTimeout)
    setTimeout(() => {
      this._connect()
    }, timeout)
  }

  close() {
    this._disposing = true
    this._ws.close()
  }
}
