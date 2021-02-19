import has from 'has';
import fastCartesian from 'fast-cartesian';

const isCompoundState = function isCompoundState(stateObject) {
  return has(stateObject, 'states');
};
const getStateType = function getStateType(stateObject) {
  if (['parallel', 'history', 'final'].includes(stateObject.type)) {
    return stateObject.type;
  }

  if (isCompoundState(stateObject)) {
    return 'compound';
  }

  return 'atomic';
};
const prependStateNameRecursively = function prependStateNameRecursively(
  stateName,
  paths
) {
  if (Array.isArray(paths)) {
    return paths.map((path) => prependStateNameRecursively(stateName, path));
  } else {
    const stateNamePart = !!stateName ? `${stateName}.` : '';
    return `${stateNamePart}${paths}`;
  }
};
const getChildrenPaths = function getChildrenPaths(stateObject, stateName) {
  return Object.entries(stateObject.states).map(
    ([childStateName, childStateObj]) => {
      const childPaths = getStatePaths({
        stateObject: childStateObj,
        stateName: childStateName,
      });
      return prependStateNameRecursively(stateName, childPaths);
    }
  );
};
const getStatePaths = function getStatePaths({
  stateObject,
  stateName = null,
}) {
  const stateType = getStateType(stateObject);

  switch (stateType) {
    case 'compound':
      const resultek = getChildrenPaths(stateObject, stateName);
      return resultek.flat();
    case 'parallel':
      const results = getChildrenPaths(stateObject, stateName).map((result) => {
        return Array.isArray(result) ? result : [result];
      });
      return fastCartesian(results);
    case 'atomic':
    default:
      return stateName;
  }
};

const getAllPossibleMachineDefs = function getAllPossibleMachineDefs(
  machineDefObj
) {
  return getStatePaths({
    stateObject: machineDefObj,
  })
    .map((path) => (Array.isArray(path) ? path.flat(Infinity) : path))
    .map((statePath) => {
      return {
        ...machineDefObj,
        initial: 'atomicStateReacher',
        type: 'compound',
        states: {
          atomicStateReacher: {
            always: {
              target: prependStateNameRecursively('root', statePath),
            },
          },
          root: {
            type: machineDefObj.type,
            states: {
              ...machineDefObj.states,
            },
          },
        },
      };
    });
};

export default getAllPossibleMachineDefs;
