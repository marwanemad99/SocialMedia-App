import { message } from "../common/constants/index.js";

export const validationGraph = async ({ schema, inputs = {} } = {}) => {
  const { error } = schema.validate(inputs, { abortEarly: false });

  if (error) {
    const errorMessage = JSON.stringify({
      message: message.validationError,
      error: error.message,
    });

    throw new Error(errorMessage); 
  }

  return true;
};
