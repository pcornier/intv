
const intv = function(initial, size) {

  if (Array.isArray(initial)) {
    let val = 0
    for (var i in initial) {
      let s = initial[i].size || (Math.log(initial[i]) / Math.log(2) + 1) | 0
      val <<= s
      val |= initial[i]
    }
    initial = val
  }
  
  const v = function(i, j) {
    if (j !== null && j < i) {
      return intv((v.intv >> j) & ((1 << (i-j+1))-1))
    }
    else if (i != null) {
      return (v.intv >> i) & 1
    }
  }

  v.toString = function(base) {
    if (base) {
      return this.intv.toString(base)
    }
    return '0b' + ('0'.repeat(this.size) + this.intv.toString(2)).slice(-this.size)
  }

  v[Symbol.toPrimitive] = function() {
    return this.intv & this.mask
  }

  Object.defineProperties(v, {
    v: {
      set: value => v.intv = value & v.mask,
      get: _ => v.intv & v.mask
    },
    size: {
      set: value => {
        v._size = value
        v.mask = (1 << value) - 1
        v.intv &= v.mask
      },
      get: _ => v._size
    }
  })

  v.intv = initial || 0
  v.size = size || (Math.log(initial) / Math.log(2) + 1) | 0
  return v
}

// tests

// automatic size constraint
let a = intv(42)
console.assert(a.size == 6)
a.v = 64
console.assert(a == 0)

// automatic mask generation
console.assert(a.mask == 0b111111)

// binary representation with leading zeros
a.v = 10
console.assert(a.toString() == '0b001010')

// resize to 3 bit
a.size = 3
console.assert(a == 2)
console.assert(a.mask == 0b111)

// with explicit size
a = intv(170, 6)
console.assert(a == 42)

// concatenate
a = intv([0b11, intv(0b11, 4), 0b11])
console.assert(a == 0b11001111)

// concatenate with fixed size
a = intv([a, a], 10)
console.assert(a == 0b1111001111)

// bit indexing & slice
console.assert(a(1) == 1)
console.assert(a(4) == 0)
console.assert(a(6, 3) == 0b1001)
