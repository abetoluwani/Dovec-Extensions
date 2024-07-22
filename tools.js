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
      return `Error trying to execute the tool: ${err}`;
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
      return `Error trying to execute the tool: ${error}`;
    }
  },
};
// START NEW TOOL : Returns all blocks associated with a specific project by project ID"
const blockByProjectSchema = yup.object({
  projectId: yup.number().label("projectId").required("should be a number"),
  organizationId: yup.number().label("organizationId").required("should be a number"),
  pageSize: yup.number().label("pageSize").required("should be a number"),
});

const blockByProjectsJsonSchema = yupToJsonSchema(blockByProjectSchema);

const BLOCK_BY_PROJECT = {
  name: "block_by_project",
  description: "Returns all blocks associated with a specific project by project ID",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: blockByProjectsJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ projectId, organizationId, pageSize }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/projects/${projectId}/blocks`,
        {
          params: {
            page_size: pageSize,
          },
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const { data } = response.data;
      return JSON.stringify(data);
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};

// NEW TOOL : Returns all UNITS associated with a specific BLOCK by BLOCK ID"
const unitByBlockSchema = yup.object({
  organizationID :yup.number().label("organazationID").required("should be a number"),
  blockID : yup.number().label("blockID").required("should be a number"),
  pageSIZE : yup.number().label("pageSIZE").required("should be a number")
});
const unitByBlockJsonSchema = yupToJsonSchema(unitByBlockSchema);

const UNIT_BY_BLOCK = {
  name: "unit_by_block",
  description: "Returns all units associated with a specific block by block ID",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: unitByBlockJsonSchema ,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationID, blockID, pageSIZE}) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${organizationID}/blocks/${blockID}/units`,
        {
          params: {
            page_size: pageSIZE,
          },
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const { data } = response.data;
      return JSON.stringify(data);
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};

// NEW TOOL : Returns details of a specific unit by its unit ID 
const unitDetailByUnitIdSchema = yup.object({
  organization_ID :yup.number().label("organization_ID").required("should be a number"),
  block_ID :yup.number().label("block_ID").required("should be a number"),
  unit_ID : yup.number().label("unit_ID").required("should be a number")
});
const unitDetailByUnitIdJsonSchema = yupToJsonSchema(unitDetailByUnitIdSchema);
const UNITDETAIL_BY_UNITID = {
  name: "unitDetail_by_unitID",
  description: "Returns detailed information about a specific unit identified by its unit ID within a specified block and organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: unitDetailByUnitIdJsonSchema ,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd:async({organization_ID,block_ID,unit_ID}) =>{
    const TOKEN = process.env.TOKEN;
    try{
      const response =await axios.get(
        `http://localhost:3001/organizations/${organization_ID}/blocks/${block_ID}/units/${unit_ID}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      return response.data;
    }
    catch(err){
      return `Error trying to execute the tool: ${err}`;

    }
    
  },
 
};
// NEW TOOL : Returns all contracts managed by a specific agency ID
const contractsByAgencySchema = yup.object({
  agencyID : yup.number().label("agencyID").required("should be a number"),

});
const contractsByAgencyJasonSchema = yupToJsonSchema(contractsByAgencySchema);
const contracts_BY_AGENCY= {
  name: "contracts_by_agency",
  description: "Returns all contracts managed by a specific agency ID",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: contractsByAgencyJasonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd : async({agencyID}) => {
    const TOKEN = process.env.TOKEN;
    try{
      const response = await axios.get (`http://localhost:3001/organizations/:organizationId/agencies/${agencyID}/contacts`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
     const {data} = response.data;
     return(data);

    }
    catch(err){
      return `Error trying to execute the tool: ${err}` ;
    }

  },
};
//NEW TOOL : returns a list of users associated with a specific organization
const organizationUsersSchema = yup.object({
  orgId : yup.number().label("orgId").required("should be a number"),
});

const organizationUsersJasonSchema = yupToJsonSchema(organizationUsersSchema);
 

const tools = [SOLD_UNITS, AGENCY_SALES, BLOCK_BY_PROJECT,UNIT_BY_BLOCK,UNITDETAIL_BY_UNITID,contracts_BY_AGENCY];
module.exports = tools;
