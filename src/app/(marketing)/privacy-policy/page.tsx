import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  description: 'Privacy Policy',
  title: 'Privacy Policy',
};

const PRIVACY_POLICY_HTML = `
<h5>Introduction</h5>
<p>
  This Privacy Policy explains how we collect, use, disclose, and protect your
  personal information when you use our platform. By accessing or using our
  services, you agree to the practices described in this policy.
</p>

<h5>Information We Collect</h5>
<ul>
  <li>Personal information such as name, email address, and phone number</li>
  <li>Account credentials and profile details</li>
  <li>Transaction and payment-related information</li>
  <li>Device, browser, and usage data</li>
</ul>

<h5>How We Use Your Information</h5>
<ul>
  <li>To create and manage your account</li>
  <li>To process transactions and payments securely</li>
  <li>To communicate updates, notifications, and support messages</li>
  <li>To improve our platform, services, and user experience</li>
</ul>

<h5>Sharing of Information</h5>
<p>
  We do not sell your personal information. We may share your information only
  in the following situations:
</p>
<ul>
  <li>With trusted service providers who assist in operating our platform</li>
  <li>When required by law or legal obligations</li>
  <li>To protect the rights, safety, and security of our users and platform</li>
</ul>

<h5>Data Security</h5>
<p>
  We implement industry-standard security measures to protect your personal
  information against unauthorized access, alteration, disclosure, or
  destruction.
</p>

<h5>Cookies and Tracking Technologies</h5>
<p>
  We use cookies and similar technologies to enhance your experience, analyze
  usage patterns, and improve our services. You can control cookie preferences
  through your browser settings.
</p>

<h5>Your Rights</h5>
<ul>
  <li>Access and review your personal information</li>
  <li>Request correction or deletion of your data</li>
  <li>Opt out of marketing communications</li>
  <li>Withdraw consent where applicable</li>
</ul>

<h5>Third-Party Links</h5>
<p>
  Our platform may contain links to third-party websites. We are not responsible
  for the privacy practices or content of those external sites.
</p>

<h5>Changes to This Privacy Policy</h5>
<p>
  We may update this Privacy Policy from time to time. Any changes will be
  posted on this page, and the updated policy will take effect immediately upon
  publication.
</p>

<h5>Contact Us</h5>
<p>
  If you have any questions or concerns about this Privacy Policy, please
  contact our support team.
</p>
`;

const PrivacyPolicyPage = () => {
  return <InfoPage title="Privacy Policy" html={PRIVACY_POLICY_HTML} />;
};

export default PrivacyPolicyPage;
