import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { login } from '../../features/auth/authApi';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';

const validateIdentifier = (value: string) => {
  if (!value.trim()) return 'Email or University ID is required.';
  return '';
};

const validatePassword = (value: string) => {
  if (!value) return 'Password is required.';
  return '';
};

export const LoginPage = () => {
  const { token, setToken } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({ identifier: false, password: false });

  if (token) {
    return <Navigate to={from} replace />;
  }

  const identifierError = validateIdentifier(identifier);
  const passwordError = validatePassword(password);
  const canSubmit = !identifierError && !passwordError;
  const isLoading = status === 'loading';

  const showIdentifierError = touched.identifier && identifierError;
  const showPasswordError = touched.password && passwordError;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setStatus('loading');
    setFormError('');

    const result = await login({ username: identifier.trim(), password });

    if (result.ok && result.data?.token) {
      setToken(result.data.token);
      return;
    }

    if (result.status === 429) {
      setFormError('Too many attempts. Please wait a bit and try again.');
    } else if (result.status === 401 || result.status === 403) {
      setFormError('Incorrect email/ID or password.');
    } else {
      setFormError('Sign in failed. Please try again.');
    }

    setStatus('idle');
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label="Email or University ID">
          <>
            <Input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
              aria-invalid={showIdentifierError ? true : undefined}
              aria-describedby={showIdentifierError ? 'login-identifier-error' : undefined}
              disabled={isLoading}
            />
            {showIdentifierError ? (
              <span id="login-identifier-error" className="field-error">
                {identifierError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label="Password">
          <>
            <div className="input-row">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                aria-invalid={showPasswordError ? true : undefined}
                aria-describedby={showPasswordError ? 'login-password-error' : undefined}
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
            {showPasswordError ? (
              <span id="login-password-error" className="field-error">
                {passwordError}
              </span>
            ) : null}
          </>
        </Field>
        <div className="auth-row">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={isLoading}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="submit" disabled={!canSubmit || isLoading} className="auth-login-button">
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
        <p className="muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthCard>
  );
};
