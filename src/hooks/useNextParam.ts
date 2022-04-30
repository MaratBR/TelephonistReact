import { NavigateFunction, useNavigate, useSearchParams } from 'react-router-dom';

export interface NextParamController {
  nextIfPresent(): void;
  isPresent(): boolean;
  nextOr(path: string): void;
  nextOrMain(): void;
  redirectWithNext(path: string): void;
  next: string;
}

class Next implements NextParamController {
  readonly next: string | undefined;

  private readonly _navigate: NavigateFunction;

  constructor(next: string | undefined, navigate: NavigateFunction) {
    this.next = next;
    this._navigate = navigate;
    this.isPresent = this.isPresent.bind(this);
    this.nextIfPresent = this.nextIfPresent.bind(this);
    this.nextOr = this.nextOr.bind(this);
    this.nextOrMain = this.nextOrMain.bind(this);
    this.redirectWithNext = this.redirectWithNext.bind(this);
  }

  isPresent(): boolean {
    return typeof this.next === 'string' && this.next.trim() !== '';
  }

  nextIfPresent(): void {
    if (this.isPresent()) {
      this._navigate(this.next);
    }
  }

  nextOr(path: string): void {
    this._navigate(this.isPresent() ? this.next : path);
  }

  nextOrMain(): void {
    this.nextOr('/');
  }

  redirectWithNext(path: string): void {
    this._navigate(
      path +
        (path.indexOf('?') === -1
          ? `?next=${encodeURIComponent(this.next)}`
          : `&next=${encodeURIComponent(this.next)}`)
    );
  }
}

export default function useNextParam(): NextParamController {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  return new Next(params.get('next'), navigate);
}
