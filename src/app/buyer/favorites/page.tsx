import Favorites from '@/components/modules/buyer/Favorites';
import HeaderBar from '@/components/shared/HeaderBar';
import { Product } from '@/components/shared/ProductCard';

export const metadata = {
  title: 'Favorites - Buyer Dashboard',
  description: 'Buyer Favorites page',
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Men t-shirt',
    price: 24,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
  },
  {
    id: 2,
    name: 'Men t-shirt',
    price: 30,
    size: 'L',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
  },
  {
    id: 3,
    name: 'Woman Cloth',
    price: 40,
    size: 'S',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
  },
  {
    id: 4,
    name: 'Men t-shirt',
    price: 24,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
  },
  {
    id: 5,
    name: 'Men t-shirt, Pant',
    price: 80,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
  },
  {
    id: 6,
    name: 'Men t-shirt',
    price: 24,
    size: 'M',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
  },
];

const FavoritesPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Favorites" description="Items you're following" />

      <div className="space-y-4">
        <h3 className="text-primary font-medium">Saved Items ({products.length || 0})</h3>
        <Favorites favorites={products} />
      </div>
    </section>
  );
};

export default FavoritesPage;
