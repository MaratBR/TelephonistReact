import Card from "@components/Card";
import S from "./PopupDialog.module.scss";

type PopupDialogProps = React.PropsWithChildren<{
  closeable?: boolean;
  onClose?: () => void;
  closed?: boolean;
}>;

export default function PopupDialog(props: PopupDialogProps) {
  // TODO: complete this component
  return (
    <div className={S.root}>
      <div className={S.body}>
        <Card>{props.children}</Card>
      </div>
    </div>
  );
}
