export const logErr = (value: any) => process.env.NODE_ENV !== 'production' ? console.error(value) : undefined;
export const logWarn = (value: any) => process.env.NODE_ENV !== 'production' ? console.warn(value) : undefined;
export const logDebug = (value: any) => process.env.NODE_ENV !== 'production' ? console.debug(value) : undefined;

export const featureFlag = (flag: boolean, featureFn: Function) => flag ? featureFn() : undefined;

export const addKeyValue = (obj: any, key: string, value: any, overrideAll = true) => {
  if (overrideAll) {
    obj[key] = {
      ...obj[key],
      ...value,
    };
  } else {

  }
}

/**
 * Deep Copy all the properties from the sources to the target
 * @param target
 * @param source 
 * @param resetArray
 */
export function deepCopy(destination:any, sources:any|any[], resetArray = false): any {
  const sourcesToCopyFrom: any[] = sources.constructor === Array ? sources : [sources];
  sourcesToCopyFrom.forEach(source => {
    destination = internalDeepCopy(destination, source, resetArray);
  });

  return destination;
}

function internalDeepCopy(target: any, source: any, resetArray: boolean): any {

  if (typeof source === 'object') {
    if (source.constructor === Array) {
      target = copyFromArray(target, source, resetArray);
    } else {
      target = copyFromObject(target, source, resetArray);
    }
  } else {
    target = source;
  }

  return target;
}

function copyFromObject(target: any|undefined, source: any, resetArray: boolean): any {
  if (target === undefined) {
    target = {};
  }
  const keys = Object.keys(source);
  for (var i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    const sourceValue = source[key];
    if (sourceValue !== undefined) {
      target[key] = internalDeepCopy(target[key], sourceValue, resetArray);
    }
  }

  return target;
}

function copyFromArray(target: any, source: any[], resetArray: boolean): any[] {

  let l = source.length;
  if (target && target.constructor === Array) {
    if (resetArray) {
      target = [];
    }
    for (let i = 0; i < l; i++) {
      target.push(internalDeepCopy(undefined, source[i], resetArray));
    }
  } else {
    target = [];
    for (let i = 0; i < l; i++) {
      target[i] = internalDeepCopy(target[i], source[i], resetArray);
    }
  }
  return target;
}

export const getParamFromState = (state: any, paramString: string) => {
  return paramString.split('.').reduce((o,i)=> o !== undefined ? o[i] : undefined, state);
}

export const getParamFromStateMemoized = (state: any, paramString: string, derefFuncs: any) => {
  return memoizedLookupFunction(state, paramString, derefFuncs);
}

function memoizedLookupFunction(obj: any, path: string, derefFuncs: any) {
  if (!derefFuncs[path]) { 
      derefFuncs[path] = Function("obj", "return obj." + path + ";");
  }
  return derefFuncs[path](obj);
}
