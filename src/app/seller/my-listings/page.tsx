import MyListing from '@/components/modules/seller/MyListing';
import { ProductRowData } from '@/components/modules/seller/ProductRowCard';
import HeaderBar from '@/components/shared/HeaderBar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'My Listings - Seller Dashboard',
  description: 'Seller My Listings page',
};

const products: ProductRowData[] = [
  {
    id: '1',
    title: 'Woman t-shirt',
    size: 'M',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300',
    description:
      'Gently used Nike Air Max 270 in excellent condition. Only worn a few times. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia obcaecati corrupti error nulla, dolores nihil iste, quis quidem nostrum hic, incidunt tempora quo nobis doloremque alias rem! Qui, eveniet blanditiis odio maiores dolor sequi voluptatum explicabo et fuga fugiat delectus porro dolorum hic perspiciatis consequuntur quisquam accusamus accusantium ad atque! Quas similique ratione odit optio recusandae reprehenderit atque dolores, quidem illum alias distinctio, unde illo, minima amet itaque ad consectetur totam iste. Possimus incidunt dolorum eveniet corrupti similique accusamus minus at tempora odio fugit officia magni et adipisci illo rem odit neque laboriosam eius, exercitationem sint earum! Pariatur, at amet?',
    postedDate: '2025-01-10',
    status: 'published',
  },
  {
    id: '2',
    title: 'Woman Bag',
    size: 'M',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300',
    description:
      'Gently used Nike Air Max 270 in excellent condition. Only worn a few times. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia obcaecati corrupti error nulla, dolores nihil iste, quis quidem nostrum hic, incidunt tempora quo nobis doloremque alias rem! Qui, eveniet blanditiis odio maiores dolor sequi voluptatum explicabo et fuga fugiat delectus porro dolorum hic perspiciatis consequuntur quisquam accusamus accusantium ad atque! Quas similique ratione odit optio recusandae reprehenderit atque dolores, quidem illum alias distinctio, unde illo, minima amet itaque ad consectetur totam iste. Possimus incidunt dolorum eveniet corrupti similique accusamus minus at tempora odio fugit officia magni et adipisci illo rem odit neque laboriosam eius, exercitationem sint earum! Pariatur, at amet?',
    postedDate: '2025-01-10',
    status: 'sold',
  },
];

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

      <MyListing products={products} />
    </section>
  );
};

export default MyListingsPage;
