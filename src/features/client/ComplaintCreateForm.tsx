import { useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { Complaint } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { TextArea } from '../../shared/ui/TextArea';

export const ComplaintCreateForm = () => {
  const { token } = useAuth();
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [created, setCreated] = useState<Complaint | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    setCreated(null);

    const payload: Record<string, unknown> = { text };
    if (categoryId) {
      payload.category = Number(categoryId);
    }

    const result = await apiRequest<Complaint>('complaints/', {
      method: 'POST',
      body: payload,
      token,
    });

    if (result.ok && result.data) {
      setStatus('success');
      setCreated(result.data);
      setMessage('Complaint created.');
      setText('');
      setCategoryId('');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Failed to create complaint.');
  };

  return (
    <Card>
      <h3>Create complaint</h3>
      <p className="muted">Send your issue to the support team.</p>
      {!token ? <Notice tone="warning">Sign in required to submit a complaint.</Notice> : null}
      <form onSubmit={handleSubmit} className="form">
        <Field label="Complaint text">
          <TextArea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
        <Field label="Category ID (optional)" hint="Leave blank if you do not know the category.">
          <Input
            type="number"
            min="1"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={!token || status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Submit complaint'}
        </Button>
        {message ? (
          <Notice tone={status === 'success' ? 'success' : 'warning'}>{message}</Notice>
        ) : null}
      </form>
      {created ? (
        <div className="result">
          <div>
            <strong>ID:</strong> {created.id}
          </div>
          <div>
            <strong>Status:</strong> <Badge variant="info">{created.status}</Badge>
          </div>
          <div className="muted">Created at {new Date(created.created_at).toLocaleString()}</div>
        </div>
      ) : null}
    </Card>
  );
};
