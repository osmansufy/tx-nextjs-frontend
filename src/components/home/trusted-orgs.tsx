const ORGS = [
  "NHS",
  "Hull College",
  "RoSPA",
  "IOSH",
  "City & Guilds",
  "CPD Certification Service",
  "UKRLP",
  "AOHT",
];

export function TrustedOrgs() {
  return (
    <section className="border-y border-neutral-30 bg-white py-10">
      <div className="container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
          <div className="shrink-0 lg:w-[380px]">
            <div className="mb-3 h-0.5 w-24 bg-secondary-500" />
            <h2 className="font-suse text-2xl font-bold leading-snug text-neutral-900 md:text-3xl">
              Trusted by Over 50,000 Organizations Worldwide
            </h2>
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-6">
            {ORGS.map((org) => (
              <div
                key={org}
                className="flex h-14 min-w-[100px] items-center justify-center rounded-md border border-neutral-30 bg-neutral-10 px-4"
              >
                <span className="font-open-sans text-sm font-semibold text-neutral-500">{org}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
