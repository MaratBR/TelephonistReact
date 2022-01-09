import { autorun } from "mobx";
import AuthState from "./auth";
import { WSState } from "./ws";

export class RootState {
  auth: AuthState;
  ws: WSState;

  constructor() {
    this.auth = new AuthState();
    this.ws = new WSState(this.auth);
  }
}

const state = new RootState();
export default state;
