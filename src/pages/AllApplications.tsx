import { Box, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import api, { models } from "~src/api";
import DataGrid, {
  DataGridColumn,
  renderObjectID,
} from "~src/components/DataGrid";

const columns: DataGridColumn<models.ApplicationView>[] = [
  {
    key: "_id",
    title: "ID",
    render: (id) => (
      <NavLink to={"/applications/" + id}>{renderObjectID(id)}</NavLink>
    ),
  },
  { key: "name", title: t`Name` },
  { key: "disabled", title: t`Disabled` },
  { key: "description", title: t`Description` },
];

export default function AllApplications(_: {}) {
  const [pagination, setPagination] =
    useState<models.Pagination<models.ApplicationView>>();

  useEffect(() => {
    api.getApplictions({}).then(setPagination);
  }, []);

  return (
    <div>
      <Heading>{t`All applications`}</Heading>

      <Box
        as="section"
        backgroundColor="front"
        borderRadius="xl"
        p={4}
        boxShadow="sm"
        mt={5}
        width="100%"
      >
        <ButtonGroup size="sm">
          <Button
            as={NavLink}
            to="/applications/new"
            leftIcon={<FaPlus />}
            colorScheme="blue"
          >
            Create new
          </Button>
          <Button colorScheme="red">Delete</Button>
        </ButtonGroup>
        <DataGrid columns={columns} data={pagination?.result || []} />
      </Box>
    </div>
  );
}
