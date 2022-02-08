import S from "./ContentBox.module.scss";
import React from "react";

export default function ContentBox(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <div className={S.contentBox + " " + (props.className || "")} {...props} />
  );
}
