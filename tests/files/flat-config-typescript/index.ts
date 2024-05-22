import FooClass from './foo';
import * as sideEffect from './foo';
import {something} from './foo.ts';
import { Something } from './foo';


const a = new FooClass();
const b: Something = something * sideEffect.something;

export {
  a, b
}
// export default class MyClass {}

// function makeClass() {
//   return new MyClass();
// }

// export default makeClass;