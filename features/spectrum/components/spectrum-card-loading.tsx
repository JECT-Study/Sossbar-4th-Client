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
      <div className="flex h-[136px] w-[93px] flex-col gap-2">
        {SPECTRUM_ROW_KEYS.map((key) => (
          <div key={key} className="flex h-7 items-center">
            <div className={`${pulse} h-3.5 w-full`} />
          </div>
        ))}
      </div>

      <div className="mx-6 flex h-[136px] w-[286px] flex-col gap-2">
        {SPECTRUM_ROW_KEYS.map((key) => (
          <div key={key} className="flex h-7 items-center">
            <div className={`${pulse} h-1.5 w-full rounded-full`} />
          </div>
        ))}
      </div>

      <div className="flex h-[136px] w-[113px] flex-col gap-2">
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

    <div className="mx-auto mt-4 flex w-[513px] items-end justify-between" style={{ height: 242 }}>
      {DISTRIBUTION_BARS.map(({ key, height }) => (
        <div key={key} className="flex w-[61px] flex-col items-center">
          <div className={`${pulse} mb-0.5 h-[18px] w-8`} />
          <div className={`${pulse} w-[50px] rounded-t`} style={{ height }} />
          <div className={`${pulse} mt-2 h-9 w-full`} />
        </div>
      ))}
    </div>
  </div>
);

export const SpectrumCardLoading = () => (
  <section
    aria-hidden
    className="border-border-gray flex h-[652px] w-[585px] flex-col overflow-hidden rounded-2xl border bg-white"
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
