import { Card } from '../shared/ui/Card';
import { Section } from '../shared/ui/Section';

export const HomePage = () => {
  return (
    <div className="stack">
      <Section
        title="Welcome to Complaint Hub"
        description="A simple place to create a complaint, check its status, and share feedback."
      >
        <div className="grid grid-2">
          <Card>
            <h3>Get started</h3>
            <ul className="list">
              <li>Create an account or sign in to continue.</li>
              <li>Submit your complaint in just a few steps.</li>
              <li>Keep your complaint ID to track progress.</li>
            </ul>
          </Card>
          <Card>
            <h3>Submit a complaint</h3>
            <ul className="list">
              <li>Describe what happened and add a category.</li>
              <li>Get a complaint ID instantly.</li>
              <li>Track status updates any time.</li>
            </ul>
          </Card>
          <Card>
            <h3>Share feedback</h3>
            <ul className="list">
              <li>Let us know if the resolution worked.</li>
              <li>Feedback helps improve response quality.</li>
              <li>Optional acceptance flags are supported.</li>
            </ul>
          </Card>
          <Card>
            <h3>Need help?</h3>
            <p>
              Our support team reviews each complaint and keeps you updated as the status
              changes. Reach out if you need assistance.
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
};
