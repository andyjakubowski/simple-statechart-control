import './Button.scss';
import getAllPossibleMachineDefs from './getAllPossibleMachineDefs';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import { useEffect, useRef } from 'react';
import fastCartesian from 'fast-cartesian';
import PseudoStyler from './pseudostyler';

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
  const buttonPseudoStateCollectionEls = machines.map((machine, i) => (
    <ButtonPseudoStateCollection machine={machine} key={i} />
  ));
  return <div className="ButtonsPreview">{buttonPseudoStateCollectionEls}</div>;
};

const ButtonPseudoStateCollection = function ButtonPseudoStateCollection({
  machine,
}) {
  const buttonRefs = useRef([]);
  const [state] = useMachine(machine);
  const labelText = getLabelText(state);
  const pseudoClasses = [':hover', ':active', ':focus'];
  const pseudoClassCombinations = fastCartesian(
    pseudoClasses.map((_) => [true, false])
  );
  const buttonEls = pseudoClassCombinations.map((combArray, i) => (
    <button
      className="Button"
      ref={(el) => (buttonRefs.current[String(i)] = el)}
      data-state={state.toStrings().join(' ')}
      key={i}
    >
      {labelText}
    </button>
  ));
  useEffect(() => {
    (async function togglePseudoStyles() {
      const styler = new PseudoStyler();
      await styler.loadDocumentStyles();
      Object.values(buttonRefs.current).forEach((buttonRef, buttonIndex) => {
        const pseudoClassValues = pseudoClassCombinations[buttonIndex];
        pseudoClassValues.forEach((isClassActive, classIndex) => {
          if (isClassActive) {
            styler.toggleStyle(buttonRef, pseudoClasses[classIndex]);
          }
        });
      });
    })();
    return () => (buttonRefs.current = {});
  });

  return <div className="ButtonPseudoStateCollection">{buttonEls}</div>;
};

const getLabelText = function getLabelText(state) {
  const statesString = state.toStrings().join(' ');
  if (statesString.endsWith('idle')) {
    // return 'Buy now';
    return 'Idle';
  } else if (statesString.endsWith('loading')) {
    // return 'Processing payment...';
    return 'Loading...';
  } else if (statesString.endsWith('success')) {
    // return 'Success!';
    return 'Success';
  } else if (statesString.endsWith('error')) {
    // return 'Payment failed :/';
    return 'Error';
  } else {
    return 'Unrecognized state';
  }
};

export default ButtonsPreview;
