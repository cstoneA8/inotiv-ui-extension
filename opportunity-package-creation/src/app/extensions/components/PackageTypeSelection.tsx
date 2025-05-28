import React, { useState } from "react";
import { Text, Select, List, Button, Flex } from "@hubspot/ui-extensions";

interface PackageTypeSelectionProps {
  onNext: () => void;
}

export const PackageTypeSelection: React.FC<PackageTypeSelectionProps> = ({
  onNext,
}) => {
  const [packageTypes] = useState([
    { label: "Package Type 1", value: "package_type_1" },
    { label: "Package Type 2", value: "package_type_2" },
    { label: "Package Type 3", value: "package_type_3" },
  ]);
  const [selectedPackageType, setSelectedPackageType] = useState<
    string | undefined
  >(undefined);

  const handlePackageTypeChange = (value: string | number | undefined) => {
    setSelectedPackageType(value as string);
  };

  return (
    <Flex direction="column" gap="md">
      <Select
        options={packageTypes}
        value={selectedPackageType}
        onChange={handlePackageTypeChange}
        label="Type of Package"
      />
      <Flex direction="column" gap="flush">
        <Text>
          Please be aware the following fields will be copied from the Parent
          Opportunity:
        </Text>
        <List variant="unordered-styled">
          <>Owner</>
          <>Account Name</>
          <>Primary Contact</>
          <>Opportunity Type</>
          <>Close Date</>
          <>Stage</>
          <>Forecast Stage</>
          <>Probability</>
          <>Test Article Name</>
          <>Test Article Type</>
          <>ROA</>
          <>ROA Details</>
        </List>
      </Flex>
      <Flex direction="row" justify="end">
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!selectedPackageType}
        >
          Select Studies
        </Button>
      </Flex>
    </Flex>
  );
};
