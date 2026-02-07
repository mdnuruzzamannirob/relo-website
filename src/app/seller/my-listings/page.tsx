import HeaderBar from '@/components/shared/HeaderBar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MyListing from '@/components/modules/seller/MyListing';

export const metadata = {
  title: 'My Listings - Seller Dashboard',
  description: 'Seller My Listings page',
};

const MyListingsPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar
        title="My Listings"
        description="Track and manage your products"
        rightContent={
          <Link href="/seller/my-listings/new-listing">
            <Button className="w-full">
              <Plus /> New Listing
            </Button>
          </Link>
        }
      />

      <MyListing />
    </section>
  );
};

export default MyListingsPage;
