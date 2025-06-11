export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(error => {
      return next(error);
    }
    );
  };
}