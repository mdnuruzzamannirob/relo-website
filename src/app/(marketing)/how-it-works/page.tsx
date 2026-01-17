import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  title: 'How It Works',
  description: 'How It Works',
};

const HOW_IT_WORKS_HTML = `
<h5>For Buyers</h5>
<ul>
  <li>Browse items from verified sellers in your area</li>
  <li>Purchase items securely through our platform</li>
  <li>Receive a QR code and locker location via email</li>
  <li>Pick up your item at your convenience within 48 hours</li>
  <li>Rate and review your experience</li>
</ul>

<h5>For Sellers</h5>
<ul>
  <li>List your items with photos and descriptions</li>
  <li>Receive purchase notifications when items sell</li>
  <li>Get assigned a locker location near you</li>
  <li>Drop off the item and confirm deposit via QR code</li>
  <li>Receive payment once buyer confirms pickup</li>
</ul>

<h5>Safety Features</h5>
<ul>
  <li>QR code verification for secure access</li>
  <li>Video surveillance at all locker locations</li>
  <li>Buyer protection guarantee</li>
  <li>Verified user reviews and ratings</li>
  <li>24/7 customer support</li>
</ul>
`;

export default function HowItWorks() {
  return <InfoPage title="How It Works" html={HOW_IT_WORKS_HTML} />;
}
