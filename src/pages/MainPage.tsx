import AppInitializationWrapper from "./AppInitializationWrapper";
import Stack from "~src/components/Stack";
import Alert from "~src/components/Alert";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { ErrorInfo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { Nav, NavGroup, NavItem, NavItems } from "~src/components/Nav";
import Icon from "@mdi/react";
import {
  mdiApplication,
  mdiApplicationArray,
  mdiDotsGrid,
  mdiHomeCircle,
  mdiHomeCircleOutline,
  mdiPlus,
} from "@mdi/js";

export default function MainPage(_: {}) {
  return (
    <AppInitializationWrapper>
      <MainPageInnerIntl />
    </AppInitializationWrapper>
  );
}

const rootCSS = css`
  display: grid;
  grid-template: 70px 1fr / 300px 1fr;
  grid-template-areas:
    "side head"
    "side body";
  height: 100vh;

  & > :nth-child(1) {
    grid-area: head;
  }
  & > :nth-child(2) {
    grid-area: side;
  }
  & > :nth-child(3) {
    grid-area: body;
  }
`;

interface MainPageInnerState {
  error?: Error;
  errorInfo?: ErrorInfo;
}

const Main = styled.main`
  padding: var(--t-spacing-md) var(--t-spacing-lg) 0 var(--t-spacing-lg);
`;

const Top = styled.header``;

class MainPageInner extends React.Component<
  { t: TFunction },
  MainPageInnerState
> {
  state: MainPageInnerState = {};

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    return (
      <div css={rootCSS}>
        <Top>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas, a.
          Consequuntur impedit accusantium illo autem recusandae rerum! Ratione
          porro reprehenderit a saepe, vero voluptates natus dignissimos quia,
          numquam sint ab.
        </Top>
        <Stack>
          <Nav>
            <NavItems>
              <NavItem to="/" iconSVG={mdiHomeCircleOutline}>
                {this.props.t("home")}
              </NavItem>
              <NavGroup text={this.props.t("applications")}>
                <NavItem to="/applications" iconSVG={mdiDotsGrid}>
                  {this.props.t("all_applications")}
                </NavItem>

                <NavItem to="/applications/new" iconSVG={mdiPlus}>
                  {this.props.t("create_new_application")}
                </NavItem>
              </NavGroup>
            </NavItems>
          </Nav>
        </Stack>

        <Main>
          {this.state.error ? (
            <Alert color="danger">
              <pre>{this.state.error.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </Alert>
          ) : (
            <Outlet />
          )}
        </Main>
      </div>
    );
  }
}

const MainPageInnerIntl = withTranslation()(MainPageInner);
