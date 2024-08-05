require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("./yupToJsonSchema");
const { json, response } = require("express");
const { report } = require("process");
const { start } = require("repl");

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
            "Content-Type": "application/json",
          },
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
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"),
  pageSize: yup.number().label("pageSize").required("should be a number"),
});

const blockByProjectsJsonSchema = yupToJsonSchema(blockByProjectSchema);

const BLOCK_BY_PROJECT = {
  name: "block_by_project",
  description:
    "Returns all blocks associated with a specific project by project ID",
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
  organizationID: yup
    .number()
    .label("organazationID")
    .required("should be a number"),
  blockID: yup.number().label("blockID").required("should be a number"),
  pageSIZE: yup.number().label("pageSIZE").required("should be a number"),
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
  parameters: unitByBlockJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationID, blockID, pageSIZE }) => {
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
  organization_ID: yup
    .number()
    .label("organization_ID")
    .required("should be a number"),
  block_ID: yup.number().label("block_ID").required("should be a number"),
  unit_ID: yup.number().label("unit_ID").required("should be a number"),
});
const unitDetailByUnitIdJsonSchema = yupToJsonSchema(unitDetailByUnitIdSchema);
const UNITDETAIL_BY_UNITID = {
  name: "unitDetail_by_unitID",
  description:
    "Returns detailed information about a specific unit identified by its unit ID within a specified block and organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: unitDetailByUnitIdJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organization_ID, block_ID, unit_ID }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${organization_ID}/blocks/${block_ID}/units/${unit_ID}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};
// 6.NEW TOOL : Returns all contracts managed by a specific agency ID
const ContractsByAgencySchema = yup.object({
  agencyID: yup.number().label("agencyID").required("should be a number"),
});
const ContractsByAgencyJasonSchema = yupToJsonSchema(ContractsByAgencySchema);
const CONTRACTS_BY_AGENCY = {
  name: "contracts_by_agency",
  description: "Returns all contracts managed by a specific agency ID",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: ContractsByAgencyJasonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ agencyID }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/:organizationId/agencies/${agencyID}/contacts`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const { data } = response.data;
      return data;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};
//7.NEW TOOL : returns a list of users associated with a specific organization(error)
const organizationUsersSchema = yup.object({
  orgId: yup.number().label("orgId").required("should be a number"),
});

const organizationUsersJsonSchema = yupToJsonSchema(organizationUsersSchema);
const ORGANIZATION_USERS = {
  name: "organization_users",
  description:
    "Returns a list of all users associated with a specific organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: organizationUsersJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ orgId }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${orgId}/users`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};

//8.NEW TOOL : Returns a list of representatives for a specific organization
const getRepresentativesSchema = yup.object({
  orgID: yup.number().label("orgID").required("should be a number"),
});

const getRepresentativesJsonSchema = yupToJsonSchema(getRepresentativesSchema);
const GET_REPRESENTATIVES = {
  name: "get_representatives",
  description: "Returns a list of representatives for a specific organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getRepresentativesJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ orgID }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${orgID}/representatives`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response;
    } catch (err) {
      `Error trying to execute the tool: ${err}`;
    }
  },
};
// 9. NEW TOOL: Create a new agency
const createagencySchema = yup.object({
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"),
  agencyLevel: yup.number().label("agencyLevel").required("should be a number"),
  mainAgency: yup.number().label("mainAgency").nullable(),
  agencyName: yup.string().label("agencyName").required("should be a string"),
  authorizedUserName: yup
    .string()
    .label("authorizedUserName")
    .required("should be a string"),
  authorizedUserSurname: yup
    .string()
    .label("authorizedUserSurname")
    .required("should be a string"),
  authorizedUserEmail: yup
    .string()
    .email()
    .label("authorizedUserEmail")
    .required("should be a valid email"),
  country: yup.number().label("country").required("should be a number"),
  authorizedUserPhoneNumber: yup
    .string()
    .label("authorizedUserPhoneNumber")
    .required("should be a string"),
  agencyPhoneNumber: yup
    .string()
    .label("agencyPhoneNumber")
    .required("should be a string"),
  agencySecondPhoneNumber: yup
    .string()
    .label("agencySecondPhoneNumber")
    .nullable(),
  agencyEmail: yup
    .string()
    .email()
    .label("agencyEmail")
    .required("should be a valid email"),
  agencyCommissionRate: yup
    .number()
    .label("agencyCommissionRate")
    .required("should be a number"),
  agencyStatus: yup
    .number()
    .label("agencyStatus")
    .required("should be a number"),
  requestStatus: yup
    .number()
    .label("requestStatus")
    .required("should be a number"),
  address: yup.string().label("address").nullable(),
  websiteUrl: yup.string().label("websiteUrl").nullable(),
  agencyContract: yup.string().label("agencyContract").nullable(),
  authorizedSalesRepresentatives: yup
    .array()
    .of(yup.number())
    .label("authorizedSalesRepresentatives")
    .required("should be an array of numbers"),
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
    organizationId,
    agencyLevel,
    mainAgency,
    agencyName,
    authorizedUserName,
    authorizedUserSurname,
    authorizedUserEmail,
    country,
    authorizedUserPhoneNumber,
    agencyPhoneNumber,
    agencySecondPhoneNumber,
    agencyEmail,
    agencyCommissionRate,
    agencyStatus,
    requestStatus,
    address,
    websiteUrl,
    agencyContract,
    authorizedSalesRepresentatives,
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organizationId}/registration-requests`,
        {
          agencyLevel,
          mainAgency,
          agencyName,
          authorizedUserName,
          authorizedUserSurname,
          authorizedUserEmail,
          country,
          authorizedUserPhoneNumber,
          agencyPhoneNumber,
          agencySecondPhoneNumber,
          agencyEmail,
          agencyCommissionRate,
          agencyStatus,
          requestStatus,
          address,
          websiteUrl,
          agencyContract,
          authorizedSalesRepresentatives,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};

//NEW TOOL : Creates a new project for a specific organization
const createProjectSchema = yup.object({
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"),
  downPaymentPercentagePerUnit: yup
    .number()
    .label("downPaymentPercentagePerUnit")
    .required("should be a number"),
  iconUrl: yup.string().label("iconUrl").nullable(),
  isPublished: yup.boolean().label("isPublished").default(false),
  location: yup.string().label("location").nullable(),
  maxReservationDuration: yup
    .number()
    .label("maxReservationDuration")
    .required("should be a number"),
  maxReservationLimitPerRep: yup
    .number()
    .label("maxReservationLimitPerRep")
    .required("should be a number"),
  projectName: yup.string().label("projectName").required("should be a string"),
  projectReferenceCode: yup
    .string()
    .label("projectReferenceCode")
    .required("should be a string"),
  videoUrl: yup.string().label("videoUrl").nullable(),
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
    organizationId,
    downPaymentPercentagePerUnit,
    iconUrl,
    isPublished,
    location,
    maxReservationDuration,
    maxReservationLimitPerRep,
    projectName,
    projectReferenceCode,
    videoUrl,
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organizationId}/projects`,
        {
          downPaymentPercentagePerUnit,
          iconUrl,
          isPublished,
          location,
          maxReservationDuration,
          maxReservationLimitPerRep,
          projectName,
          projectReferenceCode,
          videoUrl,
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
//NEW TOOL : Creates a new block for a specific project within an organization
const createBlockSchema = yup.object({
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"), // Not stored in DB but used for routing
  projectId: yup.number().label("projectId").required("should be a number"),
  blockName: yup.string().label("blockName").required("should be a string"),
  firstPromiseToPurchase: yup
    .number()
    .label("firstPromiseToPurchase")
    .required("should be a number"),
  secondPromiseToPurchase: yup
    .number()
    .label("secondPromiseToPurchase")
    .required("should be a number"),
  thirdPromiseToPurchase: yup
    .number()
    .label("thirdPromiseToPurchase")
    .required("should be a number"),
  blockFloorPlan: yup.string().label("blockFloorPlan").nullable(),
  blockDeliveryDate: yup.date().label("blockDeliveryDate").nullable(), // Should match DATETIME format
  estimatedDeliveryDate: yup
    .string()
    .label("estimatedDeliveryDate")
    .required("should be a string"),
});
const createBlockJsonSchema = yupToJsonSchema(createBlockSchema);

const CREATE_BLOCK = {
  name: "create_block",
  description:
    "Creates a new block for a specific project within an organization",
  category: "hackathon",
  subcategory: "communication",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: createBlockJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({
    organizationId,
    projectId,
    blockName,
    firstPromiseToPurchase,
    secondPromiseToPurchase,
    thirdPromiseToPurchase,
    blockFloorPlan,
    blockDeliveryDate,
    estimatedDeliveryDate,
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organizationId}/projects/${projectId}/blocks`,
        {
          blockName,
          firstPromiseToPurchase,
          secondPromiseToPurchase,
          thirdPromiseToPurchase,
          blockFloorPlan,
          blockDeliveryDate,
          estimatedDeliveryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};

// NEW TOOL: Creates a new unit for a specific block within an organization (ERROR ON BACKEND)

const newPostUnitsSchema = yup.object({
  organizationId: yup
    .number()
    .required()
    .label("organizationId"),
  salesRepresentative: yup
    .number()
    .required()
    .label("salesRepresentative"),

  blockId: yup
    .number()
    .required()
    .label("blockId"),

  addressLine1: yup
    .string()
    .nullable()
    .label("addressLine1"),

  addressLine2: yup
    .string()
    .nullable()
    .label("addressLine2"),

  block: yup
    .string()
    .nullable()
    .label("block"),

  nox: yup
    .string()
    .nullable()
    .label("nox"),

  floor: yup
    .string()
    .nullable()
    .label("floor"),

  unitSide: yup
    .string()
    .nullable()
    .label("unitSide"),

  unitNo: yup
    .string()
    .nullable()
    .label("unitNo"),

  unitPool: yup
    .number()
    .required()
    .label("unitPool"),

  unitType: yup
    .string()
    .nullable()
    .label("unitType"),

  unitArea: yup
    .string()
    .nullable()
    .label("unitArea"),

  unitPark: yup
    .string()
    .nullable()
    .label("unitPark"),

  unitTerrace: yup
    .string()
    .nullable()
    .label("unitTerrace"),

  unitBalcony: yup
    .string()
    .nullable()
    .label("unitBalcony"),

  unitTotalM2: yup
    .string()
    .nullable()
    .label("unitTotalM2"),

  unitGardenM2: yup
    .string()
    .nullable()
    .label("unitGardenM2"),

  roofTerraceArea: yup
    .number()
    .nullable()
    .label("roofTerraceArea"),

  landArea: yup
    .number()
    .nullable()
    .label("landArea"),

  unitPrice: yup
    .number()
    .nullable()
    .label("unitPrice"),

  unitReservationStatusId: yup
    .number()
    .nullable()
    .label("unitReservationStatusId"),

  unitNote: yup
    .string()
    .nullable()
    .label("unitNote"),

  unitDate: yup
    .date()
    .nullable()
    .label("unitDate"),

  showFlat: yup
    .number()
    .required()
    .label("showFlat"),

  memberId: yup
    .number()
    .required()
    .label("memberId"),

  unitFloorPlan: yup
    .string()
    .nullable()
    .label("unitFloorPlan"),

  unitLocation: yup
    .string()
    .nullable()
    .label("unitLocation"),

  reserveTime: yup
    .string()
    .nullable()
    .label("reserveTime"),

  reserverMail: yup
    .number()
    .required()
    .label("reserverMail"),

  depositStatus: yup
    .number()
    .required()
    .label("depositStatus"),

  depositTime: yup
    .string()
    .nullable()
    .label("depositTime"),

  soldTime: yup
    .date()
    .nullable()
    .label("soldTime"),

  resDelete: yup
    .number()
    .required()
    .label("resDelete"),

  lastMemberId: yup
    .number()
    .required()
    .label("lastMemberId"),

  lastReservedDate: yup
    .string()
    .nullable()
    .label("lastReservedDate"),

  updateRequest: yup
    .number()
    .required()
    .label("updateRequest"),

  requestExtend: yup
    .number()
    .required()
    .label("requestExtend"),

  transferMemberId: yup
    .number()
    .required()
    .label("transferMemberId")
});

const createUnitJsonSchema = yupToJsonSchema(newPostUnitsSchema);

const CREATE_UNIT = {
  name: "create_unit",
  description: "Creates a new unit for a specific block within an organization",
  category: "real_estate",
  subcategory: "unit_management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: createUnitJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({
    organizationId,
    salesRepresentative,
    blockId,
    addressLine1,
    addressLine2,
    block,
    nox,
    floor,
    unitSide,
    unitNo,
    unitPool,
    unitType,
    unitArea,
    unitPark,
    unitTerrace,
    unitBalcony,
    unitTotalM2,
    unitGardenM2,
    roofTerraceArea,
    landArea,
    unitPrice,
    unitReservationStatusId,
    unitNote,
    unitDate,
    showFlat,
    memberId,
    unitFloorPlan,
    unitLocation,
    reserveTime,
    reserverMail,
    depositStatus,
    depositTime,
    soldTime,
    resDelete,
    lastMemberId,
    lastReservedDate,
    updateRequest,
    requestExtend,
    transferMemberId
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organizationId}/blocks/${blockId}/units`,
        {
          salesRepresentative,
          blockId,
          addressLine1,
          addressLine2,
          block,
          nox,
          floor,
          unitSide,
          unitNo,
          unitPool,
          unitType,
          unitArea,
          unitPark,
          unitTerrace,
          unitBalcony,
          unitTotalM2,
          unitGardenM2,
          roofTerraceArea,
          landArea,
          unitPrice,
          unitReservationStatusId,
          unitNote,
          unitDate,
          showFlat,
          memberId,
          unitFloorPlan,
          unitLocation,
          reserveTime,
          reserverMail,
          depositStatus,
          depositTime,
          soldTime,
          resDelete,
          lastMemberId,
          lastReservedDate,
          updateRequest,
          requestExtend,
          transferMemberId
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );
      return response.data;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  }
};
//NEW TOOL : Creates a new contact for a specific organization
const createContactSchema = yup.object({
  typeId: yup
    .number()
    .label('typeId')
    .required('should be a number'),
  channelId: yup
    .number()
    .label('channelId')
    .required('should be a number'),
  name: yup
    .string()
    .label('name')
    .required('should be a string'),
  email: yup
    .string()
    .label('email')
    .required('should be a string'),
  phone: yup
    .string()
    .label('phone')
    .required('should be a string'),
    countryId: yup
    .number()
    .label('country')
    .required('should be a number'),
  birthDate: yup
    .date()
    .label('birthDate')
    .nullable(),
  passportNumber: yup
    .string()
    .label('passportNumber')
    .nullable(),
  idNumber: yup
    .string()
    .label('idNumber')
    .nullable(),
  agencyId: yup
    .number()
    .label('agencyId')
    .required('should be a number'),
  organID: yup
    .number()
    .label('organID')
    .required('should be a number'),
});
const createContactJsonSchema = yupToJsonSchema(createContactSchema);
const CREATE_CONTACT = {
  name: "create_contact",
  description: "Creates a new contact for a specific organization",
  category: "Contact Management",
  subcategory: "create contact",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: createContactJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({
    organID,
    typeId,
    channelId,
    name,
    email,
    phone,
    countryId,
    birthDate,
    passportNumber,
    idNumber,
    agencyId,
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organID}/contacts`, 
        {
          typeId,
          channelId,
          name,
          email,
          phone,
          countryId,
          birthDate,
          passportNumber,
          idNumber,
          agencyId,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error trying to execute the tool: ${err}`);
    }
  },
};

//NEW TOOL : gets contact details (email and phone number,birthdate and agent name and contact ID) by contact name

const contactNameSchema = yup.object({
  contactName: yup.string()
    .required("Contact name is required")
    .min(1, "Contact name cannot be empty")
    .max(100, "Contact name is too long"),
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"),
});

const contactNameJSONSchema = yupToJsonSchema(contactNameSchema);

const GET_CONTACT_DETAILS_BY_NAME = {
  name: "get_contact_details_by_name",
  description: "This tool gets contact details (email and phone number,birthdate and agent name and contact ID) by contact name",
  category: "Contact Management",
  subcategory: "Contact Details",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: contactNameJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ contactName, organizationId }) => {
    const TOKEN = process.env.TOKEN;

    try {
      
      await contactNameSchema.validate({ contactName ,organizationId});

      // Construct the query string for filtering by contact name
      const query = new URLSearchParams();
      query.append("filters[0][column]", "contacts.name");
      query.append("filters[0][operation]", "equals");
      query.append("filters[0][values][0]", contactName);

      // Fetch data from the API endpoint
      const { data } = await axios.get(
        `http://localhost:3001/organization/${organizationId}/contacts?${query.toString()}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      
      const contacts = data.data;
      const contactDetails = contacts.map(contact => ({
        email: contact.email,
        phoneNumber: contact.phone,
        agent_name :contact.agent_name,
        birthDate :contact.birth_date,
        contact_ID : contact.contact_id,
      
      }));

      return contactDetails;
    } catch (error) {
      console.error("Error fetching contact details:", error);
      return `Error trying to execute the tool: ${error.message}`;
    }
  }
};
//NEW TOOL: Creates a new accommodation for a specific organization and contact(Error on sql syntax)
const createAccommodationSchema = yup.object({
  organizationId: yup.number().required().label("organizationId"),
  contactId: yup.number().required().label("contactId"),
  numberOfPeople: yup.number().nullable().label("numberOfPeople"),
  checkInDate: yup.date().required().label("checkInDate"),
  checkOutDate: yup.date().required().label("checkOutDate"),
  resortName: yup.string().max(100).required().label("resortName"),
  roomNumber: yup.string().max(50).required().label("roomNumber"),
  notes: yup.string().max(255).nullable().label("notes"),
});

const createAccommodationJsonSchema = yupToJsonSchema(createAccommodationSchema);

const CREATE_ACCOMMODATION = {
  name: "create_accommodation",
  description: "Creates a new accommodation for a specific organization and contact",
  category: "accommodation",
  subcategory: "management",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: createAccommodationJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({
    organizationId,
    contactId,
    numberOfPeople,
    checkInDate,
    checkOutDate,
    resortName,
    roomNumber,
    notes,
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organizationId}/contacts/${contactId}/accommodations`,
        {
          numberOfPeople,
          checkInDate,
          checkOutDate,
          resortName,
          roomNumber,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`, 
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error trying to execute the tool: ${err}`);
    }
  },
};

// NEW TOOL: Returns accommodation based on provided details
const accommodationSchema = yup.object({
  organizationId: yup.number().label("organizationId").required("should be a number"),
  contactId: yup.number().label("contactId").required("should be a number"),
  pageSize: yup.number().label("pageSize").required("should be a number"),
});


const accommodationJsonSchema = yupToJsonSchema(accommodationSchema);

const GET_ALL_ACCOMMODATION_BY_CONTACT_ID = {
  name: "get_all_accommodation_by_contact_id",
  description: "Returns all accommodation information associated with a specific contact ID in an organization.",
  category: "hackathon",
  subcategory: "accommodation",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: accommodationJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationId, contactId, pageSize }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/contacts/${contactId}/accommodations`,
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
      return `Error trying to execute the tool: ${err.message}`;
    }
  },
};
//new tool : Creates a new note for a specific contact within an organization
const createContactNoteSchema = yup.object({
  organizationId: yup
    .number()
    .label('organizationId')
    .required('should be a number'),
  contactId: yup
    .number()
    .label('contactId')
    .required('should be a number'),
  userOrganizationId: yup
    .number()
    .label('userOrganizationId')
    .required('should be a number'),
  notes: yup
    .string()
    .label('notes')
    .required('should be a string'),
});

const createContactNoteJsonSchema = yupToJsonSchema(createContactNoteSchema);

const CREATE_CONTACT_NOTE = {
  name: "create_contact_note",
  description: "Creates a new note for a specific contact within an organization",
  category: "Contact Management",
  subcategory: "create contact note",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: createContactNoteJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({
    organizationId,
    contactId,
    userOrganizationId,
    notes,
  }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.post(
        `http://localhost:3001/organizations/${organizationId}/contacts/${contactId}/notes`,
        {
          userOrganizationId,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error(`Error trying to execute the tool: ${err}`);
      throw err; 
    }
  },
};

// Tolu Tools Start from here:
// Get reservations (dONE)
const reservationSchema = yup.object({
  start_date: yup.date().label("start_date").required("should be a Date"),
  end_date: yup.date().label("end_date").required("should be a Date"),
});
const reservationJSONSchema = yupToJsonSchema(reservationSchema);
const ALL_RESERVATIONS_TOOL = {
  name: "gets_reservations",
  description: "gets all reservations",
  category: "Reporting",
  subcategory: "reservation",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: reservationJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ start_date, end_date }) => {
    try {
      const query = new URLSearchParams({ start_date, end_date });
      if (start_date && end_date) {
        query.append(
          "filters[0][column]",
          "unit_reservations.reservation_start_date"
        );
        query.append("filters[0][operation]", "isDateBetween");
        query.append("filters[0][values][0]", start_date);
        query.append("filters[0][values][1]", end_date);
      }
      // if(filters) query.append('filters', JSON.stringify(filters));
      // console.log(`http://localhost:3001/unit-reservations/?${query.toString()}`, "queryyyyy")
      const { data } = await axios.get(
        `http://localhost:3001/unit-reservations/?${query.toString()}`
      );
      console.log(data, "dataaa");
      const response = data.data;

      return response;
    } catch (err) {
      return "Error trying to execute the tool " + err;
    }
  },
};

// Get Reservations ratio to sell out ratio for a given date (Done)

const reservetoselloutratioSchema = yup.object({
  start_date: yup.date().label("start_date").optional("should be a string"),
  end_date: yup.date().label("end_date").optional("should be a string"),
  // organization_id: yup.number().label("organization_id").required("should be a string"),
});
const reservetoselloutratioJSONSchema = yupToJsonSchema(
  reservetoselloutratioSchema
);
const GET_RESERVATIONS_TO_SELL_OUT_RATIO = {
  name: "get_reservations_to_sell_out_ratio",
  description: "gets the reservations to sell out ratio for a given date ",
  category: "Reporting",
  subcategory: "Sales",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: reservetoselloutratioJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ start_date, end_date }) => {
    try {
      // Initialize queries
      auth_token = process.env.AUTH_TOKEN;
      const reservationQuery = new URLSearchParams();
      const sellOutQuery = new URLSearchParams();

      // Add date filters if provided
      if (start_date && end_date) {
        reservationQuery.append(
          "filters[0][column]",
          "unit_reservations.reservation_start_date"
        );
        reservationQuery.append("filters[0][operation]", "isDateBetween");
        reservationQuery.append("filters[0][values][0]", start_date);
        reservationQuery.append("filters[0][values][1]", end_date);

        sellOutQuery.append(
          "filters[0][column]",
          "unit_status.unit_status_name"
        );
        sellOutQuery.append("filters[0][operation]", "equals");
        sellOutQuery.append("filters[0][values][0]", "Sold");
        sellOutQuery.append("filters[1][column]", "unit_status.created_at");
        sellOutQuery.append("filters[1][operation]", "isDateBetween");
        sellOutQuery.append("filters[1][values][0]", start_date);
        sellOutQuery.append("filters[1][values][1]", end_date);
      }

      //  reservations
      const reservationdata = await axios.get(
        `http://localhost:3001/unit-reservations/?${reservationQuery.toString()}`
      );
      const reservations = reservationdata.data.data;
      console.log(reservations, "reservations");

      //  sold units
      const solddata = await axios.get(
        `http://localhost:3001/unitStatus?${sellOutQuery.toString()}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      const soldUnits = solddata.data.data;
      console.log(soldUnits, "soldUnits");

      // Calculate reservation and sell-out counts
      const totalReservations = reservations.length;
      console.log(totalReservations, "totalReservations");
      const totalSellOuts = soldUnits.length;
      console.log(totalSellOuts, "totalSellOuts");

      // // Calculate ratios
      // const reservationRatio = totalReservations > 0 ? totalReservations : 0;
      // const sellOutRatio = totalSellOuts > 0 ? totalSellOuts / soldUnits.length : 0;

      // reservation ratio to sell out ratio
      reservationratio_to_selloutratio = totalReservations / totalSellOuts;
      selloutratio_to_reservationratio = totalSellOuts / totalReservations;
      return {
        // reservations,
        // soldUnits
        totalReservations,
        totalSellOuts,
        reservationratio_to_selloutratio,
        selloutratio_to_reservationratio,
      };
    } catch (err) {
      return "Error trying to execute the tool: " + err;
    }
  },
};

// Contract Manager

const contractSchema = yup.object({
  contractId: yup.string().required(),
});

const contractJSONSchema = yupToJsonSchema(contractSchema);

const CONTRACT_MANAGER = {
  name: "contract_manager",
  description:
    "Manages and responds to pending contract requests, including listing, generating, and approving contracts.",
  category: "real_estate_management",
  subcategory: "contracts",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: contractJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ contractId }) => {
    try {
      // Implement your tool's logic here:
      const data = await axios.get(
        `api/contracts/pending?contractId=${contractId}`
      );
      return JSON.stringify(data);
    } catch (err) {
      return "Error trying to execute the tool";
    }
  },
};

// const getdeposibystatusSchema = yup.object({
//   deposit_status_id: yup.number().label().required(),
// });

// const getdeposibystatusJSONSchema = yupToJsonSchema(getdeposibystatusSchema);

// const GET_DEPOSITS_BY_STATUS = {
//   name: "get_deposits_by_status",
//   description: "This tool gets deposits by status", // Describe functionality
//   category: "Deposit", // Choose a relevant category
//   subcategory: "Sorting", // Specify a subcategory if applicable
//   functionType: "Backend", // Specify backend or frontend
//   dangerous: false, // Set to true if user confirmation is required
//   associatedCommands: [], // List any associated commands (if any)
//   prerequisites: [], // List any prerequisites for your tool to run
//   parameters: getdeposibystatusJSONSchema,
//   rerun: true,
//   rerunWithDifferentParameters: true, // Set to false if different parameters are not allowed
//   runCmd: async ({ deposit_status_id }) => {
//     try {
//       // Implement your tool's logic here:

//       const data = await axios.get(/* url based on parameters */);
//       return JSON.stringify(data);
//     } catch (err) {
//       // Handle potential errors and return a meaningful message
//       return "Error trying to execute the tool";
//     }
//   },
// };

// Get All Deposits

// const getalldepositsSchema = yup.object();
// const getalldepositsJSONSchema = yupToJsonSchema(getalldepositsSchema);

// const GET_ALL_DEPOSITS = {
//   name: "get_all_deposits",
//   description: "This tool gets all deposits", // Describe functionality
//   category: "Deposit", // Choose a relevant category
//   subcategory: "Sorting", // Specify a subcategory if applicable
//   functionType: "Backend", // Specify backend or frontend
//   dangerous: false, // Set to true if user confirmation is required
//   associatedCommands: [], // List any associated commands (if any)
//   prerequisites: [], // List any prerequisites for your tool to run
//   parameters: getalldepositsJSONSchema,
//   rerun: true,
//   rerunWithDifferentParameters: true, // Set to false if different parameters are not allowed
//   runCmd: async () => {
//     try {
//       const auth_token = process.env.AUTH_TOKEN
//       // Implement your tool's logic here:
//       const data = await axios.get(`http://localhost:3001/get-all-deposits`,
//         headers = {
//           Authorization: `Bearer ${auth_token}`,
//         }
//       );
//       return JSON.stringify(data);
//     } catch (err) {
//       // Handle potential errors and return a meaningful message
//       return "Error trying to execute the tool " + err;
//     }
//   },
// };

// Update Deposit (Done)

const updatedepositSchema = yup.object({
  deposit_id: yup.number().label("deposit_id"),
  depsit_status: yup.number().label("status"),
});

const updatedepositJSONSchema = yupToJsonSchema(updatedepositSchema);

const UPDATE_DEPOSIT = {
  name: "updatedeposit_manager",
  description:
    "Manages and responds to pending deposits, including listing, confirming, and following up on deposits.",
  category: "real_estate_management",
  subcategory: "deposits",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: updatedepositJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ deposit_status, deposit_id }) => {
    // auth_token = process.env.AUTH_TOKEN;
    try {
      const { data } = await axios.put(
        `http://localhost:3001/deposit/status/update/${deposit_id}/status/${deposit_status}`
        // { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data, "dataaa");

      if (data.success === true) {
        return "Deposit status updated successfully";
      } else {
        return "Failed to update deposit status: " + JSON.stringify(data);
      }
    } catch (err) {
      return "Error trying to execute the tool " + err;
    }
  },
};

// Reservation Manager ()
const reservationmanagerSchema = yup.object({
  organizationId: yup
    .number()
    .label("organizationId")
    .optional("should be a number"),
  updateStatus: yup.number().label("requestID").optional("should be a number"),
  requestType: yup
    .string()
    .oneOf(["list", "update"])
    .label("requestType")
    .optional("should be a string"),
});

const reservationmanagerJSONSchema = yupToJsonSchema(reservationmanagerSchema);

const RESERVATION_MANAGER = {
  name: "reservation_manager",
  description:
    "Manages and responds to pending reservations, including listing, confirming, and following up on reservations.",
  category: "real_estate_management",
  subcategory: "reservations",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: reservationmanagerJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ organizationId, updateStatus, requestType }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;

      if (requestType === "list") {
        // const searchQuery = new URLSearchParams();
        // searchQuery.append("filters[0][column]", "unit_reservation_requests.unit_reservation_request_status_id");
        // searchQuery.append("filters[0][operation]", "equals");
        // searchQuery.append("filters[0][values][0]", "1");

        const { data } = await axios.get(
          `http://localhost:3001/unitReservationExtensionRequests`,
          { headers: { Authorization: `Bearer ${auth_token}` } }
        );

        const response = data.data.map((reservation) => {
          return {
            reservationId: reservation.unit_reservation_request_id,
            unitReservationId: reservation.unit_reservation_id,
            reservationRequestStatus:
              reservation.unit_reservation_extension_request_status_id,
            reservationDate: reservation.created_at,
          };
        });
        console.log(response);
        return response;
      } else if (requestType === "update") {
        const { data } = await axios.put(
          `http://localhost:3001/organizations/${organizationId}/units/${unitId}/reservations/2/extension-requests/${extensionRequestID}`,
          { headers: { Authorization: `Bearer ${auth_token}` } }
        );
      }
    } catch (err) {
      console.error("Error trying to execute the tool:", err);
      return "Error trying to execute the tool " + err;
    }
  },
};

// GET ALL SOLD UNITS (Done)
const soldAllUnitsSchema = yup.object({
  param: yup
    .string()
    .label("param")
    .optional("should be a string that is a word sold"),
});

const soldAllUnitsJSONSchema = yupToJsonSchema(soldAllUnitsSchema);

const GET_ALL_SOLD_UNITS = {
  name: "get_all_sold_units",
  description: "This tool gets all sold units",
  category: "Sales Analysis",
  subcategory: "Performance Analysis",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: soldAllUnitsJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({}) => {
    try {
      auth_token = process.env.AUTH_TOKEN;

      const { data } = await axios.get(
        `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data);
      const response = data.data;

      //   .map((units) => {
      //   return {
      //     address: units.address_line_1,
      //     unitType: units.unit_type,
      //     unitPrice: units.unit_price,
      //     unitLocaton: units.unit_location,
      //     unitSoldtime : units.sold_time
      //   };
      // });
      // console.log(response);
      return response;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};
// GET ALL SOLD UNITS BY PRICE (Done)
const soldUnitsbypriceSchema = yup.object({
  price1: yup.number().label("price1").required(),
});
const soldUnitsbypriceJSONSchema = yupToJsonSchema(soldUnitsbypriceSchema);

const GET_ALL_SOLD_UNITS_BY_PRICE = {
  name: "get_all_sold_units_by_price",
  description: "This tool gets all sold units by price ",
  category: "Sales Analysis",
  subcategory: "Performance Analysis",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: soldUnitsbypriceJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ price1 }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;

      // localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=equals&filters[1][values][0]=3000
      //localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=between&filters[1][values][0]=3000&filters[1][values][1]=10000
      const query = new URLSearchParams({ price1 });

      if (price1) {
        query.append("filters[1][column]", "units.unit_price");
        query.append("filters[1][operation]", "equals");
        query.append("filters[1][values][0]", price1);
      }
      const { data } = await axios.get(
        `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      // console.log(data)
      const response = data.data.map((units) => {
        return {
          address: units.address_line_1,
          unitType: units.unit_type,
          unitPrice: units.unit_price,
          unitLocaton: units.unit_location,
          unitSoldtime: units.sold_time,
        };
      });
      // console.log(response);
      return response;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};

// GET ALL SOLD UNITS BY PRICE RANGE  (Done)
const soldUnitsbypricerangeSchema = yup.object({
  price1: yup.number().label("price1").required(),
  price2: yup.number().label("price2").required(),
});

const soldUnitsbypricerangeJSONSchema = yupToJsonSchema(
  soldUnitsbypricerangeSchema
);

const GET_ALL_SOLD_UNITS_BY_PRICERANGE = {
  name: "get_all_sold_units_by_pricerange",
  description: "This tool gets all sold units by price range",
  category: "Sales Analysis",
  subcategory: "Performance Analysis",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: soldUnitsbypricerangeJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ price1, price2 }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;

      // localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=equals&filters[1][values][0]=3000
      //localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=between&filters[1][values][0]=3000&filters[1][values][1]=10000
      const query = new URLSearchParams({ price1, price2 });

      if (price1 && price2) {
        query.append("filters[1][column]", "units.unit_price");
        query.append("filters[1][operation]", "between");
        query.append("filters[1][values][0]", price1);
        query.append("filters[1][values][1]", price2);
      }
      const { data } = await axios.get(
        `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data);
      const response = data.data.map((units) => {
        return {
          // address: units.address_line_1,
          // unitType: units.unit_type,
          unitPrice: units.unit_price,
          unitLocaton: units.unit_location,
          unitSoldtime: units.sold_time,
        };
      });
      // console.log(response);
      return response;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};

// GET ALL SOLD UNITS BY AREA (Done)
const soldunitbyAreaSchema = yup.object({
  area: yup.string().label("area").required(),
});

const soldunitbyAreaSchemaJSONSchema = yupToJsonSchema(soldunitbyAreaSchema);

const GET_ALL_SOLD_UNITS_BY_AREA = {
  name: "get_all_sold_units_by_area",
  description: "This tool gets all sold units by area",
  category: "Sales Analysis",
  subcategory: "Performance Analysis",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: soldunitbyAreaSchemaJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ area }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;
      const query = new URLSearchParams({ area });

      if (area) {
        query.append("filters[1][column]", "units.unit_area");
        query.append("filters[1][operation]", "equals");
        query.append("filters[1][values][0]", area);
      }
      const { data } = await axios.get(
        `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data);
      const response = data.data.map((units) => {
        return {
          unitArea: units.unit_area,
          unitPrice: units.unit_price,
          unitLocaton: units.unit_location,
          unitSoldtime: units.sold_time,
        };
      });
      return response;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};

// GET ALL SOLD UNITS BY LOCATION (Done)
const soldunitbylocationSchema = yup.object({
  locaton: yup.string().label("locaton").required(),
});

const soldunitbyLocationSchemaJSONSchema = yupToJsonSchema(
  soldunitbylocationSchema
);

const GET_ALL_SOLD_UNITS_BY_LOCATION = {
  name: "get_all_sold_units_by_location",
  description: "This tool gets all sold units by area",
  category: "Sales Analysis",
  subcategory: "Performance Analysis",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: soldunitbyLocationSchemaJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ locaton }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;
      const query = new URLSearchParams({ locaton });

      if (locaton) {
        query.append("filters[1][column]", "units.unit_location");
        query.append("filters[1][operation]", "equals");
        query.append("filters[1][values][0]", locaton);
      }
      const { data } = await axios.get(
        `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data);
      const response = data.data.map((units) => {
        return {
          unitPrice: units.unit_price,
          unitLocaton: units.unit_location,
          unitSoldtime: units.sold_time,
        };
      });
      return response;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};

// GET ALL SOLD UNITS BY DATE
const soldunitbydateSchema = yup.object({
  start_date: yup.date().label("start_date").required(),
  end_date: yup.date().label("end_date").required(),
});

const soldunitbydateSchemaJSONSchema = yupToJsonSchema(soldunitbydateSchema);
const GET_ALL_SOLD_UNITS_BY_DATE = {
  name: "get_all_sold_units_by_date",
  description: "This tool gets all sold units by date",
  category: "Sales Analysis",
  subcategory: "Performance Analysis",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: soldunitbydateSchemaJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ start_date, end_date }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;
      const query = new URLSearchParams({ start_date, end_date });
      if ((start_date, end_date)) {
        query.append("filters[1][column]", "units.sold_time");
        query.append("filters[1][operation]", "isDateBetween");
        query.append("filters[1][values][0]", start_date);
        query.append("filters[1][values][1]", end_date);
      }
      const { data } = await axios.get(
        `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data);
      const response = data.data.map((units) => {
        return {
          unitArea: units.unit_area,
          unitPrice: units.unit_price,
          unitLocaton: units.unit_location,
          unitSoldtime: units.sold_time,
        };
      });
      return response;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};
// GET ALL SOLD UNITS BY ADDRESS (Done)
const soldunitbyaddressSchema = yup.object({
  address: yup.string().label("address").required(),
});

const soldunitbyaddressSchemaJSONSchema = yupToJsonSchema(
  soldunitbyaddressSchema
);
const GET_ALL_SOLD_UNITS_BY_ADDRESS = {
  name: "get_all_sold_units_by_address",
  description: "This tool gets all sold units by area",
  category: "Sales Analysis",
  subcategory: "Performance Analysis",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: soldunitbyaddressSchemaJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ address }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;
      const query = new URLSearchParams({ address });

      if (address) {
        query.append("filters[1][column]", "units.address_line_1");
        query.append("filters[1][operation]", "equals");
        query.append("filters[1][values][0]", address);
      }
      const { data } = await axios.get(
        `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data);
      const response = data.data.map((units) => {
        return {
          address: units.address_line_1,
          unitPrice: units.unit_price,
          unitSoldtime: units.sold_time,
        };
      });
      return response;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};

// GET UNIT AND BLOCKS BY PROJECT NAME (Done)
const getUnitAndBlocksByProjectNameSchema = yup.object({
  projectName: yup.string().label("projectName").required(),
  organizationId: yup.number().label("organizationId").required(),
  availableStatus: yup
    .string()
    .label("availableStatus")
    .optional("should be a string"),
});
const getUnitAndBlocksByProjectNameSchemaJSONSchema = yupToJsonSchema(
  getUnitAndBlocksByProjectNameSchema
);
const GET_UNIT_AND_BLOCKS_BY_PROJECT_NAME = {
  name: "get_unit_and_blocks_by_project_name",
  description: "This tool gets unit and blocks by project name",
  category: "Projects",
  subcategory: "Projects",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: getUnitAndBlocksByProjectNameSchemaJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ projectName, organizationId, availableStatus }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;
      const { data } = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/projects/${projectName}/availableStatus/${availableStatus}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      console.log(data);
      const response = data.unitsandBlocksbyProject;

      // Process the data to count available units per block
      const blocksMap = response.reduce((acc, item) => {
        if (!acc[item.blockName]) {
          acc[item.blockName] = {
            blockName: item.blockName,
            availableUnitsCount: 0,
            availableUnits: [],
          };
        }
        acc[item.blockName].availableUnitsCount += 1;
        acc[item.blockName].availableUnits.push({
          unitId: item.unitId,
          unitStatusId: item.unitStatusId,
        });
        return acc;
      }, {});

      // Convert the map to an array
      const blocksList = Object.values(blocksMap);

      // Structure the final result
      const result = {
        blocksWithAvailableUnits: blocksList,
        availableUnits: response.map((item) => ({
          unitId: item.unitId,
          blockName: item.blockName,
          projectName: item.projectName,
          unitStatusId: item.unitStatusId,
        })),
      };

      return result;
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};

// GET UNIT AND BLOCKS BY PROJECT NAME (Done)
const getparamsforSocialMediaSchema = yup.object({
  projectName: yup.string().label("projectName").required(),
  organizationId: yup.number().label("organizationId").required(),
  availableStatus: yup
    .string()
    .label("availableStatus")
    .optional("should be a string"),
});
const getparamsforSocialMediaSchemaJSONSchema = yupToJsonSchema(
  getparamsforSocialMediaSchema
);
const SOCIAL_MEDIA = {
  name: "social_media",
  description:
    "This tool gets unit and blocks by project name for social media",
  category: "Projects",
  subcategory: "Projects",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [], // List any associated commands if applicable
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: getparamsforSocialMediaSchemaJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ projectName, organizationId, availableStatus }) => {
    try {
      auth_token = process.env.AUTH_TOKEN;
      const { data } = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/projects/${projectName}/availableStatus/${availableStatus}`,
        { headers: { Authorization: `Bearer ${auth_token}` } }
      );
      const response = data.unitsandBlocksbyProject;

      // Calculate the total number of available blocks
      const totalAvailableBlocks = new Set(
        response.map((item) => item.blockName)
      ).size;

      // Calculate the total number of available units
      const totalAvailableUnits = response.length;

      return {
        totalAvailableBlocks,
        totalAvailableUnits,
      };
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool " + err;
    }
  },
};

// const agencyPerformanceJSONSchema = yupToJsonSchema(agencyPerformanceSchema);

// const AGENCY_PERFORMANCE_TRACKER = {
//   name: "agency_performance_tracker",
//   description: "Monitors and reports on the performance of different agencies, such as sales figures and closing ratios.",
//   category: "real_estate_management",
//   subcategory: "agency_performance",
//   functionType: "backend",
//   dangerous: false,
//   associatedCommands: [],
//   prerequisites: [],
//   parameters: agencyPerformanceJSONSchema,
//   rerun: true,
//   rerunWithDifferentParameters: true,
//   runCmd: async ({ timePeriod, metric }) => {
//     try {
//       // Implement your tool's logic here:
//       const data = await axios.get(`api/agencies/performance?timePeriod=${timePeriod}&metric=${metric}`);
//       return JSON.stringify(data);
//     } catch (err) {
//       return "Error trying to execute the tool";
//     }
//   },
// };

const tools = [
  SOLD_UNITS,
  AGENCY_SALES,
  BLOCK_BY_PROJECT,
  UNIT_BY_BLOCK,
  UNITDETAIL_BY_UNITID,
  CONTRACTS_BY_AGENCY,
  ORGANIZATION_USERS,
  GET_REPRESENTATIVES,
  CREATE_AGENCY,
  CREATE_PROJECT,
  CREATE_BLOCK,
  CREATE_UNIT,
  CREATE_ACCOMMODATION,//issue
  CREATE_CONTACT,
  GET_CONTACT_DETAILS_BY_NAME,
  CREATE_CONTACT_NOTE,
  GET_ALL_ACCOMMODATION_BY_CONTACT_ID,//issue
  

  // tolu tools
  SOCIAL_MEDIA,
  GET_UNIT_AND_BLOCKS_BY_PROJECT_NAME,
  GET_ALL_SOLD_UNITS_BY_DATE,
  GET_ALL_SOLD_UNITS_BY_ADDRESS,
  GET_ALL_SOLD_UNITS_BY_AREA,
  GET_ALL_SOLD_UNITS_BY_LOCATION,
  GET_ALL_SOLD_UNITS_BY_PRICE,
  GET_ALL_SOLD_UNITS_BY_PRICERANGE,
  GET_RESERVATIONS_TO_SELL_OUT_RATIO,
  ALL_RESERVATIONS_TOOL,
  UPDATE_DEPOSIT,
  RESERVATION_MANAGER,
  GET_ALL_SOLD_UNITS,
];
module.exports = tools;
