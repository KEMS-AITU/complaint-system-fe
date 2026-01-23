import { useEffect, useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { Complaint } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Notice } from '../../shared/ui/Notice';

export const ComplaintList = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<Complaint[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const loadComplaints = async () => {
    if (!token) return;
    setStatus('loading');
    setMessage('');

    const result = await apiRequest<Complaint[]>('admin/complaints/', { token });

    if (result.ok && result.data) {
      setItems(result.data);
      setStatus('success');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Failed to load complaints.');
  };

  useEffect(() => {
    loadComplaints();
  }, [token]);

  return (
    <Card>
      <div className="card-head">
        <div>
          <h3>Complaint queue</h3>
          <p className="muted">Review all submitted complaints.</p>
        </div>
        <Button variant="secondary" onClick={loadComplaints} disabled={!token || status === 'loading'}>
          {status === 'loading' ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      {!token ? <Notice tone="warning">Staff login required.</Notice> : null}
      {message ? <Notice tone="warning">{message}</Notice> : null}
      <div className="list-stack">
        {items.length === 0 && status === 'success' ? (
          <p className="muted">No complaints yet.</p>
        ) : null}
        {items.map((complaint) => (
          <div key={complaint.id} className="queue-item">
            <div>
              <div className="queue-title">
                <span>#{complaint.id}</span>
                <Badge variant="info">{complaint.status}</Badge>
              </div>
              <p>{complaint.text}</p>
              <p className="muted">User {complaint.user} ? Category {complaint.category ?? 'None'}</p>
            </div>
            <div className="queue-meta">
              {new Date(complaint.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
