import React, { useEffect, useRef } from 'react';
import { Checkbox } from '@ui/Input';
import { Stack } from '@ui/Stack';
import S from './Logs.module.scss';
import { LogRecord, LogSeverity } from 'api/definition';
import classNames from 'classnames';
import { WithTranslationProps, withTranslation } from 'react-i18next';

const severityClasses = {
  [LogSeverity.DEBUG]: S.debug,
  [LogSeverity.INFO]: S.info,
  [LogSeverity.WARNING]: S.warning,
  [LogSeverity.ERROR]: S.error,
  [LogSeverity.FATAL]: S.fatal,
};

const severityRepr = {
  [LogSeverity.DEBUG]: 'DEBUG',
  [LogSeverity.INFO]: 'INFO ',
  [LogSeverity.WARNING]: 'WARN ',
  [LogSeverity.ERROR]: 'ERR  ',
  [LogSeverity.FATAL]: 'FATAL',
};

interface LogsProps {
  logs: LogRecord[];
}

interface LogsState {
  showInfo: boolean;
}

class Logs extends React.Component<LogsProps & WithTranslationProps, LogsState> {
  private readonly ref = React.createRef<HTMLDivElement>();
  private wasUpdatedOnce: boolean = false;
  state: LogsState = {
    showInfo: true,
  };

  componentDidUpdate(prevProps?: Readonly<LogsProps>) {
    if (this.ref.current) {
      const { logs } = this.props;
      if (prevProps.logs !== logs || !this.wasUpdatedOnce) {
        this.ref.current.scrollTop = this.ref.current.scrollHeight;
      }
    }
    this.wasUpdatedOnce = true;
  }

  render() {
    const { logs, i18n } = this.props;
    const t = i18n.t.bind(i18n);
    const { showInfo } = this.state;

    const text = logs.map((log) => (
      <div key={log._id} className={S.log}>
        {showInfo ? (
          <div className={S.extra}>
            <small className={`${S.tag} ${severityClasses[log.severity]}`}>
              {severityRepr[log.severity]}
            </small>
            <br />
            <small>{new Date(log.t / 1000).toLocaleString()}</small>
          </div>
        ) : undefined}
        <pre>{log.body}</pre>
      </div>
    ));

    return (
      <div>
        <Stack h alignItems="center" spacing="sm">
          <Checkbox
            id="showExtra"
            checked={showInfo}
            onChange={(e) => this.setState({ showInfo: e.target.checked })}
          />{' '}
          <label htmlFor="showExtra">{t('logs.showExtra')}</label>
        </Stack>
        <div ref={this.ref} className={classNames(S.raw, { [S.withExtra]: showInfo })}>
          {text}
        </div>
      </div>
    );
  }
}

export default withTranslation()(Logs);
