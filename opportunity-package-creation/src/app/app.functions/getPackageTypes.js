const hubspot = require("@hubspot/api-client");

exports.main = async () => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env["PRIVATE_APP_ACCESS_TOKEN"],
  });

  const objectType = process.env["OPP_PACKAGES_ID"];
  const propertyName = "package_type";
  const archived = false;

  try {
    const apiResponse = await hubspotClient.crm.properties.coreApi.getByName(
      objectType,
      propertyName,
      archived
    );
    return apiResponse.options;
  } catch (e) {
    if (e.message === "HTTP request failed") {
      throw new Error(JSON.stringify(e.response));
    }
    throw e;
  }
};
