const hubspot = require("@hubspot/api-client");

exports.main = async (context = {}, sendResponse) => {
  const accessToken = process.env["PRIVATE_APP_ACCESS_TOKEN"];

  const { propertiesToSend, parameters } = context;

  console.log("Selected studies:", parameters.selectedStudies);

  try {
    // Fetch the deal's contact and companyassociations
    const objectId = propertiesToSend.hs_object_id;
    const url = `https://api.hubapi.com/crm/v3/objects/0-3/${objectId}?associations=0-1,0-2`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        JSON.stringify({
          message: "HubSpot API Error",
          status: response.status,
          statusText: response.statusText,
          body: errorData,
        })
      );
    }

    const dealWithAssociations = await response.json();

    // Add debugging to see what we actually received
    console.log(
      "Deal with associations:",
      JSON.stringify(dealWithAssociations, null, 2)
    );

    // Add defensive checks for associations
    const companies =
      dealWithAssociations.associations?.companies?.results || [];
    const contacts = dealWithAssociations.associations?.contacts?.results || [];

    const associatedData = {
      // Get unique company IDs (using Set to remove duplicates)
      companyIds: [...new Set(companies.map((company) => company.id))],

      // Get primary contact ID (filter for type "primary_contact")
      primaryContactId: contacts.find(
        (contact) => contact.type === "primary_contact"
      )?.id,

      // Include the selected studies data
      selectedStudies: parameters.selectedStudies,

      // Include the original properties
      dealProperties: propertiesToSend,

      // Include the generated values
      generatedValues: {
        package_document__dsa_: true,
        opp_created_by_package: true,
      },
    };

    const dealPayloads = prepareDealPayloads(associatedData);
    const createdDeals = await createBulkDeals(dealPayloads, accessToken);

    return {
      success: true,
      message: "Deals created successfully",
      data: createdDeals,
    };
  } catch (e) {
    console.error("Full error object:", e);
    throw e;
  }
};

function prepareDealPayloads(associatedData) {
  return associatedData.selectedStudies.map((study) => {
    const baseAssociations = [];

    // Only add primary contact association if we have a contact ID
    if (associatedData.primaryContactId) {
      baseAssociations.push({
        to: { id: associatedData.primaryContactId },
        types: [
          {
            associationCategory: "USER_DEFINED",
            associationTypeId: process.env.PRIMARY_CONTACT_ASSOC_ID,
          },
        ],
      });
    }

    // Add parent deal association
    baseAssociations.push({
      to: { id: associatedData.dealProperties.hs_object_id },
      types: [
        {
          associationCategory: "USER_DEFINED",
          associationTypeId: process.env.CHILD_DEAL_ASSOC_ID,
        },
      ],
    });

    // Add company associations for all company IDs
    const companyAssociations = associatedData.companyIds.map((companyId) => ({
      to: { id: companyId },
      types: [
        {
          associationCategory: "HUBSPOT_DEFINED",
          associationTypeId: process.env.DEAL_TO_COMPANY_ASSOC_ID,
        },
      ],
    }));

    // Create the combined dealname
    const parentDealName = associatedData.dealProperties.dealname || "";
    const opportunityTitle = study.opportunity_title || "";
    const combinedDealName = `${parentDealName}_${opportunityTitle}`;

    console.log("Deal name creation details:", {
      parentDealName,
      opportunityTitle,
      combinedDealName,
      studyProperties: study,
    });

    // Create a copy of study without opportunity_title
    const { opportunity_title, ...studyWithoutTitle } = study;

    return {
      properties: {
        ...associatedData.dealProperties,
        ...studyWithoutTitle,
        ...associatedData.generatedValues,
        dealname: combinedDealName, // Override the dealname with our combined version
      },
      associations: [...baseAssociations, ...companyAssociations],
    };
  });
}

async function createBulkDeals(dealPayloads, accessToken) {
  const url = "https://api.hubapi.com/crm/v3/objects/deals/batch/create";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ inputs: dealPayloads }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(
      "Failed payload:",
      JSON.stringify({ inputs: dealPayloads }, null, 2)
    );
    throw new Error(
      JSON.stringify({
        message: "HubSpot Bulk Create API Error",
        status: response.status,
        statusText: response.statusText,
        body: errorData,
      })
    );
  }

  return await response.json();
}
