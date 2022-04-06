import S from './index.module.scss';
import { css } from '@emotion/react';
import classNames from 'classnames';

interface LoadingBarProps {
  indetermined?: boolean;
  progress?: number;
}

export default function LoadingBar({ indetermined, progress }: LoadingBarProps) {
  return (
    <div className={classNames(S.bar, { [S.indetermined]: indetermined })}>
      <div
        css={css({
          width: typeof progress === 'undefined' ? undefined : `${progress}%`,
        })}
        className={S.rect}
      />
    </div>
  );
}
