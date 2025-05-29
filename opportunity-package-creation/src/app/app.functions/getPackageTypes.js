const hubspot = require("@hubspot/api-client");

exports.main = async () => {
  const PROPERTY_NAME = "package_type";
  const ARCHIVED = false;
  const objectType = process.env["OPP_PACKAGES_ID"];
  const accessToken = process.env["PRIVATE_APP_ACCESS_TOKEN"];

  const hubspotClient = new hubspot.Client({
    accessToken,
  });

  try {
    const apiResponse = await hubspotClient.crm.properties.coreApi.getByName(
      objectType,
      PROPERTY_NAME,
      ARCHIVED
    );
    return apiResponse.options;
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
