import OfferCard, { Offer } from '@/components/modules/seller/OfferCard';
import HeaderBar from '@/components/shared/HeaderBar';

export const offers: Offer[] = [
  {
    id: '1',
    productName: 'Vintage Leather Jacket',
    productImage: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300',
    buyerName: 'John Smith',
    buyerAvatar: '/demo/user1.jpg',
    offeredAt: '2 hours ago',
    originalPrice: 120,
    offerAmount: 100,
  },
  {
    id: '2',
    productName: 'Woman Bag',
    productImage: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300',
    buyerName: 'Sarah Johnson',
    buyerAvatar: '/demo/user2.jpg',
    offeredAt: '2 hours ago',
    originalPrice: 89.99,
    offerAmount: 62.99,
  },
];

const OffersPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Offers & Negotiations" description="Review and respond to buyer offers" />

      <div className="space-y-6">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
};

export default OffersPage;
