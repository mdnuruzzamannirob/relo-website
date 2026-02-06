import CmsInfoPage from '@/components/shared/CmsInfoPage';

export const metadata = {
  title: 'About Us',
  description: 'About Us Page',
};

const AboutUsPage = () => {
  return <CmsInfoPage title="About Us" pageKey="about-us" />;
};

export default AboutUsPage;
