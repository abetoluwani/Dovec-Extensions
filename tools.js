require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const fs = require("fs");
const yupToJsonSchema = require("./yupToJsonSchema");
const { response } = require("express");


// start here 
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

  userOrganizationId: yup.number().label("userOrganizationId").required("should be a number"),
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
  rerun: true,
  rerunWithDifferentParameters: true,
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
    userOrganizationId,
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
          userOrganizationId
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      return JSON.parse(response.data);
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};
//TOOL : GET_CONTACT_DETAILS_BY_NAME 
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

// NEW TOOL : Returns all blocks associated with a specific project by project ID"
const blockByProjectSchema = yup.object({
  projectId: yup.number().label("projectId").required("should be a number"),
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"),
  pageSize: yup.number().label("pageSize").required("should be a number"),
});

const blockByProjectsJsonSchema = yupToJsonSchema(blockByProjectSchema);

const GET_BLOCK_BY_PROJECT = {
  name: "get_block_by_project",
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

// new tools : get project detail 
const projectSchema = yup.object({
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"),
  pageSize: yup.number().label("pageSize").required("should be a number")
});


const projectsJsonSchema = yupToJsonSchema(projectSchema);

const GET_PROJECTS_DETAIL = {
  name: "get_projects_detail",
  description: "Returns all projects associated with a specific organization",
  category: "organization",
  subcategory: "projects",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: projectsJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationId, pageSize }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const { data} = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/projects`,
        {
          params: {
            page_size: pageSize
          },
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const response = data.data;
      console.log(response)
      return response;
    } catch (err) {
      return `Error trying to execute the tool: ${err}`;
    }
  },
};
//NEW TOOL : Returns details of a specific unit by its unit ID
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

//NEW TOOL : Returns all contracts managed by a specific agency ID
const ContractsByAgencySchema = yup.object({
  agencyID: yup.number().label("agencyID").required("should be a number"),
});
const ContractsByAgencyJasonSchema = yupToJsonSchema(ContractsByAgencySchema);
const CONTRACTS_DETAIL_BY_AGENCYID= {
  name: "contracts_detail_by_agencyID",
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

// NEW TOOL: Returns accommodation based on provided details
const accommodationSchema = yup.object({
  organizationId: yup.number().label("organizationId").required("should be a number"),
  contactId: yup.number().label("contactId").required("should be a number"),
  pageSize: yup.number().label("pageSize").required("should be a number"),
});


const accommodationJsonSchema = yupToJsonSchema(accommodationSchema);

const ACCOMMODATION_RESERVED_DETAIL_BY_CONTACT_ID = {
  name: "accommodation_reserved_detail_by_contact_id",
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

//TOOL : GET_CONTACT_DETAILS 
const contactSchema = yup.object({
  organizationId: yup
    .number()
    .label("organizationId")
    .required("should be a number"),
});

const contactJSONSchema = yupToJsonSchema(contactSchema);

const GET_CONTACTS = {
  name: "get_contacts",
  description: "This tool gets all contact details  by organization ID",
  category: "Contact Management",
  subcategory: "Contact Details",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: contactJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ organizationId }) => {
    const TOKEN = process.env.TOKEN;

    try {
      await contactSchema.validate({ organizationId });

      const { data } = await axios.get(
        `http://localhost:3001/organization/${organizationId}/contacts`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      return data.data;
    } catch (error) {
      console.error("Error fetching contact details:", error.message);
      return `Error trying to execute the tool: ${error.message}`;
    }
  }
};
//new tool :gets accommodation details by check-out date

const accommodationCheckoutSchema = yup.object({
  checkoutDate: yup
    .date()
    .label("checkoutDate")
    .required("Checkout date is required"),
  organizationId: yup
    .number()
    .required("Organization ID is required")
    .label("Organization ID"),
  contactId: yup
    .number()
    .required("Contact ID is required")
    .label("Contact ID")
});
const accommodationCheckoutJSONSchema = yupToJsonSchema(accommodationCheckoutSchema);
const GET_ACCOMMODATION_DETAILS_BY_CHECKOUT = {
  name: "get_accommodation_details_by_checkout",
  description: "This tool gets accommodation details by check-out date",
  category: "Accommodation Management",
  subcategory: "Accommodation Details",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: accommodationCheckoutJSONSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ checkoutDate, organizationId, contactId }) => {
    const TOKEN = process.env.TOKEN;

    try {
      await accommodationCheckoutSchema.validate({ checkoutDate, organizationId, contactId });

      const query = new URLSearchParams();
      query.append("filters[0][column]", "accommodations.check_out_date");
      query.append("filters[0][operation]", "equals");
      query.append("filters[0][values][0]", checkoutDate);

      const { data } = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/contacts/${contactId}/accommodations?${query.toString()}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      const accommodations = data.data;
      const accommodationDetails = accommodations.map(accommodation => ({
        accommodationId: accommodation.accommodation_id,
        checkInDate: accommodation.check_in_date,
        checkOutDate: accommodation.check_out_date,
        contactId: accommodation.contact_id,
        createdAt: accommodation.created_at,
        createdBy: accommodation.created_by,
        firstName: accommodation.first_name,
        lastName: accommodation.last_name,
        notes: accommodation.notes,
        numberOfGuests: accommodation.number_of_guests,
        resortName: accommodation.resort_name,
        roomNumber: accommodation.room_number
      }));

      return accommodationDetails;
    } catch (error) {
      console.error("Error fetching accommodation details:", error);
      return `Error trying to execute the tool: ${error.message}`;
    }
  }
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

//NEW TOOL:  return authorized sales representatives for a specified agency within an organization.
const authorizedSalesRepsSchema = yup.object().shape({
  organizationId: yup
    .number()
    .required()
    .label("organizationId"),
  agencyId: yup
    .number()
    .required()
    .label("agencyId"),
});
const authorizedSalesRepsJsonSchema = yupToJsonSchema(authorizedSalesRepsSchema);

const GET_AUTHORIZED_SALES_REPRESENTATIVES = {
  name: "get_authorized_sales_representatives",
  description:
    "Retrieves the list of authorized sales representatives for a specified agency within an organization.",
  category: "sales",
  subcategory: "representatives",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: authorizedSalesRepsJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationId, agencyId }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/agencies/${agencyId}/authorized-sales-representatives`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return `Error executing the tool: ${err.message}`;
    }
  },
};
//new tool : Returns a list of representatives for a specific organization

const getRepresentativesSchema = yup.object().shape({
  organizationId: yup
    .number()
    .required()
    .label("organizationId")
    .typeError("Organization ID must be a number"),
});

const getRepresentativesJsonSchema = yupToJsonSchema(getRepresentativesSchema);

const GET_REPRESENTATIVES = {
  name: "get_representatives",
  description: "Retrieves the list of representatives for a specified organization.",
  category: "organization",
  subcategory: "representatives",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getRepresentativesJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationId }) => {
    const TOKEN = process.env.TOKEN;
    try {
      
      const response = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/representatives`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      return response.data.representatives;
    } catch (err) {
      return `Error executing the tool: ${err.message}`;
    }
  },
};
//new tool :list of agencies for a specified organization
const newGetOrganizationAgenciesSchema = yup.object().shape({
  organizationId: yup
    .number()
    .required()
    .label("Organization ID")
});

const newGetOrganizationAgenciesJsonSchema = yupToJsonSchema(newGetOrganizationAgenciesSchema);
const GET_ORGANIZATION_AGENCIES = {
  name: "get_organization_agencies",
  description: "Retrieves the list of agencies for a specified organization.",
  category: "organization",
  subcategory: "agencies",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: newGetOrganizationAgenciesJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationId }) => {
    const TOKEN = process.env.TOKEN;
    try {
     

      const response = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/agencies`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        
        }
      );

      return response.data.data;
    } catch (err) {
      return `Error executing the tool: ${err.message}`;
    }
  },
};
//new tool:main agencies for a specified organization
const getMainAgenciesSchema = yup.object().shape({
  organizationId: yup
    .number()
    .required()
    .label("Organization ID")
});
const getMainAgenciesJsonSchema = yupToJsonSchema(getMainAgenciesSchema);
const GET_MAIN_AGENCIES = {
  name: "get_main_agencies",
  description: "Retrieves the list of main agencies for a specified organization.",
  category: "organization",
  subcategory: "agencies",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: getMainAgenciesJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: false,
  runCmd: async ({ organizationId }) => {
    const TOKEN = process.env.TOKEN;
    if (!TOKEN) {
      return "Error: No authorization token provided.";
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/main-agencies`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          }
        }
      );

      
      return response.data;
    } catch (err) {
      return `Error executing the tool: ${err.response?.data?.message || err.message}`;
    }
  },
};

//new tool:
const contactNotesSchema = yup.object({
  organizationId: yup
    .number()
    .label("organizationId")
    .required("Organization ID should be a number"),
  contactId: yup
    .number()
    .label("contactId")
    .required("Contact ID should be a number"),
  pageSize: yup.number().label("pageSize").required("Page size should be a number"),
});

const contactNotesJsonSchema = yupToJsonSchema(contactNotesSchema);
const GET_CONTACT_NOTES = {
  name: "get_contact_notes",
  description: "Returns all notes associated with a specific contact within an organization",
  category: "organization",
  subcategory: "contacts",
  functionType: "backend",
  dangerous: false,
  associatedCommands: [],
  prerequisites: [],
  parameters: contactNotesJsonSchema,
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ organizationId, contactId, pageSize }) => {
    const TOKEN = process.env.TOKEN;
    try {
      const { data } = await axios.get(
        `http://localhost:3001/organizations/${organizationId}/contacts/${contactId}/notes`,
        {
          params: {
            page_size: pageSize,
          },
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const response = data.data;
      console.log(response);
      return response;
    } catch (err) {
      return `Error trying to execute the tool: ${err.message}`;
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
  rerunWithDifferentParameters: true,
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
    if (!TOKEN) {
      console.error("No authorization token found.");
      return;
    }
  
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
      console.error("Error trying to execute the tool:", err.message);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
      throw err; // Rethrow the error after logging
    }
  },
  
};


const tools = [GET_CONTACT_DETAILS_BY_NAME,GET_BLOCK_BY_PROJECT,
  GET_PROJECTS_DETAIL,UNITDETAIL_BY_UNITID,CONTRACTS_DETAIL_BY_AGENCYID,ACCOMMODATION_RESERVED_DETAIL_BY_CONTACT_ID,
  GET_CONTACTS ,GET_ACCOMMODATION_DETAILS_BY_CHECKOUT,CREATE_CONTACT_NOTE,GET_AUTHORIZED_SALES_REPRESENTATIVES,GET_REPRESENTATIVES,
  GET_ORGANIZATION_AGENCIES, GET_MAIN_AGENCIES ,GET_CONTACT_NOTES,
];
module.exports = tools;