import CmsInfoPage from '@/components/shared/CmsInfoPage';

export const metadata = {
  title: 'Help Center',
  description: 'Help Center',
};

const ADMIN_ID = '69a256c5a7dcdce70a6fd733';

export default function HelpCenterPage() {
  return (
    <CmsInfoPage
      title="Help Center"
      pageKey="help-center"
      contactSupportHref={`/chat?userId=${ADMIN_ID}`}
    />
  );
}
