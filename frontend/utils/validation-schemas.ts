export const eventValue = (setValue: any) => (e) => setValue(e.target.value);

export const onNamedElementChange = (onFieldChange: (arg: object) => {}) => (
  e
) => onFieldChange({ [e.target.name]: e.target.value });

export const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isValidUsername = (username) => {
  const re = /^[a-z0-9_-]{3,16}$/;
  return re.test(username);
};

//https://www.w3resource.com/javascript/form/password-validation.php
export const isValidPassword = (password) => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return re.test(password);
};
