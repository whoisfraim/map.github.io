export const eventStopPropagation = (e) => (e.stopPropagation(), e);

export const onDoubleTap = (singleTapCallback, doubleTapCallback) => {
  let timer = null;

  return (event) => {
    if (!timer) {
      timer = setTimeout(() => {
        if (singleTapCallback) singleTapCallback(event);
        timer = null;
      }, 300);
      return;
    }

    clearTimeout(timer);
    timer = null;
    doubleTapCallback(event);
  };
};
