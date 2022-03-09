import React, { useMemo } from 'react';
import S from './Parameters.module.scss';

function ParametersGroup({
  parameters,
  name,
}: {
  name: string;
  parameters: Record<string, React.ReactNode>;
}) {
  return (
    <section className={S.group}>
      {name ? <h3>{name}</h3> : undefined}
      <div className={S.parameters}>
        {Object.entries(parameters).map(([k, v]) => (
          <div className={S.parameter} key={k}>
            <span className={S.term}>{k}:</span>
            <div className={S.value}>{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface Group {
  name: string | null;
  values: Record<string, React.ReactNode>;
}

function isIterable<T>(o: object): o is Iterable<T> {
  return !!o[Symbol.iterator];
}

function getParametersGroups(
  parameters: Record<string, React.ReactNode | Record<string, React.ReactNode>>
) {
  const groups: Group[] = [];
  let group: Group;

  for (const [key, value] of Object.entries(parameters)) {
    if (typeof value !== 'undefined') {
      if (
        typeof value === 'object' &&
        value !== null &&
        !React.isValidElement(value) &&
        value !== null &&
        !isIterable(value)
      ) {
        // create new group
        if (group) {
          groups.push(group);
          group = undefined;
        }
        groups.push({ name: key, values: value });
      } else if (!group) {
        // create new unnamed group
        group = {
          name: null,
          values: {
            [key]: value,
          },
        };
      } else {
        group.values[key] = value;
      }
    }
  }

  if (group) {
    groups.push(group);
  }

  return groups;
}

export default function Parameters({
  parameters,
}: {
  parameters: Record<string, React.ReactNode | Record<string, React.ReactNode>>;
}) {
  const groups = useMemo(() => getParametersGroups(parameters), [parameters]);

  return (
    <section className={S.root}>
      {groups.map(({ values, name }) => (
        <ParametersGroup name={name} parameters={values} />
      ))}
    </section>
  );
}
