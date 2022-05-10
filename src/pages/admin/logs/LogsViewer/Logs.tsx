import React from 'react';
import { Checkbox } from '@ui/Input';
import { Stack } from '@ui/Stack';
import S from './Logs.module.scss';
import { rest } from 'api/definition';
import classNames from 'classnames';
import { WithTranslationProps, withTranslation } from 'react-i18next';

const severityClasses = {
  [rest.LogSeverity.DEBUG]: S.debug,
  [rest.LogSeverity.INFO]: S.info,
  [rest.LogSeverity.WARNING]: S.warning,
  [rest.LogSeverity.ERROR]: S.error,
  [rest.LogSeverity.FATAL]: S.fatal,
};

const severityRepr = {
  [rest.LogSeverity.DEBUG]: 'DEBUG',
  [rest.LogSeverity.INFO]: 'INFO ',
  [rest.LogSeverity.WARNING]: 'WARN ',
  [rest.LogSeverity.ERROR]: 'ERR  ',
  [rest.LogSeverity.FATAL]: 'FATAL',
};

interface LogsProps {
  logs: rest.LogRecord[];
}

interface LogsState {
  showInfo: boolean;
}

class Logs extends React.Component<LogsProps & WithTranslationProps, LogsState> {
  private readonly ref = React.createRef<HTMLDivElement>();

  private wasUpdatedOnce: boolean = false;

  constructor(props: Readonly<LogsProps & WithTranslationProps>) {
    super(props);
    this.state = {
      showInfo: false,
    };
  }

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
