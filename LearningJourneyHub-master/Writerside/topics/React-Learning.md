# React Learning

## 🔍 JavaScript Variable Declarations: `const` vs `let` vs `var`

| Keyword | Reassignable | Redeclarable | Scope          | Hoisting               |
|---------|--------------|--------------|----------------|------------------------|
| `var`   | ✅ Yes        | ✅ Yes        | Function Scope | ✅ Yes (initialized as `undefined`) |
| `let`   | ✅ Yes        | ❌ No         | Block Scope    | ✅ Yes (but TDZ error) |
| `const` | ❌ No         | ❌ No         | Block Scope    | ✅ Yes (but TDZ error) |

### `var`
- Function-scoped.
- Can be redeclared and reassigned.
- Hoisted and initialized with `undefined`.

```
function test() {
  if (true) {
    var x = 5;
  }
  console.log(x); // ✅ 5 (accessible outside the block)
}
```

### `let`
- Block-scoped.
- Can be reassigned but not redeclared in the same scope.
- Hoisted but not initialized (Temporal Dead Zone).

```
function test() {
  if (true) {
    let y = 10;
  }
  console.log(y); // ❌ ReferenceError: y is not defined
}
```

### `const`
- Block-scoped.
- Cannot be reassigned or redeclared.
- Hoisted but not initialized.
- If declaring an object or array, its contents can still be changed.

```
const z = 20;
z = 30; // ❌ TypeError: Assignment to constant variable

const arr = [1, 2];
arr.push(3); // ✅ Allowed
console.log(arr); // [1, 2, 3]
```

### ✅ Best Practices
- Use `const` by default.
- Use `let` only when you know the variable value will change.
- Avoid using `var` to prevent scoping bugs.
