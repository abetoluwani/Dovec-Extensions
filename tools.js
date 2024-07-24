require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("./yupToJsonSchema");

const getAgencySaleSchema = yup.object({
  agencyId: yup.number().label("agencyId").required("should be a number"),
});
const agencySalesJSONSchema = yupToJsonSchema(getAgencySaleSchema);
//1.NEW TOOL :Returns sales data for all agencies according to agency ID
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
//2.NEW TOOL :Returns all sold units with their information
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
// 3.START NEW TOOL : Returns all blocks associated with a specific project by project ID"
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

// 4.NEW TOOL : Returns all UNITS associated with a specific BLOCK by BLOCK ID"
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

//5. NEW TOOL : Returns details of a specific unit by its unit ID 
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
// 6.NEW TOOL : Returns all contracts managed by a specific agency ID
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
//7.NEW TOOL : returns a list of users associated with a specific organization
const organizationUsersSchema = yup.object({
  orgId : yup.number().label("orgId").required("should be a number"),
});

const organizationUsersJsonSchema = yupToJsonSchema(organizationUsersSchema);
const ORGANIZATION_USERS= {
  name: "organization_users",
  description: "Returns a list of all users associated with a specific organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: organizationUsersJsonSchema  ,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd : async({orgId}) => {
    const TOKEN = process.env.TOKEN;
    try{
      const response = await axios.get(`http://localhost:3001/organizations/${orgId}/users`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
       
      return response.data;
    }
    catch(err){
      return `Error trying to execute the tool: ${err}` ;
    }
  },
};

//8.NEW TOOL : Returns a list of representatives for a specific organization
const getRepresentativesSchema = yup.object({
  orgID : yup.number().label("orgID").required("should be a number"),
});

const getRepresentativesJsonSchema = yupToJsonSchema(getRepresentativesSchema);
const GET_REPRESENTATIVES= {
  name: "get_representatives",
  description: "Returns a list of representatives for a specific organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters:  getRepresentativesJsonSchema ,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd : async ({orgID}) =>{
    const TOKEN = process.env.TOKEN;
    try{
          const response = await axios.get(`http://localhost:3001/organizations/${orgID}/representatives`,
      {
        headers:
        { 
          Authorization: `Bearer ${TOKEN}`,
        },
      }
      );
      return response;
    }
    catch(err){
      `Error trying to execute the tool: ${err}` ;
    }
  },
};
// 9. NEW TOOL: Create a new agency
const createagencySchema = yup.object({
  organizationId: yup.number().label("organizationId").required("should be a number"),
  agencyLevel: yup.number().label("agencyLevel").required("should be a number"),
  mainAgency: yup.number().label("mainAgency").nullable(),
  agencyName: yup.string().label("agencyName").required("should be a string"),
  authorizedUserName: yup.string().label("authorizedUserName").required("should be a string"),
  authorizedUserSurname: yup.string().label("authorizedUserSurname").required("should be a string"),
  authorizedUserEmail: yup.string().email().label("authorizedUserEmail").required("should be a valid email"),
  country: yup.number().label("country").required("should be a number"),
  authorizedUserPhoneNumber: yup.string().label("authorizedUserPhoneNumber").required("should be a string"),
  agencyPhoneNumber: yup.string().label("agencyPhoneNumber").required("should be a string"),
  agencySecondPhoneNumber: yup.string().label("agencySecondPhoneNumber").nullable(),
  agencyEmail: yup.string().email().label("agencyEmail").required("should be a valid email"),
  agencyCommissionRate: yup.number().label("agencyCommissionRate").required("should be a number"),
  agencyStatus: yup.number().label("agencyStatus").required("should be a number"),
  requestStatus: yup.number().label("requestStatus").required("should be a number"),
  address: yup.string().label("address").nullable(),
  websiteUrl: yup.string().label("websiteUrl").nullable(),
  agencyContract: yup.string().label("agencyContract").nullable(),
  authorizedSalesRepresentatives: yup.array().of(yup.number()).label("authorizedSalesRepresentatives").required("should be an array of numbers"),
});

const createAgencyJsonSchema = yupToJsonSchema(createagencySchema);

const CREATE_AGENCY = {
  name: "create_agancy",
  description: "Creates a new registration request",
  category: "hackathon",
  subcategory: "management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: createAgencyJsonSchema,
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async ({
    organizationId,agencyLevel,mainAgency,agencyName,
    authorizedUserName,authorizedUserSurname,authorizedUserEmail,country,
    authorizedUserPhoneNumber,agencyPhoneNumber,agencySecondPhoneNumber,agencyEmail,
    agencyCommissionRate, agencyStatus,requestStatus,address,
    websiteUrl,agencyContract,authorizedSalesRepresentatives
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(`http://localhost:3001/organizations/${organizationId}/registration-requests`, {
        agencyLevel,mainAgency,agencyName,authorizedUserName,authorizedUserSurname,
        authorizedUserEmail,country,authorizedUserPhoneNumber,agencyPhoneNumber,
        agencySecondPhoneNumber,agencyEmail,agencyCommissionRate,
        agencyStatus,requestStatus,address,websiteUrl,
        agencyContract,authorizedSalesRepresentatives
      }, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      return response.data;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};

//NEW TOOL : Creates a new project for a specific organization
const createProjectSchema = yup.object({
  organizationId: yup.number().label("organizationId").required("should be a number"),
  downPaymentPercentagePerUnit: yup.number().label("downPaymentPercentagePerUnit").required("should be a number"),
  iconUrl: yup.string().label("iconUrl").nullable(),
  isPublished: yup.boolean().label("isPublished").default(false),
  location: yup.string().label("location").nullable(),
  maxReservationDuration: yup.number().label("maxReservationDuration").required("should be a number"),
  maxReservationLimitPerRep: yup.number().label("maxReservationLimitPerRep").required("should be a number"),
  projectName: yup.string().label("projectName").required("should be a string"),
  projectReferenceCode: yup.string().label("projectReferenceCode").required("should be a string"),
  videoUrl: yup.string().label("videoUrl").nullable()
});
const createProjectJsonSchema = yupToJsonSchema(createProjectSchema);
const CREATE_PROJECT = {
  name: "create_project",
  description: "Creates a new project for a specific organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: createProjectJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({
    organizationId,downPaymentPercentagePerUnit, iconUrl,
    isPublished,location,maxReservationDuration,maxReservationLimitPerRep,projectName,
    projectReferenceCode,videoUrl
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organizationId}/projects`,
        {
          downPaymentPercentagePerUnit,
          iconUrl, isPublished, location,maxReservationDuration,
          maxReservationLimitPerRep, projectName,
          projectReferenceCode,videoUrl
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      `Error trying to execute the tool: ${err}`;
    }
  },
};



const tools = [SOLD_UNITS, AGENCY_SALES, BLOCK_BY_PROJECT,UNIT_BY_BLOCK,UNITDETAIL_BY_UNITID,
  contracts_BY_AGENCY,ORGANIZATION_USERS,GET_REPRESENTATIVES,CREATE_AGENCY, CREATE_PROJECT];
module.exports = tools;
