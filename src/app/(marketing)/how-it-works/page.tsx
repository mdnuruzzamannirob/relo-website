import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const HOW_IT_WORKS_SECTIONS = [
  {
    title: 'For Buyers',
    items: [
      'Browse items from verified sellers in your area',
      'Purchase items securely through our platform',
      'Receive a QR code and locker location via email',
      'Pick up your item at your convenience within 48 hours',
      'Rate and review your experience',
    ],
  },
  {
    title: 'For Sellers',
    items: [
      'List your items with photos and descriptions',
      'Receive purchase notifications when items sell',
      'Get assigned a locker location near you',
      'Drop off the item and confirm deposit via QR code',
      'Receive payment once buyer confirms pickup',
    ],
  },
  {
    title: 'Safety Features',
    items: [
      'QR code verification for secure access',
      'Video surveillance at all locker locations',
      'Buyer protection guarantee',
      'Verified user reviews and ratings',
      '24/7 customer support',
    ],
  },
];

export default function HowItWorks() {
  return (
    <div className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      {/* Back Button */}
      <Link href="/" className="mb-6 block w-fit">
        <Button>
          <ArrowLeft className="mr-1 size-4" />
          Back
        </Button>
      </Link>

      <h1 className="text-primary mb-6 text-2xl font-semibold">How It Works</h1>

      {/* Card */}
      <div className="border-brand-100 rounded-xl border p-8">
        {HOW_IT_WORKS_SECTIONS.map((section) => (
          <section key={section.title} className="mb-8 last:mb-0">
            <h2 className="text-primary mb-3 text-lg font-semibold">{section.title}</h2>

            <ul className="list-disc space-y-2 pl-10 text-slate-500">
              {section.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
