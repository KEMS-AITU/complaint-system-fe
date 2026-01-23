import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { register } from '../../features/auth/authApi';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';

const ALLOWED_EMAIL_DOMAINS = ['astanait.edu.kz'];
const IS_SSO_ONLY = false;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const validateFullName = (value: string) => {
  if (!value.trim()) return 'Full name is required.';
  return '';
};

const validateUniversityEmail = (value: string) => {
  const email = normalizeEmail(value);
  if (!email) return 'University email is required.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Enter a valid university email.';
  const domain = email.split('@')[1];
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return `Use your university email (e.g., name@${ALLOWED_EMAIL_DOMAINS[0]}).`;
  }
  return '';
};

const validatePassword = (value: string) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must include at least one letter and one number.';
  }
  return '';
};

const validateConfirmPassword = (password: string, confirm: string) => {
  if (!confirm) return 'Confirm your password.';
  if (password !== confirm) return 'Passwords do not match.';
  return '';
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const [first, ...rest] = parts;
  return {
    firstName: first ?? '',
    lastName: rest.join(' '),
  };
};

export const RegisterPage = () => {
  const { token } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreement: false,
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  if (IS_SSO_ONLY) {
    return (
      <AuthCard title="Create your account" subtitle="Use your university email to register">
        <p className="muted">
          Registration is handled through your university single sign-on. Continue with
          SSO to create your account.
        </p>
        <Link className="btn btn-primary" to="/login">
          Go to sign in
        </Link>
      </AuthCard>
    );
  }

  const fullNameError = validateFullName(fullName);
  const emailError = validateUniversityEmail(email);
  const passwordError = validatePassword(password);
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
  const agreementError = agreed ? '' : 'You must agree to continue.';

  const canSubmit =
    !fullNameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    agreed;
  const isLoading = status === 'loading';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setStatus('loading');
    setFormError('');

    const { firstName, lastName } = splitName(fullName);
    const result = await register({
      username: studentId.trim() || normalizeEmail(email),
      password,
      email: normalizeEmail(email),
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    });

    if (result.ok) {
      setStatus('success');
      return;
    }

    if (result.status === 429) {
      setFormError('Too many attempts. Please wait a bit and try again.');
    } else {
      setFormError('Registration failed. Please try again.');
    }

    setStatus('idle');
  };

  return (
    <AuthCard title="Create your account" subtitle="Use your university email to register">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label="Full name">
          <>
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
              aria-invalid={touched.fullName && fullNameError ? true : undefined}
              aria-describedby={touched.fullName && fullNameError ? 'register-name-error' : undefined}
              disabled={isLoading}
            />
            {touched.fullName && fullNameError ? (
              <span id="register-name-error" className="field-error">
                {fullNameError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label="University email">
          <>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              aria-invalid={touched.email && emailError ? true : undefined}
              aria-describedby={touched.email && emailError ? 'register-email-error' : undefined}
              disabled={isLoading}
            />
            {touched.email && emailError ? (
              <span id="register-email-error" className="field-error">
                {emailError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label="Student/Staff ID (optional)">
          <Input
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            disabled={isLoading}
          />
        </Field>
        <Field label="Password">
          <>
            <div className="input-row">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                aria-invalid={touched.password && passwordError ? true : undefined}
                aria-describedby={touched.password && passwordError ? 'register-password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {touched.password && passwordError ? (
              <span id="register-password-error" className="field-error">
                {passwordError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label="Confirm password">
          <>
            <div className="input-row">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                aria-invalid={touched.confirmPassword && confirmPasswordError ? true : undefined}
                aria-describedby={
                  touched.confirmPassword && confirmPasswordError
                    ? 'register-confirm-password-error'
                    : undefined
                }
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {touched.confirmPassword && confirmPasswordError ? (
              <span id="register-confirm-password-error" className="field-error">
                {confirmPasswordError}
              </span>
            ) : null}
          </>
        </Field>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            onBlur={() => setTouched((prev) => ({ ...prev, agreement: true }))}
            disabled={isLoading}
          />
          <span>I agree to the Terms and Privacy Policy</span>
        </label>
        {touched.agreement && agreementError ? (
          <span className="field-error">{agreementError}</span>
        ) : null}
        <Button type="submit" disabled={!canSubmit || isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
        {status === 'success' ? (
          <Notice tone="success">Account created. You can sign in now.</Notice>
        ) : null}
        <p className="muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
};
