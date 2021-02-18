import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import has from 'has';

const machineDefObj = {
  initial: 'a',
  states: {
    a: {
      initial: 'm',
      states: {
        m: {
          initial: 'mowing',
          states: {
            mowing: {},
            narcissist: {},
          },
        },
        n: {},
      },
      on: {
        click: {
          target: 'b',
        },
      },
    },
    b: {
      on: {
        click: {
          target: 'c',
        },
      },
    },
    c: {
      initial: 'mo',
      states: {
        mo: {},
        n: {},
      },
      on: {
        click: {
          target: 'a',
        },
      },
    },
  },
};
const isCompoundState = function isCompoundState(stateObject) {
  return has(stateObject, 'states');
};
const formatPath = function formatPath(stateName, path) {
  const stateNamePart = !!stateName ? `${stateName}.` : '';
  return `${stateNamePart}${path}`;
};
const getStatePaths = function getStatePaths({
  stateObject,
  stateName = null,
}) {
  if (isCompoundState(stateObject)) {
    return Object.entries(stateObject.states)
      .map(([childStateName, childStateObj]) => {
        const childPaths = getStatePaths({
          stateObject: childStateObj,
          stateName: childStateName,
        });
        if (Array.isArray(childPaths)) {
          return childPaths.map((childPath) =>
            formatPath(stateName, childPath)
          );
        } else {
          return formatPath(stateName, childPaths);
        }
      })
      .flat();
  } else {
    return stateName;
  }
};
const statePaths = getStatePaths({
  stateObject: machineDefObj,
});
const machineDefObjects = statePaths.map((statePath) => {
  return {
    ...machineDefObj,
    initial: 'atomicStateReacher',
    states: {
      ...machineDefObj.states,
      atomicStateReacher: {
        always: {
          target: statePath,
        },
      },
    },
  };
});
const machines = machineDefObjects.map((machine) => createMachine(machine));
const getLongestString = function getLongestString(arrayOfStrings) {
  return arrayOfStrings.sort((a, b) => b.length - a.length)[0];
};
const getLongestStateValuePath = function getLongestStateValuePath(state) {
  return getLongestString(state.toStrings());
};

const Box = function Box({ machine }) {
  const [state] = useMachine(machine);
  const boxEl = (
    <div className="box">State: {getLongestStateValuePath(state)}</div>
  );
  return boxEl;
};

const ORStateBoxesMultipleNestingLevels = function ORStateBoxesMultipleNestingLevels() {
  const boxEls = machines.map((machine, i) => (
    <Box machine={machine} key={i} />
  ));
  return <>{boxEls}</>;
};

export default ORStateBoxesMultipleNestingLevels;
