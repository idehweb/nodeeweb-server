export function catchMiddleware(fn, { self, onError }) {
  return async (req, res, next) => {
    try {
      return await fn.call(self ?? this, req, res, next);
    } catch (err) {
      if (onError) {
        console.log('#CatchError', err);
        return onError(err, req, res, next);
      }
      return next(err);
    }
  };
}

export function classCatchBuilder(C, onError = C.onError) {
  const methodNames = Object.getOwnPropertyNames(C).filter(
    (p) =>
      typeof C[p] === 'function' &&
      p !== 'constructor' &&
      p !== 'onError' &&
      !p.startsWith('_')
  );

  methodNames.forEach(
    (mn) =>
      (C[mn] = catchMiddleware(C[mn], {
        self: C,
        onError: onError
          ? (err, req, res, next) => onError(mn, err, req, res, next)
          : null,
      }))
  );
  return C;
}
