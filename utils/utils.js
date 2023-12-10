export const compose = (...fns) => (param) => fns.reduceRight((acc, func) => acc.then(func), Promise.resolve(param));

export const every = (...fns) => (param) => fns.reduce((acc, func) => (func(acc), acc), param);

export const currying = (fn, ...args) => (..._args) => fn(...args, ..._args);

export const reverseCurrying = (fn, ...args) => (..._args) => fn(..._args, ...args);

export const debounce = (func, ms) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), ms);
  };
};

export const eventStopPropagation = (e) => (e.stopPropagation(), e);

export const onDoubleTap = (singleTapCallback, doubleTapCallback) => {
  let timer = null;

  return (event) => {
    if (!timer) {
      timer = setTimeout(() => {
        if (singleTapCallback) singleTapCallback(event);
        timer = null;
      }, 200);
      return;
    }

    clearTimeout(timer);
    timer = null;
    doubleTapCallback(event);
  };
};
