export function concatenateStrings(
  ...strings: (string | null | undefined)[]
): string {
  return strings
    .filter((str): str is string => str != null && str !== '')
    .join(' ')
    .trim()
}
