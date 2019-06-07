Intv (Int vector) is a small Javascript helper to deal with binary numbers. It is used to **simulate** electronic signals and therefore not optimized for performance.

`intv intv(int value | array of values [, int size])`

#### Usage:

Automatic size calculation and constraint
```javascript
let a = intv(42)
console.assert(a.size == 6)
a.v = 64
console.assert(a == 0)
```

Automatic mask
```javascript
let a = intv(42)
console.assert(a.mask == 0b111111)
```

Explicit size
```javascript
a = intv(170, 6)
console.assert(a == 42)
```

Binary representation with leading zeros
```javascript
let a = intv(10, 6)
console.assert(a.toString() == '0b001010')
```

Resizing
```javascript
let a = intv(42)
a.size = 3
console.assert(a == 2)
console.assert(a.mask == 0b111)
```

Concatenation
```javascript
a = intv([0b11, intv(0b11, 4), 0b11])
console.assert(a == 0b11001111)
```

Concatenation with fixed size
```javascript
let a = intv(0b1111, 6)
a = intv([a, a], 10)
console.assert(a == 0b1111001111)
```

Bit indexing & slicing
```javascript
let a = intv(0b11001100)
console.assert(a(2) == 1)
console.assert(a(4) == 0)
console.assert(a(6, 3) == 0b1001)
```
