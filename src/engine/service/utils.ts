export const getParamFromState = (state: any, paramString: string) => {
    return paramString.split('.').reduce((o,i)=> o !== undefined ? o[i] : undefined, state);
  }