import S from './index.module.scss';
import {
  mdiAlertCircleOutline,
  mdiArrowRight,
  mdiCheckOutline,
  mdiDebugStepOver,
  mdiDotsCircle,
  mdiDotsHorizontal,
  mdiProgressQuestion,
} from '@mdi/js';
import Icon from '@mdi/react';
import { Sequence, SequenceState } from 'api/definition';
import SequenceStateView from 'pages/admin/sequence/SequenceView/SequenceStateView';
import { NavLink, useNavigate } from 'react-router-dom';

interface SequenceCardProps {
  sequence: Sequence;
}

const icons: Record<SequenceState, string> = {
  [SequenceState.SUCCEEDED]: mdiCheckOutline,
  [SequenceState.IN_PROGRESS]: mdiDotsCircle,
  [SequenceState.FAILED]: mdiAlertCircleOutline,
  [SequenceState.FROZEN]: mdiProgressQuestion,
  [SequenceState.SKIPPED]: mdiDebugStepOver,
};

export default function SequenceCard({ sequence }: SequenceCardProps) {
  const navigate = useNavigate();

  return (
    <section
      onClick={() => navigate(`/admin/sequences/${sequence._id}?ba=t`)}
      role="link"
      tabIndex={-1}
      className={`${S.card} ${S[sequence.state]}`}
      data-state={sequence.state}
    >
      <div className={S.icon}>
        <Icon className={S[sequence.state]} path={icons[sequence.state]} size={1.2} />
      </div>
      <div>
        <div className={S.name}>{sequence.name}</div>
        <div className={S.taskName}>
          {sequence.task_name} &bull; <code>{sequence._id}</code>
        </div>
        <div className={S.period}>
          {new Date(sequence.created_at).toLocaleDateString()}
          {` – `}
          {sequence.finished_at ? (
            new Date(sequence.finished_at).toLocaleDateString()
          ) : (
            <Icon path={mdiDotsHorizontal} size={1} />
          )}
        </div>
      </div>
      <div>
        <SequenceStateView state={sequence.state} />
      </div>
      <div className={S.link}>
        <NavLink to={`/admin/sequences/${sequence._id}?ba=t`}>
          <Icon size={1} path={mdiArrowRight} />
        </NavLink>
      </div>
    </section>
  );
}
