require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("./yupToJsonSchema");

const getAgencySaleSchema = yup.object({
  agencyId: yup.number().label("agencyId").required("should be a number"),
});
const agencySalesJSONSchema = yupToJsonSchema(getAgencySaleSchema);

const AGENCY_SALES = {
  name: "agency_sales",
  description: "Returns sales data for all agencies according to agency ID",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: agencySalesJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ agencyId }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const { data } = await axios.get(
        `http://localhost:3001/agencies/${agencyId}/sales`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return JSON.stringify({ data });
    } catch (err) {
      return "Error trying to execute the tool", err;
    }
  },
};

const soldUnitsSchema = yup.object({
  startDate: yup.string().label("start date").required("should be a datetime"),
  endDate: yup.string().label("end date").required("should be a datetime"),
});
const soldUnitsJSONSchema = yupToJsonSchema(soldUnitsSchema);

const SOLD_UNITS = {
  name: "sold_units",
  description: "Returns all sold units with their information",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: soldUnitsJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ startDate, endDate }) => {
    const payload = { startDate, endDate };
    try {
      const { data } = await axios.post(
        "http://localhost:3001/agencies/allsales",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return JSON.stringify({ data });
    } catch (error) {
      return "Error trying to execute ", error;
    }
  },
};

const tools = [SOLD_UNITS, AGENCY_SALES];
module.exports = tools;