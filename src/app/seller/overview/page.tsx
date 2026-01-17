import StatCard from '@/components/shared/StatCard';
import ActivityItem from '@/components/modules/seller/ActivityItem';
import { Button } from '@/components/ui/button';
import { DollarSign, Package, Clock, Boxes } from 'lucide-react';

export const metadata = {
  description: 'Seller Overview page',
  title: 'Seller Overview - Seller Dashboard',
};

const OverviewPage = () => {
  return (
    <section className="bg-brand-50 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-primary text-2xl font-semibold">Seller Dashboard</h1>
        <p className="text-sm text-slate-500">Track your sales and manage your listings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<DollarSign className="text-green-600" />}
          iconClassname="bg-green-50"
          label="Total Earnings"
          value="$1,234"
        />

        <StatCard
          icon={<Boxes className="text-blue-600" />}
          iconClassname="bg-blue-50"
          label="Active Listings"
          value="24"
        />

        <StatCard
          icon={<Clock className="text-orange-600" />}
          iconClassname="bg-orange-50"
          label="Pending Orders"
          value="3"
        />

        <StatCard
          icon={<Package className="text-purple-600" />}
          iconClassname="bg-purple-50"
          label="Items Sold"
          value="48"
        />
      </div>

      {/* Recent Activity */}
      <div className="border-brand-100 space-y-3 rounded-xl border bg-white p-4">
        <h3 className="text-primary mb-4 font-medium">Recent Activity</h3>

        <ActivityItem
          color="green"
          title="New order received"
          description="Ray-Ban Aviator Sunglasses · Buyer: Mike Chen"
          time="1 hour ago"
        />

        <ActivityItem
          color="blue"
          title="Locker assigned"
          description="Nike Air Max at Locker L-42 · Jan 12"
          time="3 hours ago"
        />

        <ActivityItem
          color="orange"
          title="New offer received"
          description="$100 offer on Vintage Leather Jacket"
          time="5 hours ago"
        />
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* CTA */}
        <div className="bg-primary rounded-xl p-6 text-white">
          <h4 className="text-lg font-semibold">Ready to sell more?</h4>
          <p className="mt-1 text-sm text-slate-300">
            List a new item and reach thousands of buyers
          </p>
          <Button className="mt-4 bg-white text-slate-900 hover:bg-slate-100">
            Create New Listing
          </Button>
        </div>

        {/* Payout */}
        <div className="border-brand-100 rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Available to Withdraw</p>
          <p className="text-primary mt-2 text-2xl font-semibold">$458.00</p>
          <Button className="mt-4 bg-green-600 hover:bg-green-700">Request Payout</Button>
        </div>
      </div>
    </section>
  );
};

export default OverviewPage;
