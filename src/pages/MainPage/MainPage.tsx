import { Alert } from '@cc/Alert';
import {
  Nav, NavGroup, NavItem, NavItems,
} from '@cc/Nav';
import { Stack } from '@cc/Stack';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { mdiDotsGrid, mdiHomeCircleOutline, mdiPlus } from '@mdi/js';
import { TFunction } from 'i18next';
import React, { ErrorInfo } from 'react';
import { withTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import AppInitializationWrapper from '../AppInitializationWrapper';

const rootCSS = css`
  display: grid;
  grid-template: 70px 1fr / 300px 1fr;
  grid-template-areas:
    'side head'
    'side body';
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
  error?: Error
  errorInfo?: ErrorInfo
}

const Main = styled.main`
  padding: var(--t-spacing-md) var(--t-spacing-lg) 0 var(--t-spacing-lg);
`;

const Top = styled.header``;

type MainPageInnerProps = {
  t: TFunction
}

class MainPageInner extends React.Component<
  MainPageInnerProps,
  MainPageInnerState
> {
  constructor(props: Readonly<MainPageInnerProps>) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { t } = this.props;
    const { error, errorInfo } = this.state;

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
                {t('home')}
              </NavItem>
              <NavGroup text={t('applications')}>
                <NavItem to="/applications" iconSVG={mdiDotsGrid}>
                  {t('allApps')}
                </NavItem>

                <NavItem to="/applications/new" iconSVG={mdiPlus}>
                  {t('createNewApp')}
                </NavItem>
              </NavGroup>
            </NavItems>
          </Nav>
        </Stack>

        <Main>
          {error ? (
            <Alert color="danger">
              <pre>{error.toString()}</pre>
              <pre>{errorInfo?.componentStack}</pre>
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

export default function MainPage() {
  return (
    <AppInitializationWrapper>
      <MainPageInnerIntl />
    </AppInitializationWrapper>
  );
}
