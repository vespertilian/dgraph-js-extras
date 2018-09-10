// Typescript signature is "User-Defined Type Guard"
// http://www.typescriptlang.org/docs/handbook/advanced-types.html
export function isPromise(potentialPromise: Promise<any> | any): potentialPromise is Promise<any> {
  return Promise.resolve(potentialPromise) == potentialPromise
}
