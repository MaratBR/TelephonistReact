import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { t } from "@lingui/macro";
import { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "~src/api";
import { ContentBox } from "~src/components/ContentBox";
import TagInput from "~src/components/TagInput";

const APPLICATION_TYPES = {
  arbitrary: t`Arbitrary application type means that application has no excplicit purpose an behaviour, this application can be anything. On the other hand, however, this means that UI won'nt be able to display app settings (other than in raw JSON)`,
  host: t`Host application is used to group multiple tasks and configure when should they occur. This application doesn't do anything itself, rahter, it servers as an "adapter" of sorts between third party applications and Telephonist API. Host applications support CRON.`,
  custom: t`Custom application. You can put any name you want. Can be useful if you want to have multiple "arbitrary" applications but want them to be semanticly different.`,
};

export default function NewApplication(_: {}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"arbitrary" | "host" | "custom">(
    "arbitrary"
  );
  const [customType, setCustomType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const newApplication = t`New application`;
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      alert(tags);
      const { _id } = await api.createApplication({
        name,
        description,
        tags,
        application_type: type == "custom" ? customType : type,
      });
      navigate("/applications/" + _id);
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack>
      <Breadcrumb>
        <BreadcrumbItem as={NavLink} to={"/applications"}>
          <BreadcrumbLink>Applications</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>{name || newApplication}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading>{name || newApplication}</Heading>

      <ContentBox>
        <form action="#" onSubmit={submit}>
          <Stack gap={2}>
            <Input
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t`Name of the new application`}
              variant="flushed"
            />
            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t`Describe what will this application do`}
            />
            <TagInput
              placeholder={t`Input some tags for this application`}
              tags={tags}
              onTagsChange={(_se, tags) => setTags(tags)}
            />
            <Select value={type} onChange={(e) => setType(e.target.value!)}>
              <option value="arbitrary">{t`Arbitrary application`}</option>
              <option value="host">{t`Host application`}</option>
              <option value="custom">{t`Custom type`}</option>
            </Select>
            <Text>{APPLICATION_TYPES[type]}</Text>
            {type == "custom" ? (
              <Input
                required
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder={t`Custom application type`}
              />
            ) : null}
            <Button
              disabled={loading}
              isLoading={loading}
              type="submit"
              alignSelf="start"
              variant="outline"
            >
              Save
            </Button>
          </Stack>
        </form>
      </ContentBox>
    </Stack>
  );
}
