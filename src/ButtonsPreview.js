import './Button.scss';
import getAllPossibleMachineDefs from './getAllPossibleMachineDefs';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const machineDef = {
  initial: 'idle',
  states: {
    idle: {},
    loading: {},
    success: {},
    error: {},
  },
};

const machineDefs = getAllPossibleMachineDefs(machineDef);
const machines = machineDefs.map(createMachine);

const ButtonsPreview = function ButtonsPreview() {
  const buttonEls = machines.map((machine, i) => (
    <Button machine={machine} key={i} />
  ));
  return <div className="ButtonsPreview">{buttonEls}</div>;
};

const getLabelText = function getLabelText(state) {
  const statesString = state.toStrings().join(' ');
  if (statesString.endsWith('idle')) {
    return 'Buy now';
  } else if (statesString.endsWith('loading')) {
    return 'Processing payment...';
  } else if (statesString.endsWith('success')) {
    return 'Success!';
  } else if (statesString.endsWith('error')) {
    return 'Payment failed :/';
  } else {
    return 'Unrecognized state';
  }
};

const Button = function Button({ machine }) {
  const [state] = useMachine(machine);
  const labelText = getLabelText(state);
  return (
    <button className="Button" data-state={state.toStrings().join(' ')}>
      {labelText}
    </button>
  );
};

export default ButtonsPreview;
