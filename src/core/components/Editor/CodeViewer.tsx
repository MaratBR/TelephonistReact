import { useEffect, useRef } from 'react';
import S from './index.module.scss';
import Prism from 'prismjs';

export type Syntax = 'json' | 'shell';

interface CodeViewerProps {
  code?: string;
  lang?: Syntax;
}

export default function CodeViewer({ code, lang }: CodeViewerProps) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current) {
      const html = Prism.highlight(code, Prism.languages[lang ?? 'json'], lang ?? 'json');
      ref.current.innerHTML = `<pre>${html}</pre>`;
    }
  }, [ref.current, code]);

  return (
    <div className={S.viewer}>
      <div ref={ref} className={S.code} />
    </div>
  );
}
