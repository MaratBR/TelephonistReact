import { useTranslation } from 'react-i18next';
import S from './Shruggie.module.scss';

type ShruggieProps = React.PropsWithChildren<{}>;

export default function Shruggie({ children }: ShruggieProps) {
  const { t } = useTranslation();
  return (
    <div className={S.root}>
      <span className={S.shruggie}>¯\_(ツ)_/¯</span>
      <div className={S.body}>
        <h4>{t('emptyShrugMsg')}</h4>
        {children}
      </div>
    </div>
  );
}
