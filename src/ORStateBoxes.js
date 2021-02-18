import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const machineDefObj = {
  initial: 'a',
  states: {
    a: {
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
      on: {
        click: {
          target: 'a',
        },
      },
    },
  },
};
const stateKeys = Object.keys(machineDefObj.states);
const machineDefObjects = stateKeys.map((key) => {
  return {
    ...machineDefObj,
    initial: key,
  };
});
const machines = machineDefObjects.map((machine) => createMachine(machine));

const Box = function Box({ machine }) {
  const [state] = useMachine(machine);
  return <div className="box">State: {state.value}</div>;
};

const ORStateBoxesOneNestingLevel = function ORStateBoxesOneNestingLevel() {
  const boxEls = machines.map((machine, i) => (
    <Box machine={machine} key={i} />
  ));
  return <div>{boxEls}</div>;
};

export default ORStateBoxesOneNestingLevel;
