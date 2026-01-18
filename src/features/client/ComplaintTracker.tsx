import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { Complaint } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';

type ComplaintTrackerProps = {
  onSelectComplaint?: (complaintId: number) => void;
  selectedComplaintId?: number | null;
};

export const ComplaintTracker = ({ onSelectComplaint, selectedComplaintId }: ComplaintTrackerProps) => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const loadComplaints = async () => {
    if (!token) return;
    setStatus('loading');
    setMessage('');

    const result = await apiRequest<Complaint[]>('admin/complaints/', { token });

    if (result.ok && result.data) {
      setComplaints(result.data);
      setStatus('success');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Unable to load complaints.');
  };

  useEffect(() => {
    loadComplaints();
  }, [token]);

  const filtered = useMemo(() => {
    if (!searchId) return complaints;
    return complaints.filter((complaint) => String(complaint.id).includes(searchId.trim()));
  }, [complaints, searchId]);

  return (
    <Card>
      <div className="card-head">
        <div>
          <h3>All complaints</h3>
          <p className="muted">Browse the latest complaints and search by ID.</p>
        </div>
        <Button variant="secondary" onClick={loadComplaints} disabled={!token || status === 'loading'}>
          {status === 'loading' ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      {!token ? <Notice tone="warning">Sign in required to view complaints.</Notice> : null}
      {message ? <Notice tone="warning">{message}</Notice> : null}
      <form className="form">
        <Field label="Search by complaint ID">
          <Input
            type="number"
            min="1"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Type an ID..."
          />
        </Field>
      </form>
      <div className="list-stack">
        {filtered.length === 0 && status === 'success' ? (
          <p className="muted">No complaints found.</p>
        ) : null}
        {filtered.map((complaint) => (
          <div key={complaint.id} className="queue-item">
            <div>
              <div className="queue-title">
                <span>#{complaint.id}</span>
                <Badge variant="info">{complaint.status}</Badge>
              </div>
              <p>{complaint.text}</p>
              <p className="muted">Category {complaint.category ?? 'None'}</p>
            </div>
            <div className="queue-meta">
              <div>{new Date(complaint.created_at).toLocaleString()}</div>
              {onSelectComplaint ? (
                <Button
                  variant={selectedComplaintId === complaint.id ? 'primary' : 'secondary'}
                  className="queue-action"
                  onClick={() => onSelectComplaint(complaint.id)}
                >
                  {selectedComplaintId === complaint.id ? 'Selected' : 'Use for feedback'}
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
