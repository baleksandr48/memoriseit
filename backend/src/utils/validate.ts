import joi from 'joi';

export const validate = <ResultType>(
  schema: joi.Schema,
  data: unknown,
): ResultType => {
  const { value, error } = schema.validate(data);
  if (error) {
    throw new Error(error.message);
  }
  return value as ResultType;
};

export const isValid = (schema: joi.Schema, data: any): boolean => {
  try {
    validate(schema, data);
    return true;
  } catch (err) {
    return false;
  }
};
