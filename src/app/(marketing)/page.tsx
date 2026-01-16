import Banner from '@/components/modules/home/Banner';
import PopularCategories from '@/components/modules/home/PopularCategories';
import ProductGrid from '@/components/modules/home/ProductGrid';

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
