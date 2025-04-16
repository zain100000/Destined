export const validateFirstName = firstName => {
  if (!firstName) {
    return 'First Name is required';
  }
  if (firstName.length < 4) {
    return 'First Name is at least 4 characters long';
  }
  return '';
};

export const validateLastName = lastName => {
  if (!lastName) {
    return 'Last Name is required';
  }
  if (lastName.length < 4) {
    return 'Last Name is at least 4 characters long';
  }
  return '';
};

export const validateEmail = email => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = password => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 4) {
    return 'Password must be at least 4 characters long';
  }
  return '';
};

export const validatePhone = phone => {
  const phonePattern = /^[0-9]{11}$/;
  if (!phone) {
    return 'Contact number is required';
  }
  if (!phonePattern.test(phone)) {
    return 'Contact number must be 11 digits';
  }
  return '';
};

export const validateGender = gender => {
  if (!gender || gender === '') {
    return 'Please select a gender';
  }
  return ''; // Valid if not empty or undefined
};

export const validateDob = dob => {
  if (!dob) {
    return 'Date of Birth is required';
  }
  return '';
};

export const validateFields = fields => {
  const validationFunctions = {
    firstName: validateFirstName,
    lastName: validateLastName,
    email: validateEmail,
    password: validatePassword,
    phone: validatePhone,
    gender: validateGender,
    dob: validateDob,
  };

  const errors = {};

  Object.keys(fields).forEach(field => {
    if (validationFunctions[field]) {
      const error = validationFunctions[field](fields[field]);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return errors;
};

export const isValidInput = fields => {
  const errors = validateFields(fields);

  return Object.values(errors).every(error => error === '');
};
