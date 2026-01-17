import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and Conditions page',
};

const TERMS_AND_CONDITIONS_HTML = `
<h5>Acceptance of Terms</h5>
<p>
  By accessing or using our platform, you agree to comply with and be bound by
  these Terms and Conditions. If you do not agree, please do not use our services.
</p>

<h5>User Responsibilities</h5>
<ul>
  <li>Provide accurate and up-to-date information</li>
  <li>Maintain the confidentiality of your account</li>
  <li>Use the platform in a lawful and respectful manner</li>
</ul>

<h5>Buying and Selling Rules</h5>
<ul>
  <li>All listings must be accurate and truthful</li>
  <li>Payments must be completed through the platform</li>
  <li>Items must be collected within the specified timeframe</li>
</ul>

<h5>Payments and Fees</h5>
<p>
  We may charge service fees for certain transactions. All applicable fees will
  be clearly displayed before you complete a transaction.
</p>

<h5>Termination</h5>
<p>
  We reserve the right to suspend or terminate accounts that violate these terms
  or engage in suspicious or harmful activities.
</p>
`;

const TermsAndConditionPage = () => {
  return <InfoPage title="Terms & Conditions" html={TERMS_AND_CONDITIONS_HTML} />;
};

export default TermsAndConditionPage;
