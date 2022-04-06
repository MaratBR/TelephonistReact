import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AtTimeProps {
  at: number | Date | string;
}

export default function AtTime({ at }: AtTimeProps) {
  let ts: number;

  if (typeof at === 'string') ts = +new Date(at);
  else if (typeof at === 'number') ts = at;
  else ts = +at;

  const now = Date.now();
  const seconds = Math.round((now - ts) / 1000);

  let str: string;
  let nextRerender: number = -1;
  const { t } = useTranslation();

  if (seconds <= 5) {
    str = t('justNow');
    nextRerender = 2;
  } else if (seconds < 58) {
    nextRerender = 10;
    str = t('nSecondsAgo', { count: seconds });
  } else if (seconds < 59.5 * 60) {
    str = t('nMinutesAgo', { count: Math.round(Math.floor(seconds / 60)) });
    nextRerender = 60;
  } else if (seconds < 24 * 60 * 60) {
    str = t('nHoursAgo', { count: Math.floor(seconds / (60 * 60)) });
    nextRerender = 60 * 60;
  } else str = new Date(ts).toLocaleString();

  const [flag, setFlag] = useState<number>(0);

  useEffect(() => {
    if (nextRerender === -1) return undefined;
    const timeout = setTimeout(() => {
      setFlag(Date.now());
    }, nextRerender * 1000);
    return () => clearTimeout(timeout);
  }, [flag, at]);

  return <time dateTime={new Date(ts).toISOString()}>{str}</time>;
}
