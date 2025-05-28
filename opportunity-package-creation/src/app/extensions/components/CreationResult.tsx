import React, { useState } from "react";
import { Text, Flex, Heading, Link } from "@hubspot/ui-extensions";
import { CreationResultProps } from "../types";

// TODO: may want to link to a specific view

export const CreationResult = ({ portalId, onBack }: CreationResultProps) => {
  const [creationResult, setCreationResult] = useState(null);

  return (
    <Flex direction="column" gap="md">
      <Heading>Confirmation</Heading>
      <Text>
        The package of deals have been created successfully. Navigate to the{" "}
        <Link href={`/contacts/${portalId}/objects/0-3/views/45625302/list`}>
          list of deals here
        </Link>
        .
      </Text>
    </Flex>
  );
};
