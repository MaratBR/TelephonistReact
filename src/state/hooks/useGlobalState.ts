import state from "state";

export function useGlobalState() {
  return state;
}

export function useHub() {
  return useGlobalState().ws.client;
}
