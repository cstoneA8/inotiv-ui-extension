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
        "discipline",
        "sub_discipline",
        "sub_group",
        "species",
        "lead_site",
        "sort_order",
        "cpq_quote_title",
        "main_duration",
        "recovery_duration",
      ],
      limit: 100,
    };

    const apiResponse = await hubspotClient.crm.objects.searchApi.doSearch(
      objectType,
      searchRequest
    );

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
