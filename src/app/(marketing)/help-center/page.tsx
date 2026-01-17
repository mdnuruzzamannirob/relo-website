import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  title: 'Help Center',
  description: 'Help Center',
};

const HELP_CENTER_HTML = `
<h5>Getting Started</h5>
<ul>
  <li>How do I create an account?</li>
  <li>Can I use the same account for buying and selling?</li>
  <li>How do I verify my email address?</li>
</ul>

<h5>Buying on the Platform</h5>
<ul>
  <li>How do I search for items?</li>
  <li>How do I place an order?</li>
  <li>How do I pick up my item from a locker?</li>
  <li>What if there is a problem with my order?</li>
</ul>

<h5>Selling on the Platform</h5>
<ul>
  <li>How do I list an item for sale?</li>
  <li>What happens after my item is sold?</li>
  <li>Where do I drop off my item?</li>
  <li>When will I receive my payment?</li>
</ul>

<h5>Payments & Safety</h5>
<ul>
  <li>Is my payment information secure?</li>
  <li>What payment methods are supported?</li>
  <li>How does buyer protection work?</li>
</ul>

<h5>Support & Communication</h5>
<ul>
  <li>How do I contact customer support?</li>
  <li>Can I message a buyer or seller?</li>
  <li>How do I report a user or listing?</li>
</ul>
`;

export default function HelpCenterPage() {
  return <InfoPage title="Help Center" html={HELP_CENTER_HTML} />;
}
