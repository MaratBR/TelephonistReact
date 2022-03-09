import Container from '@coreui/Container';
import { TextHeader } from '@coreui/Text';
import BackButton from './BackButton';
import S from './PageHeader.module.scss';
import { VoidCallback } from 'core/utils/types';
import { To } from 'react-router';

interface PageHeaderProps {
  actions?: React.ReactNode;
  backAction?: To | VoidCallback;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
}

export default function PageHeader({
  top,
  bottom,
  actions,
  backAction,
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <header className={S.root}>
      <Container>
        {top}
        <div className={S.body}>
          <div className={S.header}>
            {backAction ? <BackButton action={backAction} /> : undefined}
            <TextHeader title={title} subtitle={subtitle} />
          </div>
          <div className={S.actions}>{actions}</div>
        </div>
        {bottom}
      </Container>
    </header>
  );
}
