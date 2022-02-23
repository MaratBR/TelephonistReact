import React from 'react';
import S from './index.module.scss';
import { CodeJar } from 'codejar';
import Prism from 'prismjs';

function getCaretPosition(editableDiv) {
  let caretPos = 0;
  let sel;
  let range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  }
  return caretPos;
}

export interface EditorState {
  readonly value: string;
}

type EditorSyntax = 'json' | 'shell';

interface CodeEditorProps {
  code?: string;
  lang?: EditorSyntax;
  value: string;
  onChange?: (value: string) => void;
}

class CodeEditor extends React.Component<CodeEditorProps> {
  private readonly ref = React.createRef<HTMLDivElement>();

  private jar?: ReturnType<typeof CodeJar>;

  private expectedNextValue?: string;

  componentDidMount(): void {
    const { value } = this.props;
    this.ref.current.textContent = value;
    this.jar = CodeJar(this.ref.current, this._highlight.bind(this));
  }

  shouldComponentUpdate({ value }: Readonly<CodeEditorProps>): boolean {
    return value !== this.expectedNextValue;
  }

  getSnapshotBeforeUpdate() {
    return {
      caret: getCaretPosition(this.ref.current),
    };
  }

  componentDidUpdate(
    _prevProps: Readonly<CodeEditorProps>,
    _prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    const pos = snapshot.caret;
    const { value } = this.props;
    if (this.ref.current) {
      this.ref.current.textContent = value;
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(this.ref.current, pos);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  componentWillUnmount(): void {
    this.jar?.destroy();
  }

  private _highlight(el: HTMLDivElement) {
    const { lang } = this.props;

    if (lang && Prism.languages[lang]) {
      // eslint-disable-next-line no-param-reassign
      el.innerHTML = Prism.highlight(el.textContent, Prism.languages[lang], lang);
      this._onChange(el.textContent);
    }
  }

  private _onChange(text: string) {
    const { onChange } = this.props;
    this.expectedNextValue = text;
    if (onChange) {
      onChange(text);
    }
  }

  render() {
    return <div className={`${S.viewer} ${S.editor}`} ref={this.ref} />;
  }
}

export default React.memo(CodeEditor);
