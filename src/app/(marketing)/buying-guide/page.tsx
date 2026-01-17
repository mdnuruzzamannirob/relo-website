import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  title: 'Buying Guide',
  description: 'Buying Guide page',
};

const BUYING_GUIDE_HTML = `
<h5>Introduction</h5>
<p>
  This Buying Guide will help you understand how to browse, purchase, and
  securely collect items from our platform with confidence.
</p>

<h5>Finding Items</h5>
<ul>
  <li>Browse listings from verified sellers in your area</li>
  <li>Use search and filters to find items quickly</li>
  <li>Check item descriptions, photos, and seller ratings</li>
</ul>

<h5>Placing an Order</h5>
<ul>
  <li>Select the item you want to purchase</li>
  <li>Review the price, condition, and pickup details</li>
  <li>Complete payment securely through the platform</li>
</ul>

<h5>Pickup Process</h5>
<ul>
  <li>Receive a QR code and locker location after purchase</li>
  <li>Visit the locker within the allowed pickup time</li>
  <li>Scan the QR code to unlock and collect your item</li>
</ul>

<h5>After Pickup</h5>
<ul>
  <li>Confirm successful pickup in the app</li>
  <li>Rate and review the seller</li>
  <li>Contact support if there are any issues</li>
</ul>

<h5>Buyer Safety Tips</h5>
<ul>
  <li>Only communicate through the platform</li>
  <li>Inspect the item before leaving the locker location</li>
  <li>Report any problems immediately</li>
</ul>
`;

const BuyingGuidePage = () => {
  return <InfoPage title="Buying Guide" html={BUYING_GUIDE_HTML} />;
};

export default BuyingGuidePage;
