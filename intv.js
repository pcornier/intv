
const intv = function(initial, size) {

  if (Array.isArray(initial)) {
    let val = 0
    for (var i in initial) {
      let s = initial[i].size || (Math.log(initial[i]) / Math.log(2) + 1) | 1
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
