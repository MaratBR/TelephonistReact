import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AppInitializationWrapper from "./AppInitializationWrapper";

export default function MainPage(_: {}) {
  return (
    <AppInitializationWrapper>
      <MainPageInner />
    </AppInitializationWrapper>
  );
}

function MainPageInner(_: {}) {
  return (
    <Grid height="100vh" gridTemplate="60px 1fr / 240px 1fr">
      <GridItem colSpan={2}>
        <div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium
          ipsum, consectetur distinctio dolorum quia quae deleniti!
          Exercitationem amet at aspernatur, cupiditate error, reiciendis eum
          quaerat fuga consequuntur animi quis consectetur!
        </div>
      </GridItem>

      <div></div>

      <Box as="main" p={4}>
        <Outlet />
      </Box>
    </Grid>
  );
}
