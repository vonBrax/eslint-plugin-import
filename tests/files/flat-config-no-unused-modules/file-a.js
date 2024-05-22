const b = 2
const c = 3
const d = 4

export const a = 1 // will be reported

export { b, c } // will not be reported

export { d as e } // will not be reported

export function doAnything() {
  // some code
}  // will not be reported

export default 5 // will not be reported