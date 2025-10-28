import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  accent?: ReactNode;
  children: ReactNode;
}

const SectionCard = ({ title, accent, children }: SectionCardProps) => (
  <section className="rounded-2xl bg-white/90 shadow-sm ring-1 ring-white/60 backdrop-blur-md">
    <header className="border-b border-stone-200 px-6 py-4">
      <h2 className="text-lg font-semibold text-fortune-primary">
        {title}
      </h2>
      {accent ? <div className="mt-1 text-sm text-stone-500">{accent}</div> : null}
    </header>
    <div className="px-6 py-5 text-stone-700">{children}</div>
  </section>
);

export default SectionCard;
