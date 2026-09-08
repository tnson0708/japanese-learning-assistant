"use client";

import { DomainCard } from "@/components/vocabulary/domain-card";
import { domainMatchesFilters, type Domain, type LevelFilter, type TypeFilter } from "@/lib/vocabulary";

export function DomainGrid({
  domains,
  level,
  type,
  onSelectDomain,
}: {
  domains: Domain[];
  level: LevelFilter;
  type: TypeFilter;
  onSelectDomain: (domainId: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {domains.map((domain) => (
        <DomainCard
          key={domain.id}
          domain={domain}
          matchesFilters={domainMatchesFilters(domain, level, type)}
          onClick={() => onSelectDomain(domain.id)}
        />
      ))}
    </div>
  );
}
