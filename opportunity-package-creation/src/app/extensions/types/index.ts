import type {
  FetchCrmObjectPropertiesAction,
  ServerlessFuncRunner,
  CrmContext,
  GenericContext,
  SettingsContext,
} from "@hubspot/ui-extensions";

export interface ExtensionProps {
  context: CrmContext | GenericContext | SettingsContext;
  runServerless: ServerlessFuncRunner;
  fetchProperties: FetchCrmObjectPropertiesAction;
}

export interface CreationResultProps {
  portalId: number;
  onBack?: () => void;
}

// Package Types from the getPackageTypes serverless function
export interface PackageTypeOption {
  label: string;
  value: string;
  description: string;
  displayOrder: number;
  hidden: boolean;
}
