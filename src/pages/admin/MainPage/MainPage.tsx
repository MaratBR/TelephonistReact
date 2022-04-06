import React, { ErrorInfo } from 'react';
import { Alert } from '@ui/Alert';
import CurrentUser from './CurrentUser';
import { Nav, NavGroup, NavItem, NavItems } from './Nav';
import { css } from '@emotion/react';
import { mdiDotsGrid, mdiHomeCircleOutline, mdiPlus } from '@mdi/js';
import { TFunction } from 'i18next';
import AuthorizatioRequired from 'pages/AuthorizationRequired';
import { withTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

const rootCSS = css`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
`;

interface MainPageInnerState {
  error?: Error;
  errorInfo?: ErrorInfo;
}

type MainPageInnerProps = {
  t: TFunction;
};

class MainPageInner extends React.Component<MainPageInnerProps, MainPageInnerState> {
  constructor(props: Readonly<MainPageInnerProps>) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;
    const { error, errorInfo } = this.state;

    return (
      <div css={rootCSS}>
        <Nav>
          <NavItems>
            <CurrentUser />
            <NavItem to="/admin" iconSVG={mdiHomeCircleOutline}>
              {t('home')}
            </NavItem>
            <NavGroup text={t('applications')}>
              <NavItem to="/admin/applications" iconSVG={mdiDotsGrid}>
                {t('allApps')}
              </NavItem>

              <NavItem to="/admin/applications/new" iconSVG={mdiPlus}>
                {t('createNewApp')}
              </NavItem>
              <NavItem to="/admin/applications/cr" iconSVG={mdiPlus}>
                {t('registerYourApp')}
              </NavItem>
            </NavGroup>
            <NavGroup text={t('users')}>
              <NavItem to="/admin/users" iconSVG={mdiDotsGrid}>
                {t('allUsers')}
              </NavItem>

              <NavItem to="/admin/users/new" iconSVG={mdiPlus}>
                {t('newUser')}
              </NavItem>
            </NavGroup>
          </NavItems>
        </Nav>

        <main>
          {error ? (
            <Alert color="danger">
              <pre>{error.toString()}</pre>
              <pre>{errorInfo?.componentStack}</pre>
            </Alert>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    );
  }
}

const MainPageInnerIntl = withTranslation()(MainPageInner);

export default function MainPage() {
  return (
    <AuthorizatioRequired>
      <MainPageInnerIntl />
    </AuthorizatioRequired>
  );
}
