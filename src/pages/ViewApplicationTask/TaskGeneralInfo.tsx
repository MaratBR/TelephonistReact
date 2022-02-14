import ContentSection from '@cc/ContentSection';
import { StringValue } from '@cc/Parameters';
import { Task } from 'api/definition';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import S from './TaskGeneralInfo.module.scss';

type IsDisabledProps = {
  disabled: boolean
}

function IsDisabled({ disabled }: IsDisabledProps) {
  const { t } = useTranslation();
  return (
    <span className={classNames(S.disabled, disabled ? S.yes : S.no)}>
      {disabled ? t('disabled') : t('enabled')}
    </span>
  );
}

type Props = {
  task: Task
}

export default function TaskGeneralInfo({ task }: Props) {
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
