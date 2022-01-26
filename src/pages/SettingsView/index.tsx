import HostSettings from "./HostSettings";

interface SettingsViewProps {
  applicationType: string;
  settings: any;
  editable: boolean;
}

export default function SettingsView(props: SettingsViewProps) {
  switch (props.applicationType) {
    case "host":
      return <HostSettings settings={props.settings} />;
    default:
      return <pre>{JSON.stringify(props.settings, null, 2)}</pre>;
  }
}
