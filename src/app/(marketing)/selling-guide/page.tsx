import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  title: 'Selling Guide',
  description: 'Selling Guide Page',
};

const SELLING_GUIDE_HTML = `
<h5>Introduction</h5>
<p>
  This Selling Guide explains how to list items, manage orders, and receive
  payments safely and efficiently on our platform.
</p>

<h5>Creating a Listing</h5>
<ul>
  <li>Add clear photos and accurate descriptions</li>
  <li>Set a fair price based on item condition</li>
  <li>Select the appropriate category</li>
</ul>

<h5>When Your Item Sells</h5>
<ul>
  <li>Receive a notification when a buyer places an order</li>
  <li>Check the assigned locker drop-off location</li>
  <li>Prepare the item securely for drop-off</li>
</ul>

<h5>Dropping Off the Item</h5>
<ul>
  <li>Visit the assigned locker location</li>
  <li>Place the item inside the locker</li>
  <li>Confirm the deposit by scanning the QR code</li>
</ul>

<h5>Getting Paid</h5>
<ul>
  <li>Payment is held securely until the buyer collects the item</li>
  <li>Funds are released once pickup is confirmed</li>
  <li>Track payment status from your dashboard</li>
</ul>

<h5>Seller Best Practices</h5>
<ul>
  <li>Respond quickly to buyer inquiries</li>
  <li>Ensure item accuracy and condition</li>
  <li>Maintain positive ratings and reviews</li>
</ul>
`;

const SellingGuidePage = () => {
  return <InfoPage title="Selling Guide" html={SELLING_GUIDE_HTML} />;
};

export default SellingGuidePage;
