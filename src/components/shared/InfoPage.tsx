import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type InfoPageProps = {
  title: string;
  html: string;
  backHref?: string;
  backLabel?: string;
};

export function InfoPage({ title, html, backHref = '/', backLabel = 'Back' }: InfoPageProps) {
  return (
    <div className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      {/* Back Button */}
      <Link href={backHref} className="mb-6 block w-fit">
        <Button>
          <ArrowLeft className="mr-1 size-4" />
          {backLabel}
        </Button>
      </Link>

      <h1 className="text-primary mb-6 text-2xl font-semibold">{title}</h1>

      {/* Content Card */}
      <div className="border-brand-100 rounded-xl border p-8">
        <article className="Prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
