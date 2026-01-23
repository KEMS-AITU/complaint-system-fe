import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../shared/api/complaints';
import { useAuth } from '../../shared/auth/AuthContext';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { TextArea } from '../../shared/ui/TextArea';

const validateText = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Complaint text is required.';
  if (trimmed.length < 10) return 'Complaint text must be at least 10 characters.';
  if (trimmed.length > 2000) return 'Complaint text must be 2000 characters or less.';
  return '';
};

const validateCategory = (value: string) => {
  if (!value.trim()) return '';
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 'Category must be a valid number.';
  }
  return '';
};

export const ComplaintCreateForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [touched, setTouched] = useState({ text: false, category: false });

  const textError = validateText(text);
  const categoryError = validateCategory(categoryId);
  const canSubmit = !textError && !categoryError;
  const isLoading = status === 'loading';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !canSubmit || isLoading) return;

    setStatus('loading');
    setMessage('');

    const payload: { text: string; category?: number } = { text: text.trim() };
    if (categoryId.trim()) {
      payload.category = Number(categoryId);
    }

    const result = await createComplaint(payload, token);

    if (result.ok && result.data) {
      navigate(`/complaints?highlight=${result.data.id}`, {
        replace: true,
        state: { flash: 'Complaint submitted successfully.' },
      });
      return;
    }

    if (result.status === 401 || result.status === 403) {
      setMessage('You need to sign in again.');
    } else if (result.status === 429) {
      setMessage('Too many requests. Please wait a moment and try again.');
    } else {
      setMessage('Could not submit complaint. Please try again.');
    }
    setStatus('error');
  };

  return (
    <Card>
      <h3>Create complaint</h3>
      <p className="muted">Send your issue to the support team.</p>
      {!token ? <Notice tone="warning">Sign in required to submit a complaint.</Notice> : null}
      <form onSubmit={handleSubmit} className="form">
        <Field label="Complaint text">
          <>
            <TextArea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, text: true }))}
              aria-invalid={touched.text && textError ? true : undefined}
              aria-describedby={touched.text && textError ? 'complaint-text-error' : undefined}
              disabled={!token || isLoading}
            />
            {touched.text && textError ? (
              <span id="complaint-text-error" className="field-error">
                {textError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label="Category ID (optional)" hint="Leave blank if you do not know the category.">
          <>
            <Input
              type="number"
              min="1"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, category: true }))}
              aria-invalid={touched.category && categoryError ? true : undefined}
              aria-describedby={touched.category && categoryError ? 'complaint-category-error' : undefined}
              disabled={!token || isLoading}
            />
            {touched.category && categoryError ? (
              <span id="complaint-category-error" className="field-error">
                {categoryError}
              </span>
            ) : null}
          </>
        </Field>
        <Button type="submit" disabled={!token || !canSubmit || isLoading}>
          {isLoading ? 'Submitting...' : 'Submit complaint'}
        </Button>
        {message ? (
          <Notice tone="warning">{message}</Notice>
        ) : null}
      </form>
      <div className="result">
        <div className="muted">
          Status preview <Badge variant="info">Submitted</Badge>
        </div>
      </div>
    </Card>
  );
};
