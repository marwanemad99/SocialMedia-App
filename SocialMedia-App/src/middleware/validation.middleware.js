export const validation = (schema) => {
  return (req, res, next) => {
    const inputs = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files?.length) {
      inputs.file = req.file || req.files;
    }
    const { error } = schema.validate(inputs, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.message,
      });
    }
    return next();
  }
}