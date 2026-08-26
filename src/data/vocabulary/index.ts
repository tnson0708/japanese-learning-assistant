import type { Domain, Subtopic } from "@/lib/vocabulary";
import { dailyLifeDomain } from "./daily-life";
import { familyRelationshipsDomain } from "./family-relationships";
import { foodDrinkDomain } from "./food-drink";
import { healthDomain } from "./health";
import { shoppingDomain } from "./shopping";
import { travelTransportationDomain } from "./travel-transportation";
import { workTechnologyDomain } from "./work-technology";
import { weatherNatureDomain } from "./weather-nature";
import { emotionsPersonalityDomain } from "./emotions-personality";

// Display order for the domain grid.
export const DOMAINS: Domain[] = [
  dailyLifeDomain,
  familyRelationshipsDomain,
  foodDrinkDomain,
  healthDomain,
  shoppingDomain,
  travelTransportationDomain,
  workTechnologyDomain,
  weatherNatureDomain,
  emotionsPersonalityDomain,
];

export function getAllDomains(): Domain[] {
  return DOMAINS;
}

export function getDomainById(domainId: string): Domain | undefined {
  return DOMAINS.find((d) => d.id === domainId);
}

export function getSubtopicById(domainId: string, subtopicId: string): Subtopic | undefined {
  return getDomainById(domainId)?.subtopics.find((s) => s.id === subtopicId);
}

export function getAllSubtopicsInStudyOrder(): Subtopic[] {
  return DOMAINS.flatMap((d) => d.subtopics).sort((a, b) => a.order - b.order);
}
