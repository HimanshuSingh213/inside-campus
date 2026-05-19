/**
 * Validation Utilities for Inside Campus
 * File location: src/lib/validation.js
 * 
 * Provides reusable validation functions for form fields
 */

/**
 * Validate name field
 * Rules:
 * - Must be at least 2 characters
 * - Only letters, spaces, and hyphens allowed
 * - No more than 2 consecutive repeated characters (blocks "111", "aaaa", etc.)
 * 
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Name is required',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters long',
    };
  }

  // Check for repeated characters (more than 2 consecutive)
  if (/(.)\1{2,}/.test(name)) {
    return {
      isValid: false,
      error: 'Name contains too many repeated characters (like "111" or "aaaa")',
    };
  }

  // Check for valid characters (letters, spaces, hyphens only)
  if (!/^[a-zA-Z\s\-']{2,}$/.test(name)) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate email field
 * Rules:
 * - Must be valid email format
 * - Should ideally be a college email (.edu domain) but not enforced
 * 
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  // Additional check for basic format
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  // Check for numbers only (pattern matching like 12345@example.com is blocked)
  if (/^[\d@.]+$/.test(email.split('@')[0])) {
    return {
      isValid: false,
      error: 'Email local part cannot contain only numbers',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate password field
 * Rules:
 * - Must be at least 8 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 * 
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string | null, strength: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Password is required',
      strength: 'none',
    };
  }

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const meetsRequirements = Object.values(requirements).filter(Boolean).length;

  let strength = 'weak';
  if (meetsRequirements >= 3) strength = 'medium';
  if (meetsRequirements === 4) strength = 'strong';

  if (!requirements.length) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
      strength,
    };
  }

  if (!requirements.uppercase) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
      strength,
    };
  }

  if (!requirements.lowercase) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
      strength,
    };
  }

  if (!requirements.number) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
      strength,
    };
  }

  return {
    isValid: true,
    error: null,
    strength,
  };
};

/**
 * Validate password confirmation
 * Rules:
 * - Must match the password field
 * 
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return {
      isValid: false,
      error: 'Please confirm your password',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate college name field
 * Rules:
 * - Must not be empty
 * - Should be at least 3 characters
 * - No numbers only
 * 
 * @param {string} collegeName - College name to validate
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export const validateCollegeName = (collegeName) => {
  if (!collegeName || collegeName.trim().length === 0) {
    return {
      isValid: false,
      error: 'College name is required',
    };
  }

  if (collegeName.trim().length < 3) {
    return {
      isValid: false,
      error: 'College name must be at least 3 characters',
    };
  }

  // Block names with only numbers
  if (/^\d+$/.test(collegeName.trim())) {
    return {
      isValid: false,
      error: 'College name cannot contain only numbers',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate branch selection
 * Rules:
 * - Must select a valid branch
 * 
 * @param {string} branch - Selected branch
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export const validateBranch = (branch) => {
  const validBranches = [
    'Computer Science',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Information Technology',
    'Other',
  ];

  if (!branch || branch.trim().length === 0) {
    return {
      isValid: false,
      error: 'Please select your branch',
    };
  }

  if (!validBranches.includes(branch)) {
    return {
      isValid: false,
      error: 'Invalid branch selection',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate year selection
 * Rules:
 * - Must select a valid year
 * 
 * @param {string} year - Selected year
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export const validateYear = (year) => {
  const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  if (!year || year.trim().length === 0) {
    return {
      isValid: false,
      error: 'Please select your academic year',
    };
  }

  if (!validYears.includes(year)) {
    return {
      isValid: false,
      error: 'Invalid year selection',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate entire signup form
 * @param {Object} formData - Form data object
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateSignupForm = (formData) => {
  const errors = {};

  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  const confirmPasswordValidation = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error;
  }

  const collegeValidation = validateCollegeName(formData.collegeName);
  if (!collegeValidation.isValid) {
    errors.collegeName = collegeValidation.error;
  }

  const branchValidation = validateBranch(formData.branch);
  if (!branchValidation.isValid) {
    errors.branch = branchValidation.error;
  }

  const yearValidation = validateYear(formData.year);
  if (!yearValidation.isValid) {
    errors.year = yearValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get password strength percentage
 * @param {string} password - Password to evaluate
 * @returns {number} Strength percentage (0-100)
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0;

  let strength = 0;

  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;

  return strength;
};

/**
 * Check if email exists in database
 * This should be called on backend/Firebase
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists
 */
export const checkEmailExists = async (email) => {
  try {
    // This would call your backend API to check if email exists
    // Example: const response = await fetch('/api/check-email', { ... })
    // For now, returning false (you'll implement this)
    return false;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

export default {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateCollegeName,
  validateBranch,
  validateYear,
  validateSignupForm,
  getPasswordStrength,
  checkEmailExists,
};
