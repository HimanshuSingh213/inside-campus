'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export default function SignupPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    branch: '',
    year: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [validations, setValidations] = useState({});

  // Ensure styled-jsx tags only evaluate fully on client side mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Real-time validation patterns
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    if (/(.)\1{2,}/.test(name)) return false;
    return /^[a-zA-Z\s\-]{2,}$/.test(name);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      setValidations(prev => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === 'name') {
      setValidations(prev => ({ ...prev, name: validateName(value) }));
    }
    if (name === 'password') {
      setValidations(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must contain only letters, spaces, or hyphens (no repeated characters like "1111")';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, and numbers';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }

    if (!formData.branch) {
      newErrors.branch = 'Branch is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Account created successfully!');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const branches = [
    'Computer Science',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Information Technology',
    'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const passwordStrength = formData.password ? {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  } : null;

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.name && formData.email && formData.password && 
    formData.confirmPassword && formData.collegeName && 
    formData.branch && formData.year;

  // Render an empty skeleton or background placeholder during the initial SSR render pass
  if (!hasMounted) {
    return <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#06030a' }} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#06030a' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            backgroundColor: '#b395e3',
            top: '-100px',
            right: '-100px',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            backgroundColor: '#8a254e',
            bottom: '-100px',
            left: '-100px',
            animation: 'float 8s ease-in-out infinite 1s',
          }}
        />
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 transition-all duration-1000 opacity-100 translate-y-0">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{
              backgroundImage: `linear-gradient(135deg, #b395e3 0%, #cb4a3d 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Inside Campus
          </h1>
          <p style={{ color: '#ece4f8', opacity: 0.7 }} className="text-sm">
            Join the insider intelligence network
          </p>
        </div>

        {/* Form Card */}
        <div 
          className="backdrop-blur-xl rounded-2xl p-8 border transition-all duration-1000 opacity-100 translate-y-0"
          style={{
            backgroundColor: 'rgba(11, 5, 20, 0.8)',
            borderColor: 'rgba(179, 149, 227, 0.2)',
            boxShadow: '0 8px 32px rgba(179, 149, 227, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="relative group">
              <label style={{ color: '#ece4f8' }} className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none"
                  style={{
                    backgroundColor: 'rgba(12, 5, 25, 0.6)',
                    borderColor: focusedField === 'name' ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                    color: '#ece4f8',
                  }}
                />
              </div>
              <p style={{ color: '#ece4f8', opacity: 0.5 }} className="text-xs mt-1">
                Letters, spaces, and hyphens only
              </p>
              {validations.name && (
                <p className="mt-1 text-xs flex items-center gap-1 text-green-400">
                  <CheckCircle2 size={14} /> Name is valid
                </p>
              )}
              {errors.name && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#cb4a3d' }}>
                  <AlertCircle size={14} /> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative group">
              <label style={{ color: '#ece4f8' }} className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@college.edu"
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none"
                style={{
                  backgroundColor: 'rgba(12, 5, 25, 0.6)',
                  borderColor: focusedField === 'email' ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                  color: '#ece4f8',
                }}
              />
              {validations.email && (
                <p className="mt-1 text-xs flex items-center gap-1 text-green-400">
                  <CheckCircle2 size={14} /> Email is valid
                </p>
              )}
              {errors.email && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#cb4a3d' }}>
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label style={{ color: '#ece4f8' }} className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none pr-10"
                  style={{
                    backgroundColor: 'rgba(12, 5, 25, 0.6)',
                    borderColor: focusedField === 'password' ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                    color: '#ece4f8',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {passwordStrength && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[
                      passwordStrength.length,
                      passwordStrength.uppercase,
                      passwordStrength.lowercase,
                      passwordStrength.number,
                    ].map((check, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded transition-all duration-300"
                        style={{
                          backgroundColor: check ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs opacity-50" style={{ color: '#ece4f8' }}>
                    8+ characters, uppercase, lowercase, number
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#cb4a3d' }}>
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative group">
              <label style={{ color: '#ece4f8' }} className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none pr-10"
                  style={{
                    backgroundColor: 'rgba(12, 5, 25, 0.6)',
                    borderColor: focusedField === 'confirmPassword' ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                    color: '#ece4f8',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-xs flex items-center gap-1 text-green-400">
                  <CheckCircle2 size={14} /> Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#cb4a3d' }}>
                  <AlertCircle size={14} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* College Name Field */}
            <div className="relative group">
              <label style={{ color: '#ece4f8' }} className="block text-sm font-medium mb-2">
                College Name
              </label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                onFocus={() => setFocusedField('collegeName')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., IIT Delhi"
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none"
                style={{
                  backgroundColor: 'rgba(12, 5, 25, 0.6)',
                  borderColor: focusedField === 'collegeName' ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                  color: '#ece4f8',
                }}
              />
              {errors.collegeName && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#cb4a3d' }}>
                  <AlertCircle size={14} /> {errors.collegeName}
                </p>
              )}
            </div>

            {/* Branch Field */}
            <div className="relative group">
              <label style={{ color: '#ece4f8' }} className="block text-sm font-medium mb-2">
                Branch
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                onFocus={() => setFocusedField('branch')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none"
                style={{
                  backgroundColor: 'rgba(12, 5, 25, 0.6)',
                  borderColor: focusedField === 'branch' ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                  color: '#ece4f8',
                }}
              >
                <option value="">Select your branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch} style={{ backgroundColor: '#06030a', color: '#ece4f8' }}>
                    {branch}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#cb4a3d' }}>
                  <AlertCircle size={14} /> {errors.branch}
                </p>
              )}
            </div>

            {/* Year Field */}
            <div className="relative group">
              <label style={{ color: '#ece4f8' }} className="block text-sm font-medium mb-2">
                Academic Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                onFocus={() => setFocusedField('year')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none"
                style={{
                  backgroundColor: 'rgba(12, 5, 25, 0.6)',
                  borderColor: focusedField === 'year' ? '#b395e3' : 'rgba(179, 149, 227, 0.2)',
                  color: '#ece4f8',
                }}
              >
                <option value="">Select your year</option>
                {years.map(year => (
                  <option key={year} value={year} style={{ backgroundColor: '#06030a', color: '#ece4f8' }}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: '#cb4a3d' }}>
                  <AlertCircle size={14} /> {errors.year}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                backgroundColor: isFormValid && !isLoading ? '#b395e3' : 'rgba(179, 149, 227, 0.5)',
                color: '#06030a',
                transform: isFormValid && !isLoading ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (isFormValid && !isLoading) {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(179, 149, 227, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <p style={{ color: '#ece4f8' }} className="text-center text-sm mt-6">
              Already have an account?{' '}
              <a href="/auth/login" style={{ color: '#b395e3' }} className="font-semibold hover:underline">
                Sign in here
              </a>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p style={{ color: '#ece4f8', opacity: 0.5 }} className="text-center text-xs mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        input::placeholder,
        select {
          color: rgba(236, 228, 248, 0.4);
        }

        input:disabled,
        select:disabled {
          opacity: 0.5;
        }

        option {
          background-color: #06030a;
          color: #ece4f8;
        }
      `}</style>
    </div>
  );
}