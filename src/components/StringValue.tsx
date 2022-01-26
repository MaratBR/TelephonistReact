import { useTranslation } from "react-i18next";

export default function StringValue({ value }: { value?: null | string }) {
  const { t } = useTranslation();

  return value ? <>{value}</> : <span>{t("empty")}</span>;
}
