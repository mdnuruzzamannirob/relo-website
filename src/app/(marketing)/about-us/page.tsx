import { InfoPage } from '@/components/shared/InfoPage';

export const metadata = {
  title: 'About Us',
  description: 'About Us Page',
};

const ABOUT_US_HTML = `
<h5>Who We Are</h5>
<p>
  We are a community-driven marketplace designed to make buying and selling
  simple, secure, and convenient. Our platform connects buyers and sellers
  through trusted locker-based exchanges.
</p>

<h5>Our Mission</h5>
<p>
  Our mission is to create a safe and reliable environment where people can
  exchange items with confidence, transparency, and ease.
</p>

<h5>What We Offer</h5>
<ul>
  <li>Secure locker-based item exchange</li>
  <li>Verified users and trusted sellers</li>
  <li>Simple and transparent payment process</li>
  <li>Customer support when you need it</li>
</ul>

<h5>Why Choose Us</h5>
<ul>
  <li>Safety-first approach</li>
  <li>Easy-to-use platform</li>
  <li>Fair policies for buyers and sellers</li>
  <li>Growing and trusted community</li>
</ul>
`;

const AboutUsPage = () => {
  return <InfoPage title="About Us" html={ABOUT_US_HTML} />;
};

export default AboutUsPage;
