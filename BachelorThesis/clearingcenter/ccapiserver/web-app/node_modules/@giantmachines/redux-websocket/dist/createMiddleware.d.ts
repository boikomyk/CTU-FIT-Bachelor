import { Middleware } from 'redux';
import { Options } from './types';
declare const _default: (rawOptions?: Options | undefined) => Middleware<{}, any, import("redux").Dispatch<import("redux").AnyAction>>;
/**
 * Create a middleware.
 *
 * @param {Options} rawOptions
 *
 * @returns {Middleware}
 */
export default _default;
