import ListingForm from '@/components/modules/seller/ListingForm';
import HeaderBar from '@/components/shared/HeaderBar';

export const metadata = {
  title: 'New Listing',
  description: 'Create a new listing for your products.',
};

const NewListingPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="New Listing" description="Create a new listing for your products." />
      <ListingForm type="create" />
    </section>
  );
};

export default NewListingPage;
