
export function intv(init, size) {
  let val = [];
  
  const setv = function(vector, size) {
    if (!Array.isArray(vector)) vector = [vector];
    size = size || Infinity;
    let sum = 0;
    let bits = 0;
    for (var i = 0; i < vector.length; i++) {
      var n = vector[i].i || vector[i];
      var s = vector[i].length || (Math.log(n) / Math.log(2) + 1) | 0;
      for (var j = 0; j < s; j++) {
        let b = (n >> j) & 1;
        val.push(b);
        sum |= b << i;
        bits++;
        if (bits >= size) break;
      }
    }
    return sum;
  }
  
  let sum = setv(init, size);
  size = size || (Math.log(sum) / Math.log(2) + 1) | 0;
  
  let fn = new Function;
  return new Proxy(fn, {
    set: function(a, p, v) {
      if (p == 'i') {
        val.splice(0, size);
        setv(v, size);
      }
      else val[p] = v;
      return true;
    },
    get: function(a, p) {
      if (p == 'i') {
        let v = 0;
        for (var i = 0; i < size; i++) {
          v |= val[i] << i;
        }
        return v;
      }
      else if (p in val) return val[p];
      else return val;
    },
    apply: function(a, me, arg) {
      return intv(val.slice(arg[1], arg[0]+1));
    }
  });
}
