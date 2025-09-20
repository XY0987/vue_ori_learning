import { makeMap } from './makeMap'
/*
定于模板中直接使用的变量列表template标签中的部分
*/
const GLOBALS_ALLOWED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol'

export const isGloballyAllowed: (key: string) => boolean =
  /*@__PURE__*/ makeMap(GLOBALS_ALLOWED)

/** @deprecated use `isGloballyAllowed` instead */
export const isGloballyWhitelisted: (key: string) => boolean = isGloballyAllowed
