import Banner from '@/components/modules/marketing/Banner';
import PopularCategories from '@/components/modules/marketing/PopularCategories';
import ProductGrid from '@/components/modules/marketing/ProductGrid';

const HomePage = () => {
  return (
    <>
      <Banner />
      <ProductGrid />
      <PopularCategories />
    </>
  );
};

export default HomePage;
