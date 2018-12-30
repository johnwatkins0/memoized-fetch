import { isBoolean, isDate, isNull, isNumber, isString, isUndefined } from 'lodash';

declare const Promise: any;

/**
 * Cache item interface.
 */
export interface InterfaceCacheItem {
  memo: string;
  data: { [key: string]: any };
}

/**
 * Memo cache interface.
 */
export interface InterfaceMemoCache {
  [key: string]: InterfaceCacheItem;
}

export const SESSION_STORAGE_CACHE_KEY = 'memoizedFetch.CACHE';

/**
 * Determines whether value is of a supported memo type.
 *
 * @param value Any value.
 * @returns whether the value is supported.
 */
export function isSupportedMemoType(value: any) {
  return isString(value) || isBoolean(value) || isDate(value) || isNull(value) || isNumber(value) || isUndefined(value);
}

/**
 * Checks whether two values match.
 *
 * @param oldMemo First value.
 * @param newMemo Second Value.
 * @returns true if match.
 */
export function memosMatch(oldMemo: any, newMemo: any): boolean {
  if (!Array.isArray(oldMemo)) {
    oldMemo = [oldMemo];
  }

  if (!Array.isArray(newMemo)) {
    newMemo = [newMemo];
  }

  if (oldMemo.length !== newMemo.length) {
    return false;
  }

  for (let i = 0; i < oldMemo.length; i += 1) {
    if (!isSupportedMemoType(newMemo[i])) {
      throw new Error(`${JSON.stringify(newMemo[i])} is not a supported memo type.`);
    }

    if (!Object.is(oldMemo[i], newMemo[i])) {
      return false;
    }
  }

  return true;
}

/**
 * Gets cached memos.
 *
 * @returns cached memos.
 */
export function getCachedMemos(): InterfaceMemoCache {
  const cache = sessionStorage.getItem(SESSION_STORAGE_CACHE_KEY);

  if (cache) {
    return JSON.parse(cache);
  }

  return {};
}

/**
 * Returns the memoized fetch function.
 *
 * @param [CACHE] The cache object.
 * @returns the memoized fetch function.
 */
export function makeMemoizedFetch(CACHE: InterfaceMemoCache = {}) {
  return (input: RequestInfo, init: RequestInit = {}, memo?: any | any[]): Promise<{ [key: string]: any }> =>
    new Promise(async (resolve: any, reject: any) => {
      const key = JSON.stringify(input) + JSON.stringify(init);

      if (key in CACHE && memosMatch(CACHE[key].memo, memo)) {
        resolve(CACHE[key].data);
        return;
      }

      let response;
      let data;

      try {
        response = await fetch(input, init);
        data = await response.json();
      } catch (e) {
        reject(e);
        return;
      }

      CACHE[key] = {
        data,
        memo,
      };

      sessionStorage.setItem(SESSION_STORAGE_CACHE_KEY, JSON.stringify(CACHE));

      resolve(data);
    });
}

export default makeMemoizedFetch(getCachedMemos());
