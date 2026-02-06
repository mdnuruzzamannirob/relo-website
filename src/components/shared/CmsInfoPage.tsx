'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCmsPageQuery, type CmsPageKey } from '@/store/apis/cmsApi';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

type CmsInfoPageProps = {
  title: string;
  pageKey: CmsPageKey;
  backHref?: string;
  backLabel?: string;
};

const CmsInfoPage = ({ title, pageKey, backHref = '/', backLabel = 'Back' }: CmsInfoPageProps) => {
  const { data, isLoading, isError, isFetching, refetch } = useGetCmsPageQuery(pageKey);

  const content = data?.data?.content?.trim();
  const showEmpty = !isLoading && !isError && !content;

  return (
    <div className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      <Link href={backHref} className="mb-6 block w-fit">
        <Button>
          <ArrowLeft className="mr-1 size-4" />
          {backLabel}
        </Button>
      </Link>

      <h1 className="text-primary mb-6 text-2xl font-semibold">{title}</h1>

      <div className="border-brand-100 rounded-xl border p-8">
        {isLoading && (
          <div className="space-y-5">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-start gap-4">
            <div>
              <p className="text-foreground text-lg font-semibold">Content load failed</p>
              <p className="text-muted-foreground">
                We could not fetch the page content. Please try again.
              </p>
            </div>
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCcw className="mr-2 size-4" />
              {isFetching ? 'Retrying...' : 'Try again'}
            </Button>
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col gap-2 text-center">
            <p className="text-foreground text-lg font-semibold">No content yet</p>
            <p className="text-muted-foreground">
              This page does not have content right now. Please check back soon.
            </p>
          </div>
        )}

        {!isLoading && !isError && content && (
          <article className="Prose" dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
    </div>
  );
};

export default CmsInfoPage;
