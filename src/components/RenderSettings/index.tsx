import { JSONSchema7 } from "json-schema";

export type RenderSettingsProps = {
  type?: string | null;
  settings?: Record<string, any>;
};

export default function RenderSettings(props: RenderSettingsProps) {
  return <>{JSON.stringify(props)}</>;
}
