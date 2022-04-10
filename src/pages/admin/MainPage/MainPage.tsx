import React, { ErrorInfo } from 'react';
import { Alert } from '@ui/Alert';
import CurrentUser from './CurrentUser';
import S from './MainPage.module.scss';
import { Nav, NavGroup, NavItem, NavItems } from './Nav';
import { mdiDotsGrid, mdiHomeCircleOutline, mdiPlus } from '@mdi/js';
import { TFunction } from 'i18next';
import AuthorizatioRequired from 'pages/AuthorizationRequired';
import { withTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

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
      <div className={S.page}>
        <Nav>
          <NavItems>
            <CurrentUser />
            <NavItem to="/admin" iconSVG={mdiHomeCircleOutline}>
              {t('home._')}
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
            <NavGroup text={t('users._')}>
              <NavItem to="/admin/users" iconSVG={mdiDotsGrid}>
                {t('users.all')}
              </NavItem>

              <NavItem to="/admin/users/new" iconSVG={mdiPlus}>
                {t('users.new')}
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
