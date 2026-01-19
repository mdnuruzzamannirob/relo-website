import Rating from '@/components/modules/seller/Rating';
import HeaderBar from '@/components/shared/HeaderBar';

const RatingPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Ratings" description="Rating the buyer" />
      <Rating />
    </section>
  );
};

export default RatingPage;
