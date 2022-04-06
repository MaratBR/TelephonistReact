import { useState } from 'react';
import { Button } from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import Container from '@ui/Container';
import ContentSection from '@ui/ContentSection';
import PageHeader from '@ui/PageHeader';
import S from './index.module.scss';
import { mdiReload } from '@mdi/js';
import Icon from '@mdi/react';
import { useApi } from 'hooks';
import { useTopic } from 'hooks/useUserHub';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';

export default function GenerateRegistrationCode() {
  const [code, setCode] = useState<string>(undefined);
  const [exp, setExp] = useState<Date>();
  const { applications } = useApi();
  const generateCode = useMutation(async () => {
    const { code: newCode, expires_at } = await applications.createRegistrationCode({
      del_code: code,
    });
    setCode(newCode);
    setExp(new Date(expires_at));
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  useTopic(!!code, `m/cr/${code}`, (context) => {
    context.addEventListener('cr_complete', ({ app_name }) => {
      navigate(`/admin/applications/${app_name}`);
    });
  });

  return (
    <>
      <PageHeader title={t('registerYourApp')} />

      <Container>
        <ContentSection padded>
          <p>{t('crDescription')}</p>
          <div title={t('clickToCopy')} className={S.code}>
            {!code ? t('########') : code}
          </div>
          {exp ? <span>{t('codeExpiresAt', { exp: exp.toLocaleTimeString() })}</span> : undefined}
          <ButtonGroup>
            <Button
              disabled={generateCode.isLoading}
              onClick={() => generateCode.mutate()}
              left={<Icon size={0.9} path={mdiReload} />}
            >
              {t('generateCode')}
            </Button>
          </ButtonGroup>
        </ContentSection>
      </Container>
    </>
  );
}
