export const compose = (...fns) => (param) => fns.reduceRight((acc, func) => acc.then(func), Promise.resolve(param));

export const every = (...fns) => (param) => fns.reduce((acc, func) => (func(acc), acc), param);

export const debounce = (func, ms) => {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
};
