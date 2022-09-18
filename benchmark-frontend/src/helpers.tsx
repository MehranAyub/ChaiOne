/**
 * Accepts any number of classNames and returns them all as a single string.
 *
 * @param {...string} args Classes to concatenate
 * @returns {string} Space-separated string of classes
 */
export function classNames(...args: any) {
  const set = new Set(args);
  return Array.from(set)
    .filter((className) => className)
    .join(" ")
    .trim();
}
