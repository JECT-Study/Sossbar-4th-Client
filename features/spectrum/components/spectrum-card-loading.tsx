const SPECTRUM_ROW_KEYS = ['row-support-lead', 'row-speed', 'row-flexibility', 'row-orientation'] as const;

const DISTRIBUTION_BARS = [
  { key: 'support', height: 80 },
  { key: 'lead', height: 130 },
  { key: 'fast', height: 160 },
  { key: 'careful', height: 70 },
  { key: 'flexible', height: 110 },
  { key: 'planned', height: 90 },
  { key: 'result', height: 140 },
  { key: 'relation', height: 60 },
] as const;

const pulse = 'animate-pulse rounded bg-action-gray-light';

const SpectrumSkeleton = () => (
  <div className="mt-7">
    <div className={`${pulse} h-6 w-16`} />

    <div className="mt-3 flex h-[136px] items-start">
      <div className="flex h-[136px] w-20 shrink-0 flex-col gap-2 lg:w-[93px]">
        {SPECTRUM_ROW_KEYS.map((key) => (
          <div key={key} className="flex h-7 items-center">
            <div className={`${pulse} h-3.5 w-full`} />
          </div>
        ))}
      </div>

      <div className="mx-3 flex h-[136px] min-w-0 flex-1 flex-col gap-2 lg:mx-6 lg:w-[286px] lg:flex-none">
        {SPECTRUM_ROW_KEYS.map((key) => (
          <div key={key} className="flex h-7 items-center">
            <div className={`${pulse} h-1.5 w-full rounded-full`} />
          </div>
        ))}
      </div>

      <div className="flex h-[136px] w-16 shrink-0 flex-col gap-2 lg:w-[113px]">
        {SPECTRUM_ROW_KEYS.map((key) => (
          <div key={key} className="flex h-7 items-center justify-end">
            <div className={`${pulse} h-3.5 w-full`} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DistributionSkeleton = () => (
  <div className="mt-[41px]">
    <div className={`${pulse} h-6 w-44`} />

    <div className="mt-4 flex w-full items-end justify-between gap-1 lg:h-[242px]">
      {DISTRIBUTION_BARS.map(({ key, height }) => (
        <div key={key} className="flex min-w-0 flex-1 flex-col items-center lg:w-[61px] lg:flex-none">
          <div className={`${pulse} mb-0.5 h-[18px] w-8`} />
          <div className={`${pulse} w-full rounded-t lg:w-[50px]`} style={{ height }} />
          <div className={`${pulse} mt-2 h-9 w-full`} />
        </div>
      ))}
    </div>
  </div>
);

export const SpectrumCardLoading = () => (
  <section
    aria-hidden
    className="border-border-gray flex h-auto w-full flex-col overflow-hidden rounded-2xl border bg-white lg:h-[652px] lg:w-[585px]"
  >
    <div className="bg-surface-gray-subtler flex items-center px-6 py-5">
      <div className={`${pulse} h-5 w-44`} />
    </div>
    <div className="flex min-h-0 flex-1 flex-col px-6 py-6">
      <SpectrumSkeleton />
      <DistributionSkeleton />
      <div className={`${pulse} mt-auto h-12 w-full rounded-lg`} />
    </div>
  </section>
);
