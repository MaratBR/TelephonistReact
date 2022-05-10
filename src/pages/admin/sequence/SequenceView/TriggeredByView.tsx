import { rest } from 'api/definition';
import { Trans } from 'react-i18next';

interface TriggeredByProps {
  triggeredBy: rest.TriggeredBy | undefined;
}

export default function TriggeredByView({ triggeredBy }: TriggeredByProps) {
  let content: React.ReactNode;

  if (triggeredBy) {
    if (triggeredBy.trigger_type === rest.TRIGGER_CRON) {
      content = (
        <>
          <Trans i18nKey="sequence.triggeredBy.cron" values={{ cron: triggeredBy.trigger_body }}>
            Sequence triggered according to the cron schedule: <code>{'{{cron}}'}</code>.{' '}
          </Trans>
          <a
            href={`https://crontab.guru/#${encodeURIComponent(triggeredBy.trigger_body)}`}
            target="_blank"
            rel="noreferrer"
          >
            cronttab.guru
          </a>
        </>
      );
    } else if (triggeredBy.trigger_type === rest.TRIGGER_EVENT) {
      content = (
        <Trans i18nKey="sequence.triggeredBy.event" values={{ event: triggeredBy.trigger_body }}>
          Sequence was triggered because event <b>{'{{event}}'}</b> occured
        </Trans>
      );
    } else if (triggeredBy.trigger_type === rest.TRIGGER_FSNOTIFY) {
      /* const path =
        triggeredBy.extra && typeof triggeredBy.extra === 'object'
          ? triggeredBy.extra.FILEPATH
          : undefined; */

      content = (
        <Trans i18nKey="sequence.triggeredBy.fsnotify" values={{ path: triggeredBy.trigger_body }}>
          Sequence was triggered by filesystem event in <b>{'{{path}}'}</b> occured
        </Trans>
      );
    }
  } else {
    content = (
      <Trans i18nKey="sequence.triggeredBy">
        This sequence was not triggered by any trigger, or trigger was not specified
      </Trans>
    );
  }

  return <p>{content}</p>;
}
