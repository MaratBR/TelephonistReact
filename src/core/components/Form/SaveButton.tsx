import { Button } from "@cc/Button";
import { mdiCheck, mdiClose, mdiContentSave } from "@mdi/js";
import Icon from "@mdi/react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormStatusContext } from "./context";

import S from './SaveButton.module.scss';

export default function SaveButton() {
  const { isSubmitting, error } = useContext(FormStatusContext);
  const { t } = useTranslation();
  // 0 - after first submit, 1 - saving, 2 - saved, 3 - error
  const [state, setState] = useState(0);

  let color = "primary";
  if (state > 1) {
    color = state === 3 ? "danger" : "success";
  }

  useEffect(() => {
    if (isSubmitting) {
      setState(1);
    } else if (!isSubmitting && state === 1) {
      // switches from state 1 to 2 or 3 depending on the error
      setState(2 + +!!error);
      setTimeout(() => setState(0), 2000);
    }
  }, [isSubmitting]);

  let containerClassName = state === 1 ? S.saving : S.save;
  if (state > 1) containerClassName = error ? S.failed : S.saved;
  containerClassName = `${S.container} ${containerClassName}`;

  return (
    <Button
      left={(
        <div className={`${containerClassName} ${S.icon}`}>
          <Icon className={S.save} size={0.9} path={mdiContentSave} />
          <Icon className={S.saved} size={0.9} path={mdiCheck} />
          <Icon className={S.failed} size={0.9} path={mdiClose} />
        </div>
      )}
      color={color}
      type="submit"
    >
      <div className={`${containerClassName} ${S.text}`}>
        <span className={S.save}>{t("save")}</span>
        <span className={S.saving}>{t("saving")}</span>
        <span className={S.saved}>{t("saved")}</span>
        <span className={S.failed}>{t("failed")}</span>
      </div>
    </Button>
  );
}
