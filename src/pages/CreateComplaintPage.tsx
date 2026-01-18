import { ComplaintCreateForm } from '../features/client/ComplaintCreateForm';
import { Section } from '../shared/ui/Section';

export const CreateComplaintPage = () => {
  return (
    <div className="stack">
      <Section
        title="Create a complaint"
        description="Share the details and we will investigate right away."
      >
        <div className="grid grid-1">
          <ComplaintCreateForm />
        </div>
      </Section>
    </div>
  );
};
