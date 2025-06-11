export const successResponse = ({ res, status = 200, data = {}, message = "success" } = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export const listAllSuccessResponse = ({
  res,
  status = 200,
  data = {},
  message = "success",
  numberOfRecords = null,
  numberOfPages = null,
  currentPage = null
} = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    numberOfRecords,
    numberOfPages,
    currentPage
  });
}