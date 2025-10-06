export function assembleClassNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
