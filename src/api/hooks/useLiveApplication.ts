import { models } from "api";
import { LiveValue, useLiveValue } from "core/hooks";
import { useHub } from "state/hooks";
import useApi from "./useApi";

export default function useLiveApplication(id: string): LiveValue<models.ApplicationView> {
  const api = useApi();
  const hub = useHub();

  return useLiveValue(
    undefined,
    () => api.getAppliction(id).then((r) => r.app),
    ({ set }) => {
      const subscription = hub.addEntryListener("application", id, (update) => {
        set((oldValue) => ({ ...oldValue, ...update.entry }));
      });
      return () => subscription.unsubscribe();
    },
  );
}
