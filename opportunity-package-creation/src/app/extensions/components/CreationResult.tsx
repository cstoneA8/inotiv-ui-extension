import React from "react";
import { Text, Flex, Heading, Link, Button } from "@hubspot/ui-extensions";
import { CreationResultProps } from "../types";

// TODO: may want to link to a specific view

export const CreationResult = ({
  portalId,
  onBack,
  onRestart,
  result,
}: CreationResultProps & { result: any }) => {
  return (
    <Flex direction="column" gap="md">
      <Heading>Confirmation</Heading>
      <Text>
        The package of deals has been created successfully. Navigate to the{" "}
        <Link href={`/contacts/${portalId}/objects/0-3/views/45625302/list`}>
          list of deals here
        </Link>
        .
      </Text>
      <Flex gap="md">
        <Button onClick={onRestart}>Restart</Button>
      </Flex>
    </Flex>
  );
};
