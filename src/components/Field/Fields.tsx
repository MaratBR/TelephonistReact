import React from "react";
import S from "./Fields.module.scss"

export default function Field({children}: React.PropsWithChildren<{}>) {
    return <div className={S.fields}>{children}</div>
}