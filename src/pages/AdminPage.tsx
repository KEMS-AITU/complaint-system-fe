import { AdminResponseForm } from '../features/admin/AdminResponseForm';
import { ComplaintList } from '../features/admin/ComplaintList';
import { ComplaintStatusForm } from '../features/admin/ComplaintStatusForm';
import { Section } from '../shared/ui/Section';

export const AdminPage = () => {
  return (
    <div className="stack">
      <Section
        title="Staff workspace"
        description="Review all complaints, update status, and send official responses."
      >
        <div className="grid grid-1">
          <ComplaintList />
        </div>
        <div className="grid grid-2">
          <ComplaintStatusForm />
          <AdminResponseForm />
        </div>
      </Section>
    </div>
  );
};
