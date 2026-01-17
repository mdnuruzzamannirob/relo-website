import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  title: 'Trust and Safety',
  description: 'Trust and Safety page',
};

const TRUST_AND_SAFETY_HTML = `
<h5>Our Commitment to Safety</h5>
<p>
  Trust and safety are at the core of our platform. We work continuously to
  create a secure environment where buyers and sellers can interact with
  confidence.
</p>

<h5>User Verification</h5>
<ul>
  <li>Email and phone number verification for all users</li>
  <li>Account monitoring to prevent fraudulent activity</li>
  <li>Verified user profiles and ratings</li>
</ul>

<h5>Secure Transactions</h5>
<ul>
  <li>Payments processed through secure and encrypted systems</li>
  <li>Funds held safely until item pickup is confirmed</li>
  <li>Protection against unauthorized transactions</li>
</ul>

<h5>Locker & Pickup Security</h5>
<ul>
  <li>QR code–based access to locker compartments</li>
  <li>Video surveillance at all locker locations</li>
  <li>Time-limited access to prevent misuse</li>
</ul>

<h5>Community Guidelines</h5>
<ul>
  <li>Respectful communication between users</li>
  <li>Accurate and honest listings</li>
  <li>Zero tolerance for scams, abuse, or harmful behavior</li>
</ul>

<h5>Reporting & Support</h5>
<ul>
  <li>Easy reporting of suspicious users or listings</li>
  <li>Dedicated support team to investigate issues</li>
  <li>24/7 customer assistance for urgent concerns</li>
</ul>

<h5>Continuous Improvement</h5>
<p>
  We regularly review and improve our safety measures to stay ahead of potential
  risks and ensure a trusted experience for everyone on our platform.
</p>
`;

const TrustAndSafetyPage = () => {
  return <InfoPage title="Trust & Safety" html={TRUST_AND_SAFETY_HTML} />;
};

export default TrustAndSafetyPage;
