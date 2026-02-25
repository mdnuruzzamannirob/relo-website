import Banner from '@/components/modules/marketing/Banner';
import PopularCategories from '@/components/modules/marketing/PopularCategories';
import ProductGrid from '@/components/modules/marketing/ProductGrid';

const HomePage = () => {
  return (
    <>
      <Banner />
      <ProductGrid
        title="Fresh finds, just for you"
        description="Discover the latest items added near you and pick your next favorite."
        limit={6}
        ctaLabel="Browse all"
        ctaHref="/products"
      />
      <PopularCategories />
    </>
  );
};

export default HomePage;
