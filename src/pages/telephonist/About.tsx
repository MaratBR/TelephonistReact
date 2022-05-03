import { IconButton } from '@ui/Button';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import { renderBoolean } from '@ui/DataGrid';
import ErrorView from '@ui/Error';
import LoadingSpinner from '@ui/LoadingSpinner';
import { StringValue } from '@ui/Parameters';
import { Stack } from '@ui/Stack';
import { Logo } from '@ui/brand';
import S from './About.module.scss';
import ValueCard from '@admin/HomePage/ValueCard';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useApi } from 'hooks';
import Padded from 'pages/Padded';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

function Value({ value, name }) {
  return (
    <div className={S.valueCard}>
      <div className={S.name}>{name}</div>
      <div className={S.value}>{value}</div>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const api = useApi();
  const { data: summary, status, error } = useQuery('summary', () => api.getSummary());

  let statusUI: React.ReactNode;

  if (status === 'error') {
    statusUI = <ErrorView error={error} />;
  } else if (status === 'loading') {
    statusUI = <LoadingSpinner />;
  } else {
    statusUI = (
      <>
        <Value name={t('about.uiVersion')} value="0.2.0" />
        <Value name={t('about.backendVersion')} value={summary.version} />
        <Value name={t('about.backendTz')} value={summary.timezone.name} />
        <h3>{t('about.settings')}</h3>
        <Value name={t('about.cookiesPolicy')} value={summary.settings.cookies_policy} />
        <Value
          name={t('about.useNonSecureCookies')}
          value={renderBoolean(summary.settings.non_secure_cookies, 1.5)}
        />
      </>
    );
  }
  return (
    <Container>
      <Padded>
        <Stack h alignItems="center">
          <NavLink to="/admin">
            <IconButton path={mdiArrowLeft} size={1.5} />
          </NavLink>
          <Logo />
        </Stack>

        <div className={S.about}>
          <ContentSection padded>{statusUI}</ContentSection>
        </div>
      </Padded>
    </Container>
  );
}