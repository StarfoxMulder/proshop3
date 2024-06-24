const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
  // Takes in the request, if the promise resolves it's going to call next
  // which calls the next piece of middleware
};
export default asyncHandler;