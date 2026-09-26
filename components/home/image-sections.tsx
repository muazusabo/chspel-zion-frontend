import Image from 'next/image';

const IMG = {
  worship: '/images/worship-fallback.svg',
  bibleStudy: '/images/small.webp',
  outreach: '/images/outreach-fallback.svg',
  prayer1: '/images/bible-sty.jpg',
  prayer2: '/images/sunday.jpg',
  prayer3: '/images/mid.jpg',
};

export function ImageSections() {
  return (
    <>
      {/* Large image + text: Worship */}
      <section className="container py-20 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-5 md:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-md md:col-span-3">
            <Image
              src={IMG.worship}
              alt="Students in worship"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-4 border border-paper/40" />
          </div>
          <div className="md:col-span-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold-700">Worship</p>
            <h3 className="mb-4 text-2xl leading-tight md:text-4xl">
              Lifting our voices together
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every gathering opens with worship — a chance to set aside the
              week and turn our hearts toward God, together as one body.
            </p>
          </div>
        </div>
      </section>

      {/* Portrait image feature: Bible Study */}
      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container grid items-start gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] md:gap-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-lg bg-ink-800 ring-1 ring-paper/10">
            <Image
              src={IMG.bibleStudy}
              alt="Students studying the Bible"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
            />
          </div>
          <div className="max-w-lg md:pt-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold-300">Bible Study</p>
            <h3 className="text-3xl leading-tight text-paper md:text-5xl">
              Digging into Scripture, week after week
            </h3>
            <p className="mt-6 leading-relaxed text-ink-200">
              We make time to read, ask questions, and grow in understanding together.
            </p>
          </div>
        </div>
      </section>

      {/* Split layout: Outreach */}
      <section className="container py-20 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-5 md:gap-16">
          <div className="order-2 md:col-span-2 md:order-1">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold-700">Evangelism &amp; Outreach</p>
            <h3 className="mb-4 text-2xl leading-tight md:text-4xl">
              Carrying faith beyond campus
            </h3>
            <p className="text-slate-600 leading-relaxed">
              From street evangelism to community outreach, we look for ways
              to serve and share the gospel with the people around us.
            </p>
          </div>
          <div className="relative order-1 aspect-[16/10] overflow-hidden rounded-md md:col-span-3 md:order-2">
            <Image
              src={IMG.outreach}
              alt="Evangelism and outreach"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-4 border border-paper/40" />
          </div>
        </div>
      </section>

      {/* Image grid: Prayer moments */}
      <section className="container pb-20 md:pb-28">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-gold-700">Prayer</p>
        <h3 className="mb-10 text-center text-2xl leading-tight md:text-4xl">
          Moments of prayer and fellowship
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative aspect-square rounded-md overflow-hidden col-span-2 md:col-span-1 md:row-span-2 md:aspect-auto">
            <Image src={IMG.prayer1} alt="Prayer meeting" fill sizes="(max-width: 768px) 66vw, 33vw" className="object-cover" />
          </div>
          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image src={IMG.prayer2} alt="Fellowship prayer" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
          </div>
          <div className="relative aspect-square rounded-md overflow-hidden">
            <Image src={IMG.prayer3} alt="Students praying together" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
