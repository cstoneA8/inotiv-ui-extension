import React, { useState, useMemo } from "react";
import {
  Text,
  Button,
  Flex,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
  Checkbox,
} from "@hubspot/ui-extensions";

interface StudySelectionProps {
  onBack: () => void;
  onNext: () => void;
}

export const StudySelection: React.FC<StudySelectionProps> = ({
  onBack,
  onNext,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [packages] = useState([
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
    // ... Add more mock packages as needed
  ]);
  const itemsPerPage = 10;

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId]
    );
  };

  // Calculate which packages are on the current page
  const currentPagePackages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return packages.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, packages]);

  // Check if all packages on current page are selected
  const areAllSelected = useMemo(() => {
    return currentPagePackages.every((pkg) =>
      selectedPackages.includes(pkg.id)
    );
  }, [currentPagePackages, selectedPackages]);

  // Handle select all for current page
  const handleSelectAll = () => {
    if (areAllSelected) {
      // If all are selected, deselect all on current page
      setSelectedPackages((prev) =>
        prev.filter((id) => !currentPagePackages.some((pkg) => pkg.id === id))
      );
    } else {
      // If not all are selected, select all on current page
      const newSelected = new Set([...selectedPackages]);
      currentPagePackages.forEach((pkg) => newSelected.add(pkg.id));
      setSelectedPackages(Array.from(newSelected));
    }
  };

  return (
    <Flex direction="column" gap="md">
      <Text>List of Studies</Text>
      <Flex gap="md">
        <Text>Total Packages: {packages.length}</Text>
        <Text>Selected Packages: {selectedPackages.length}</Text>
      </Flex>
      <Table
        paginated={true}
        page={currentPage}
        pageCount={Math.ceil(packages.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      >
        <TableHead>
          <TableRow>
            <TableHeader width="min">
              <Checkbox checked={areAllSelected} onChange={handleSelectAll} />
            </TableHeader>
            <TableHeader width="min">Opportunity Type</TableHeader>
            <TableHeader width="min">Discipline</TableHeader>
            <TableHeader width="min">Sub Discipline</TableHeader>
            <TableHeader width="min">Sub Group</TableHeader>
            <TableHeader width="min">Species</TableHeader>
            <TableHeader width="min">Lead Site</TableHeader>
            <TableHeader width="min">Sort Order</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {packages.map((pkg, index) => (
            <TableRow key={pkg.id || index}>
              <TableCell>
                <Checkbox
                  checked={selectedPackages.includes(pkg.id)}
                  onChange={() => handlePackageSelect(pkg.id)}
                />
              </TableCell>
              <TableCell>{pkg.opportunityType}</TableCell>
              <TableCell>{pkg.discipline}</TableCell>
              <TableCell>{pkg.subDiscipline}</TableCell>
              <TableCell>{pkg.subGroup}</TableCell>
              <TableCell>{pkg.species}</TableCell>
              <TableCell>{pkg.leadSite}</TableCell>
              <TableCell>{pkg.sortOrder}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Flex gap="sm" justify="end">
        <Button variant="secondary" onClick={onBack}>
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={selectedPackages.length === 0}
        >
          Finish
        </Button>
      </Flex>
    </Flex>
  );
};
