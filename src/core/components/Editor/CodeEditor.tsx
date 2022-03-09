import React, { useEffect, useRef } from 'react';
import S from './index.module.scss';
import { CodeJar } from 'codejar';
import Prism from 'prismjs';

export interface EditorState {
  readonly value: string;
}

type EditorSyntax = 'json' | 'shell';

interface CodeEditorProps {
  lang?: EditorSyntax;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
}

function CodeEditor({ lang, value, onChange, error }: CodeEditorProps) {
  const ref = useRef<HTMLDivElement>();
  const jar = useRef<CodeJar>();

  useEffect(() => {
    if (ref.current) {
      jar.current = CodeJar(
        ref.current,
        (el: HTMLDivElement) => {
          if (lang && Prism.languages[lang]) {
            // eslint-disable-next-line no-param-reassign
            el.innerHTML = Prism.highlight(el.textContent, Prism.languages[lang], lang);
            onChange(el.textContent);
            logging.warn('onChange');
          }
        },
        { tab: '  ' }
      );
      return () => jar.current.destroy();
    }
    jar.current = undefined;
    return undefined;
  }, [ref, lang]);

  useEffect(() => {
    if (ref.current) {
      try {
        const pos = jar.current.save();
        jar.current.updateCode(value);
        jar.current.restore(pos);
      } catch {
        jar.current.updateCode(value);
      }
    }
  }, [value]);

  return (
    <div className={S.viewer}>
      <div className={S.code} ref={ref} />
      <div className={S.error}>
        <div>{error}</div>
      </div>
    </div>
  );
}

export default React.memo(CodeEditor);
