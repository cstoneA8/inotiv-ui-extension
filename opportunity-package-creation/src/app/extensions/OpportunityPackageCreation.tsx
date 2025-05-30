import React, { useState } from "react";
import { Flex, hubspot } from "@hubspot/ui-extensions";

import { ExtensionProps } from "./types";
import { PackageTypeSelection } from "./components/PackageTypeSelection";
import { StudySelection } from "./components/StudySelection";
import { CreationResult } from "./components/CreationResult";
import { ErrorScreen } from "./components/ErrorScreen";

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

const Extension = ({ context }: ExtensionProps) => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState(1);

  // Global
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackageType, setSelectedPackageType] = useState<
    string | undefined
  >(undefined);
  const [creationResult, setCreationResult] = useState<any>(null);

  console.log("context", context);
  const portalId = context.portal.id;

  const handleBack = () => {
    setCurrentScreen(1);
    setError(null);
  };

  const handleNext = (packageType?: string, result?: any) => {
    setError(null);
    if (packageType) {
      setSelectedPackageType(packageType);
      setCurrentScreen(2);
    }
    if (result) {
      setCreationResult(result);
      setCurrentScreen(3);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (error) {
    return <ErrorScreen error={error} onBack={handleBack} />;
  }

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
          onNext={handleNext}
          selectedPackageType={selectedPackageType}
        />
      )}
      {currentScreen === 3 && (
        <CreationResult
          portalId={portalId}
          onBack={handleBack}
          result={creationResult}
        />
      )}
    </Flex>
  );
};
