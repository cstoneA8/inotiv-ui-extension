import React, { useState } from "react";
import { Flex, hubspot } from "@hubspot/ui-extensions";

import { ExtensionProps } from "./types";
import { PackageTypeSelection } from "./components/PackageTypeSelection";
import { StudySelection } from "./components/StudySelection";
import { CreationResult } from "./components/CreationResult";

// Mock data for packages
const MOCK_PACKAGES = [
  {
    id: "1",
    opportunityType: "Preclinical",
    discipline: "Toxicology",
    subDiscipline: "General Toxicology",
    subGroup: "Acute",
    species: "Rat",
    leadSite: "Site A",
    sortOrder: 1,
  },
  {
    id: "2",
    opportunityType: "Preclinical",
    discipline: "Toxicology",
    subDiscipline: "General Toxicology",
    subGroup: "Subchronic",
    species: "Mouse",
    leadSite: "Site B",
    sortOrder: 2,
  },
  {
    id: "3",
    opportunityType: "Clinical",
    discipline: "Pharmacology",
    subDiscipline: "Clinical Pharmacology",
    subGroup: "Phase I",
    species: "Human",
    leadSite: "Site C",
    sortOrder: 3,
  },
  {
    id: "4",
    opportunityType: "Preclinical",
    discipline: "Safety Pharmacology",
    subDiscipline: "Cardiovascular",
    subGroup: "Telemetry",
    species: "Dog",
    leadSite: "Site A",
    sortOrder: 4,
  },
  {
    id: "5",
    opportunityType: "Clinical",
    discipline: "Pharmacology",
    subDiscipline: "Clinical Pharmacology",
    subGroup: "Phase II",
    species: "Human",
    leadSite: "Site D",
    sortOrder: 5,
  },
  {
    id: "6",
    opportunityType: "Preclinical",
    discipline: "Toxicology",
    subDiscipline: "Genetic Toxicology",
    subGroup: "Ames",
    species: "Bacteria",
    leadSite: "Site B",
    sortOrder: 6,
  },
  {
    id: "7",
    opportunityType: "Preclinical",
    discipline: "Safety Pharmacology",
    subDiscipline: "Respiratory",
    subGroup: "Plethysmography",
    species: "Rat",
    leadSite: "Site C",
    sortOrder: 7,
  },
  {
    id: "8",
    opportunityType: "Clinical",
    discipline: "Pharmacology",
    subDiscipline: "Clinical Pharmacology",
    subGroup: "Phase III",
    species: "Human",
    leadSite: "Site A",
    sortOrder: 8,
  },
  {
    id: "9",
    opportunityType: "Preclinical",
    discipline: "Toxicology",
    subDiscipline: "General Toxicology",
    subGroup: "Chronic",
    species: "Rat",
    leadSite: "Site D",
    sortOrder: 9,
  },
  {
    id: "10",
    opportunityType: "Preclinical",
    discipline: "Safety Pharmacology",
    subDiscipline: "Central Nervous System",
    subGroup: "FOB",
    species: "Mouse",
    leadSite: "Site B",
    sortOrder: 10,
  },
  {
    id: "11",
    opportunityType: "Clinical",
    discipline: "Pharmacology",
    subDiscipline: "Clinical Pharmacology",
    subGroup: "Phase IV",
    species: "Human",
    leadSite: "Site C",
    sortOrder: 11,
  },
  {
    id: "12",
    opportunityType: "Preclinical",
    discipline: "Toxicology",
    subDiscipline: "Genetic Toxicology",
    subGroup: "Micronucleus",
    species: "Mouse",
    leadSite: "Site A",
    sortOrder: 12,
  },
];

hubspot.extend(({ context, runServerlessFunction, actions }) => {
  if ("fetchCrmObjectProperties" in actions) {
    return (
      <Extension
        context={context}
        runServerless={runServerlessFunction}
        fetchProperties={actions.fetchCrmObjectProperties}
      />
    );
  }
  return <></>;
});

const Extension = ({
  context,
  runServerless,
  fetchProperties,
}: ExtensionProps) => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState(1);

  // Global
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackageType, setSelectedPackageType] = useState<
    string | undefined
  >(undefined);

  console.log("context", context);
  const portalId = context.portal.id;

  const handleBack = () => {
    setCurrentScreen(1);
  };

  const handleNext = (packageType?: string) => {
    setError(null);
    if (packageType) {
      setSelectedPackageType(packageType);
    }
    setCurrentScreen(2);
  };

  return (
    <Flex direction="column">
      {currentScreen === 1 && (
        <PackageTypeSelection
          onNext={handleNext}
          onPackageTypeSelect={setSelectedPackageType}
        />
      )}
      {currentScreen === 2 && (
        <StudySelection
          onBack={handleBack}
          onNext={() => setCurrentScreen(3)}
          selectedPackageType={selectedPackageType}
        />
      )}
      {currentScreen === 3 && (
        <CreationResult portalId={portalId} onBack={handleBack} />
      )}
    </Flex>
  );
};
