export const compose = (...fns) => (param) => fns.reduceRight((acc, func) => acc.then(func), Promise.resolve(param));

export const every = (...fns) => (param) => fns.reduce((acc, func) => (func(acc), acc), param);

export const currying = (fn, ...args) => (..._args) => fn(...args, ..._args);

export const reverseCurrying = (fn, ...args) => (..._args) => fn(..._args, ...args);
