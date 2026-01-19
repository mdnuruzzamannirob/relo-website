import Review from '@/components/modules/buyer/Review';
import HeaderBar from '@/components/shared/HeaderBar';

const ReviewPage = () => {
  return (
    <section className="space-y-6">
      <HeaderBar title="Reviews" description="Reviews you've written" />
      <Review />
    </section>
  );
};

export default ReviewPage;
