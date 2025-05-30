const hubspot = require("@hubspot/api-client");

exports.main = async (context = {}, sendResponse) => {
  const accessToken = process.env["PRIVATE_APP_ACCESS_TOKEN"];
  console.log("context create child deals", context);

  // Get the properties and selected studies from the context
  const { propertiesToSend, parameters } = context;

  console.log("Selected studies:", parameters.selectedStudies);
  console.log("Properties to fetch:", propertiesToSend);

  try {
    // Fetch deal with associations using direct fetch
    const objectId = propertiesToSend.hs_object_id;
    const url = `https://api.hubapi.com/crm/v3/objects/0-3/${objectId}?associations=0-1,0-2`;

    console.log("Making request to:", url);

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
    console.log(
      "Deal with associations:",
      JSON.stringify(dealWithAssociations, null, 2)
    );

    // Extract and organize the data we need
    const associatedData = {
      // Get unique company IDs (using Set to remove duplicates)
      companyIds: [
        ...new Set(
          dealWithAssociations.associations.companies.results.map(
            (company) => company.id
          )
        ),
      ],

      // Get primary contact ID (filter for type "primary_contact")
      primaryContactId: dealWithAssociations.associations.contacts.results.find(
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

    console.log("Organized data:", JSON.stringify(associatedData, null, 2));

    // TODO: Implement actual deal creation logic here
    return {
      success: true,
      message: "Data organized successfully",
      data: associatedData,
    };
  } catch (e) {
    console.error("Full error object:", e);
    throw e;
  }
};
