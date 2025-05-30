import React from "react";
import { Text, Button, Flex } from "@hubspot/ui-extensions";

interface ErrorScreenProps {
  error: string;
  onBack?: () => void;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  onBack,
  onRetry,
}) => {
  return (
    <Flex direction="column" gap="md" align="center">
      <Text variant="bodytext">An error occurred</Text>
      <Text variant="bodytext">{error}</Text>
      <Flex gap="sm">
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Retry
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
