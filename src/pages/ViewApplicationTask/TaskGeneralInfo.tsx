import ContentSection from '@ui/ContentSection';
import { StringValue } from '@ui/Parameters';
import S from './TaskGeneralInfo.module.scss';
import { TaskStandalone } from 'api/definition';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type IsDisabledProps = {
  disabled: boolean;
};

function IsDisabled({ disabled }: IsDisabledProps) {
  const { t } = useTranslation();
  return (
    <span className={classNames(S.disabled, disabled ? S.yes : S.no)}>
      {disabled ? t('disabled') : t('enabled')}
    </span>
  );
}

type TaskGeneralInfoProps = {
  task: TaskStandalone;
};

export default function TaskGeneralInfo({ task }: TaskGeneralInfoProps) {
  const { t } = useTranslation();
  return (
    <ContentSection padded header={t('description')}>
      <div className={S.root}>
        <div className={S.info}>
          <p>
            <StringValue value={task.description} />
          </p>
        </div>
        <div className={S.aside}>
          <IsDisabled disabled={task.disabled} />
        </div>
      </div>
    </ContentSection>
  );
}
