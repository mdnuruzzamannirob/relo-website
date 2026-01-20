import ListingForm from '@/components/modules/seller/ListingForm';
import HeaderBar from '@/components/shared/HeaderBar';
export const metadata = {
  title: 'Edit Listing',
  description: 'Edit your product listing details.',
};

const EditListingPage = () => {
  const dummyData = {
    id: '1',
    title: 'iPhone 15 Pro',
    price: '999',
    category: 'electronics',
    brand: 'Apple',
    size: 'Standard',
    condition: 'new',
    lockerSize: 'medium',
    location: 'dhaka',
    description: 'Brand new condition, rarely used.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
  };

  return (
    <section className="space-y-6">
      <HeaderBar title="Edit Listing" description="Edit your product listing details." />

      <ListingForm type="edit" initialData={dummyData} />
    </section>
  );
};

export default EditListingPage;
