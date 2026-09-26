import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { NewsArticle } from '@/types';

async function getArticle(slug: string): Promise<NewsArticle | null> {
  try {
    return await api.get<NewsArticle>(`/api/news/${slug}`, { skipAuth: true });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="py-16">
      <div className="container max-w-2xl mb-10">
        {article.category && <p className="text-gold-700 text-sm mb-4">{article.category}</p>}
        <h1 className="text-3xl md:text-4xl leading-tight mb-4">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          {article.author && <span>{article.author.fullName}</span>}
          {article.author && article.publishedAt && <span>·</span>}
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        </div>
      </div>

      {article.featuredImage && (
        <div className="container max-w-4xl mb-12">
          <div className="relative aspect-[16/9] rounded-md overflow-hidden">
            <Image src={article.featuredImage} alt={article.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      <div className="container max-w-2xl">
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </article>
  );
}
