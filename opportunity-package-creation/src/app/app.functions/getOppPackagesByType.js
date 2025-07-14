const hubspot = require("@hubspot/api-client");

exports.main = async (context = {}, sendResponse) => {
  const PROPERTY_NAME = "package_type";
  const objectType = process.env["OPP_PACKAGES_ID"];
  const accessToken = process.env["PRIVATE_APP_ACCESS_TOKEN"];

  const { packageType } = context.parameters;

  const hubspotClient = new hubspot.Client({
    accessToken,
  });

  try {
    const searchRequest = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: PROPERTY_NAME,
              operator: "EQ",
              value: packageType,
            },
          ],
        },
      ],
      properties: [
        "hs_object_id",
        "package_type",
        "project_type_1_v2",
        "project_type_2_v2",
        "project_type_3_v2",
        "species",
        "lead_site",
        "sort_order",
        "cpq_quote_title",
        "main_duration",
        "recovery_duration",
        "opportunity_title",
        "opportunity_type__dsa_",
      ],
      limit: 100,
    };

    const apiResponse = await hubspotClient.crm.objects.searchApi.doSearch(
      objectType,
      searchRequest
    );

    // Log the first result to see what properties we're getting
    if (apiResponse.results && apiResponse.results.length > 0) {
      console.log(
        "First opportunity package properties:",
        apiResponse.results[0].properties
      );
    }

    return apiResponse.results;
  } catch (e) {
    if (e.message === "HTTP request failed") {
      const errorResponse = e.response?.body || e.response;
      throw new Error(
        JSON.stringify({
          message: "HubSpot API Error",
          details: errorResponse,
          originalError: e.message,
        })
      );
    }
    throw e;
  }
};
