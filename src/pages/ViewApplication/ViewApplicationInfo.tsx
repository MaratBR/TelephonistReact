import { models } from "@/api";
import { Button, Heading, HStack, Parameters, StringValue } from "@/components";
import Tag from "@/components/Tag";
import { mdiEye, mdiEyeOff, mdiPencil } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ApplicationInfoProps = {
  app: models.ApplicationView;
};

export default function ViewApplicationInfo({ app }: ApplicationInfoProps) {
  const [showKey, setShowKey] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <HStack>
        <Button
          to={"/applications/" + app._id + "/edit"}
          left={<Icon size={1} path={mdiPencil} />}
        >
          {t("edit")}
        </Button>
      </HStack>
      <Heading as="h3">{t("general_information")}</Heading>
      <Parameters
        parameters={{
          [t("id")]: <code>{app._id}</code>,
          [t("name")]: <StringValue value={app.name} />,
          [t("description")]: <StringValue value={app.description} />,
          [t("access_key")]: (
            <HStack spacing="md">
              <code>
                {showKey ? app.access_key : "application.################"}
              </code>
              <Button
                variant="link"
                onClick={() => setShowKey(!showKey)}
                left={<Icon size={0.8} path={showKey ? mdiEyeOff : mdiEye} />}
              >
                {showKey ? t("hide_key") : t("show_key")}
              </Button>
            </HStack>
          ),
          [t("tags")]: (
            <HStack>
              {app.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </HStack>
          ),
        }}
      />
    </>
  );
}
