import { mdiContentSave } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { ButtonProps } from "./Button";

type SaveButtonProps = Omit<ButtonProps, "children"> & {children?: React.ReactNode}

export function SaveButton({children, ...props}: SaveButtonProps) {
    const { t } = useTranslation()
    // TODO fix this typing error
    // @ts-ignore
    return <Button loading color="primary" left={<Icon path={mdiContentSave} size={.9} />} {...props}>
        {children ?? t("save")}
    </Button>
}