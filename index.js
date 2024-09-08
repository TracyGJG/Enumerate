const formatKey = key =>
  /[a-z]/.test(key)
    ? key
        .replaceAll(/([A-Z])/g, '_$1')
        .toUpperCase()
        .replace(/^_/, '')
    : key;

function constants(valuesObj) {
  return Object.freeze(
    Object.entries(valuesObj).reduce(
      (enums, [enumKey, enumVals]) => ({
        ...enums,
        [formatKey(enumKey)]: enumVals,
      }),
      {}
    )
  );
}

function functionMap(funcObj, fallback) {
  const fnMap = Object.freeze(
    Object.entries(funcObj).reduce(
      (enums, [enumKey, enumVals]) => ({
        ...enums,
        [enumKey]: enumVals,
      }),
      {}
    )
  );

  return fnCall => {
    const mappedFn = fnMap[fnCall] ?? fallback;
    if (!mappedFn)
      throw Error(
        `Enumerate::functionMap: Function (${fnCall}) is not in the map and there is no fallback defined`
      );

    return mappedFn;
  };
}

function ordinals(ordinalValues, valueFn = _ => _) {
  return Object.freeze(
    ordinalValues.reduce(
      (enums, ordinal, index) => ({
        ...enums,
        [formatKey(ordinal)]: valueFn(index, ordinal),
      }),
      {}
    )
  );
}

export default {
  constants,
  functionMap,
  ordinals,
};
