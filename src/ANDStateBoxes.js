import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import getAllPossibleMachineDefs from './getAllPossibleMachineDefs';

// const machineDefObj = {
//   initial: 'dead',
//   states: {
//     dead: {},
//     alive: {
//       type: 'parallel',
//       states: {
//         power: {
//           initial: 'ok',
//           states: {
//             ok: {},
//             blink: {},
//           },
//         },
//         light: {
//           initial: 'on',
//           states: {
//             on: {},
//             off: {},
//           },
//         },
//         chimeStatus: {
//           initial: 'disabled',
//           states: {
//             disabled: {},
//             enabled: {
//               initial: 'quiet',
//               states: {
//                 quiet: {},
//                 beep: {},
//               },
//             },
//           },
//         },
//         alarm2Status: {
//           initial: 'disabled',
//           states: {
//             disabled: {},
//             enabled: {},
//           },
//         },
//         alarm1Status: {
//           initial: 'disabled',
//           states: {
//             disabled: {},
//             enabled: {},
//           },
//         },
//         main: {
//           initial: 'displays',
//           states: {
//             displays: {
//               initial: 'out',
//               states: {
//                 timeOrDate: {
//                   type: 'parallel',
//                   states: {
//                     regular: {
//                       initial: 'time',
//                       states: {
//                         time: {},
//                         date: {},
//                         update: {},
//                       },
//                     },
//                     beepTest: {
//                       initial: 'OO',
//                       states: {
//                         OO: {},
//                         OI: {},
//                         IO: {},
//                         beep: {},
//                       },
//                     },
//                   },
//                 },
//                 wait: {},
//                 stopwatch: {},
//                 out: {},
//               },
//             },
//             alarmsBeep: {},
//           },
//         },
//       },
//     },
//   },
// };

// const machineDefObj = {
//   type: 'parallel',
//   states: {
//     view: {
//       initial: 'zen',
//       states: {
//         default: {},
//         zen: {
//           type: 'parallel',
//           states: {
//             a: {
//               initial: 'on',
//               states: {
//                 on: {},
//                 off: {},
//               },
//             },
//             b: {
//               initial: 'on',
//               states: {
//                 on: {},
//                 off: {},
//               },
//             },
//           },
//         },
//       },
//     },
//     edit: {
//       type: 'parallel',
//       states: {
//         bold: {
//           initial: 'on',
//           states: {
//             on: {},
//             off: {},
//           },
//         },
//         italic: {
//           initial: 'on',
//           states: {
//             on: {},
//             off: {},
//           },
//         },
//       },
//     },
//   },
// };

// const machineDefObj = {
//   type: 'parallel',
//   states: {
//     a: {
//       initial: 'b',
//       states: {
//         b: {},
//         c: {},
//       },
//     },
//     d: {
//       initial: 'f',
//       states: {
//         e: {},
//         f: {},
//         g: {},
//       },
//     },
//   },
// };

const machineDefObj = {
  type: 'parallel',
  states: {
    a: {
      initial: 'on',
      states: {
        on: {},
        off: {},
      },
    },
    b: {
      initial: 'on',
      states: {
        on: {},
        off: {},
      },
    },
  },
};

// const machineDefObj = {
//   type: 'compound',
//   initial: 'on',
//   states: {
//     on: {},
//     off: {},
//   },
// };

// const machineDefObj = {
//   type: 'compound',
//   initial: 'a',
//   states: {
//     a: {
//       initial: 'on',
//       states: {
//         on: {
//           initial: 'x',
//           states: {
//             one: {},
//             two: {},
//             three: {},
//           },
//         },
//         off: {},
//         indeterminate: {},
//       },
//     },
//   },
// };

// const machineDefObj = {
//   type: 'parallel',
//   states: {
//     a: {
//       initial: 'on',
//       states: {
//         on: {},
//         off: {},
//       },
//     },
//     b: {
//       initial: 'on',
//       states: {
//         on: {},
//         off: {},
//       },
//     },
//   },
// };

const machineDefObjects = getAllPossibleMachineDefs(machineDefObj);
const machines = machineDefObjects.map((machine) => createMachine(machine));
const Box = function Box({ machine }) {
  const [state] = useMachine(machine);
  const boxEl = (
    <div className="box">State: {state.toStrings().join(' - ')}</div>
  );
  return boxEl;
};

const ANDStateBoxes = function ANDStateBoxes() {
  const boxEls = machines.map((machine, i) => (
    <Box machine={machine} key={i} />
  ));

  return <>{boxEls}</>;
};

export default ANDStateBoxes;
