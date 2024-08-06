require("dotenv").config();
const axios = require("axios");
const yup = require("yup");
const fs = require("fs");
const yupToJsonSchema = require("./yupToJsonSchema");

const getProductSchema = yup.object({
    product: yup.string().label("product").required("should be a string"),
});
const getProductsJSONSchema = yupToJsonSchema(getProductSchema);
const PRODUCT_FINDER = {
    name: "product_finder",
    description:
        "finds and returns dummy products details from json dummy datas based on the product name passed to it",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: getProductsJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ product }, memory) => { // memory comes from the server
        try {
            const { data } = await axios.get(
                `https://dummyjson.com/products/search?q=${encodeURIComponent(product)}`
            );
            memory[product] = JSON.stringify(data); // the product will be saved in the memory
            return {
                responseString: "product found", // this string will be returned to the chat bot
                memory: memory // memory is returned back to the server after being updated 
            }
        } catch (err) {
            return "Error trying to execute the tool";
        }
    },
};

const weatherCitySchema = yup.object({
    city: yup.string().label("city").required("should be a string"),
});
const weatherCityJSONSchema = yupToJsonSchema(weatherCitySchema);
const WEATHER_FROM_LOCATION = {
    name: "city_weather_data",
    description: "gets the weather details from a given city name",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: weatherCityJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ city }) => {
        const ApiKey = process.env.WEATHER_API_KEY;
        try {
            const { data } = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`
            );
            return JSON.stringify({
                weather: data.weather[0].description,
                main: data.main,
                coords: data.coord,
            });
        } catch (err) {
            return "Error trying to execute the tool";
        }
    },
};

const getFilePathSchema = yup.object({
    filePath: yup.string().label("filePath").required("should be a file path"),
});
const getFilePathJSONSchema = yupToJsonSchema(getFilePathSchema);
const FILE_READER = {
    name: "file_reader",
    description:
        "returns the contents of a file given its filepath in the repository",
    category: "hackathon",
    subcategory: "communication",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: getFilePathJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ filePath }) => {
        try {
            const buffer = fs.readFileSync(filePath);
            const fileContents = buffer.toString("utf8");
            return fileContents;
        } catch (error) {
            return "An error ocured while looking for the file content";
        }
    },
};

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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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
//7.NEW TOOL : returns a list of users associated with a specific organization
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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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
        const TOKEN = process.env.AUTH_TOKEN;
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

// tolu tools

// Get reservations (dONE)
const reservationSchema = yup.object({
    start_date: yup.date().label("start_date").required("should be a Date"),
    end_date: yup.date().label("end_date").required("should be a Date"),
});
const reservationJSONSchema = yupToJsonSchema(reservationSchema);
const ALL_RESERVATIONS_TOOL = {
    name: "gets_reservations",
    description: "gets all reservations that have been made on the platform",
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
    runCmd: async ({ }) => {
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
        .number()
        .label("availableStatus")
        .optional("should be a string"),
});
const getUnitAndBlocksByProjectNameSchemaJSONSchema = yupToJsonSchema(
    getUnitAndBlocksByProjectNameSchema
);
const GET_UNIT_AND_BLOCKS_BY_PROJECT_NAME = {
    name: "get_unit_and_blocks_by_project_name",
    description: "This tool gets all available unit and blocks by project name",
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
            availableStatus = 1;
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
        .number()
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
            availableStatus = 1;
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


// Revenue  Calculator (Done)
// const revenueSchema = yup.object({
//   start_date: yup.date().label("start date").required("should be a datetime"),
//   end_date: yup.date().label("end date").required("should be a datetime"),
// });
// const revenueSchemaJSONSchema = yupToJsonSchema(revenueSchema);
// const REVENUE = {
//   name: "revenue",
//   description: "This tool calculates the sales growth rate using revenue, growth targets, and ACV to determine how many leads you'll need.",
//   category: "Projects",
//   subcategory: "Projects",
//   functionType: "backend",
//   dangerous: false,
//   associatedCommands: [], // List any associated commands if applicable
//   prerequisites: [], // List any prerequisites for your tool to run
//   parameters: revenueSchemaJSONSchema,
//   rerun: true,
//   rerunWithDifferentParameters: true,
//   runCmd: async ({ start_date, end_date }) => {

//     try {
//       auth_token = process.env.AUTH_TOKEN;
//       const query = new URLSearchParams({ start_date, end_date });
//       if ((start_date, end_date)) {
//         query.append("filters[1][column]", "units.sold_time");
//         query.append("filters[1][operation]", "isDateBetween");
//         query.append("filters[1][values][0]", start_date);
//         query.append("filters[1][values][1]", end_date);
//       }
//       const { data } = await axios.get(
//         `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
//         { headers: { Authorization: `Bearer ${auth_token}` } }
//       );
//       const response = data.data.map((unit) => ({
//         unitArea: unit.unit_area,
//         unitPrice: unit.unit_price,
//         unitLocation: unit.unit_location,
//         unitSoldTime: unit.sold_time,
//       }));

//       const totalRevenue = response.reduce((total, unit) => total + unit.unitPrice, 0);

//       return {
//         totalRevenue
//       };
//     } catch (err) {
//       // Handle potential errors and return a meaningful message
//       return "Error trying to execute the tool " + err;
//     }
//   }
// };

// Revenue Comparison (Done)

const revenueComparisonSchema = yup.object({
    year1: yup.number().label("year1").required("should be a number"),
    year2: yup.number().label("year2").required("should be a number"),
});

const revenueComparisonJSONSchema = yupToJsonSchema(revenueComparisonSchema);

const REVENUE_COMPARISON = {
    name: "revenue_comparison",
    description: "This tool compares the revenue for 2 different years and gives the percentage increase or decrease , as well as identifies any losses.",
    category: "Projects",
    subcategory: "Revenue",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: revenueComparisonJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ year1, year2 }) => {
        try {
            const auth_token = process.env.AUTH_TOKEN;

            // Function to fetch revenue data for a specific year
            const fetchRevenueData = async (year) => {
                const startDate = `${year}-01-01 00:00:00`;
                const endDate = `${year}-12-31 23:59:59`;
                const query = new URLSearchParams();
                query.append("filters[1][column]", "units.sold_time");
                query.append("filters[1][operation]", "isDateBetween");
                query.append("filters[1][values][0]", startDate);
                query.append("filters[1][values][1]", endDate);

                const { data } = await axios.get(
                    `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
                    { headers: { Authorization: `Bearer ${auth_token}` } }
                );

                const totalRevenue = data.data.reduce((total, unit) => total + unit.unit_price, 0);

                return totalRevenue;
            };

            // Fetch revenue for both years
            const revenueYear1 = await fetchRevenueData(year1);
            const revenueYear2 = await fetchRevenueData(year2);


            // Calculate percentage change
            if (revenueYear1 === 0) {
                revenueChange = revenueYear2 > 0 ? 100 : 0;
            } else {
                revenueChange = ((revenueYear2 - revenueYear1) / revenueYear1) * 100;
            }


            console.log(revenueChange);

            const revenue = revenueYear2 - revenueYear1;

            const revenueAmount = revenue > 0 ? 'Profit of ' + revenue : revenue < 0 ? 'Loss of ' + revenue : 'no change';

            const revenuePercentageStatus = revenueYear2 > revenueYear1 ? revenueChange.toFixed(2) + '% Profit' :
                revenueYear2 < revenueYear1 ? revenueChange.toFixed(2) + '% Loss' : 'no change';

            return {
                year1: { year: year1, totalRevenue: revenueYear1 },
                year2: { year: year2, totalRevenue: revenueYear2 },
                revenueAmount,
                revenuePercentageStatus,
            };

        } catch (err) {
            // Handle potential errors and return a meaningful message
            return {
                success: false,
                message: "Error trying to execute the tool: " + err.message
            };
        }
    },
};

// All Revenue Comparison (Done)

const allrevenue_comparisonSchema = yup.object({
    year1: yup.number().label("year1").required("should be a number"),
    year2: yup.number().label("year2").required("should be a number"),
});

const allrevenue_comparisonJSONSchema = yupToJsonSchema(allrevenue_comparisonSchema);


const ALLREVENUE_COMPARISON = {
    name: "allrevenue_comparison",
    description: "This tool compares the revenue for the range of 2 years and the years that fall within the range to find the total revenue , compares the revenue for amongst each other and gives  the percentage increase or decrease, as well as identifies any losses.",
    category: "Projects",
    subcategory: "Revenue",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: allrevenue_comparisonJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ year1, year2 }) => {
        try {
            const auth_token = process.env.AUTH_TOKEN;

            // Function to fetch revenue data for a specific year
            const fetchRevenueData = async (year) => {
                const startDate = `${year}-01-01 00:00:00`;
                const endDate = `${year}-12-31 23:59:59`;
                const query = new URLSearchParams();
                query.append("filters[1][column]", "units.sold_time");
                query.append("filters[1][operation]", "isDateBetween");
                query.append("filters[1][values][0]", startDate);
                query.append("filters[1][values][1]", endDate);

                const { data } = await axios.get(
                    `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
                    { headers: { Authorization: `Bearer ${auth_token}` } }
                );

                const totalRevenue = data.data.reduce((total, unit) => total + unit.unit_price, 0);

                return totalRevenue;
            };

            // Loop through all years between year1 and year2
            const yearRange = [];
            for (let year = year1; year <= year2; year++) {
                yearRange.push(year);
            }

            // Fetch revenue data for all years in the range
            const revenueDataPromises = yearRange.map((year) => fetchRevenueData(year));
            const revenueData = await Promise.all(revenueDataPromises);

            const revenueResults = yearRange.map((year, index) => ({
                year,
                totalRevenue: revenueData[index],
            }));

            // Calculate revenue change and status for each year compared to the previous year
            const results = revenueResults.map((data, index) => {
                if (index === 0) {
                    // No previous year to compare with
                    return {
                        ...data,
                        revenueChange: 'N/A',
                        revenueAmount: 'N/A',
                        revenuePercentageStatus: 'N/A',
                    };
                }

                const prevData = revenueResults[index - 1];
                let revenueChange;
                let revenueAmount;
                let revenuePercentageStatus;

                if (prevData.totalRevenue === 0) {
                    // If previous year revenue is 0
                    revenueChange = data.totalRevenue > 0 ? 100 : 0;
                } else {
                    revenueChange = ((data.totalRevenue - prevData.totalRevenue) / Math.abs(prevData.totalRevenue)) * 100;
                }

                revenueAmount =
                    data.totalRevenue > prevData.totalRevenue
                        ? `Profit of ${data.totalRevenue - prevData.totalRevenue}`
                        : data.totalRevenue < prevData.totalRevenue
                            ? `Loss of ${prevData.totalRevenue - data.totalRevenue}`
                            : 'No change';

                revenuePercentageStatus =
                    data.totalRevenue > prevData.totalRevenue
                        ? `${revenueChange.toFixed(2)}% Profit`
                        : data.totalRevenue < prevData.totalRevenue
                            ? `${revenueChange.toFixed(2)}% Loss`
                            : 'No change';

                return {
                    ...data,
                    revenueChange: revenueChange !== undefined ? revenueChange.toFixed(2) + '%' : 'N/A',
                    revenueAmount,
                    revenuePercentageStatus,
                };
            });

            return {
                success: true,
                revenueResults: results,
            };
        } catch (error) {
            return {
                success: false,
                message: `Error trying to execute the tool: ${error.message}`,
            };
        }

    },
};


// Get Project , Blocks and Units by Project Location
const getUnitAndBlocksByProjectLocationSchema = yup.object({
    location: yup.string().label("location").required("should be a string"),
    organizationId: yup.number().label("organizationId").required(),
});

const getUnitAndBlocksByProjectLocationSchemaJSONSchema = yupToJsonSchema(
    getUnitAndBlocksByProjectLocationSchema
);

const GET_UNIT_AND_BLOCKS_BY_PROJECT_LOCATION = {
    name: "get_unit_and_blocks_by_project_location",
    description: "Get Unit And Blocks By Project Location",
    subcategory: "Revenue",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: getUnitAndBlocksByProjectLocationSchemaJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ location, organizationId }) => {
        try {
            const auth_token = process.env.AUTH_TOKEN;
            const { data } = await axios.get(
                `http://localhost:3001/organizations/${organizationId}/projects/location/${location}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );

            // Extract the projectsByLocation array from the response data
            // const response = data.data;

            return data;

        } catch (err) {
            return {
                message: "Error trying to execute the tool: " + err.message
            };
        }


    }
};


const tools = [
    FILE_READER,
    PRODUCT_FINDER,
    WEATHER_FROM_LOCATION,
    SOLD_UNITS, // Done
    AGENCY_SALES, // Re-evaluate this tool
    BLOCK_BY_PROJECT, // Re-evaluate this tool
    // UNIT_BY_BLOCK, // "Error trying to execute the tool: AxiosError: Request failed with status code 500"
    UNITDETAIL_BY_UNITID,
    //CONTRACTS_BY_AGENCY, // Wrong Output it returns the contact details and has nothing to do with contracts
    // ORGANIZATION_USERS, //"Error trying to execute the tool: AxiosError: Request failed with status code 500"
    GET_REPRESENTATIVES,
    CREATE_AGENCY,
    // CREATE_PROJECT,
    // CREATE_BLOCK,
    // tolu tools
    GET_AVAILABLE_SOLD_UNITS_BY_PROJECT_NAME, // Done
    GET_UNIT_AND_BLOCKS_BY_PROJECT_LOCATION,
    ALLREVENUE_COMPARISON, // Done
    SOCIAL_MEDIA, // Done
    REVENUE_COMPARISON, // Done
    GET_UNIT_AND_BLOCKS_BY_PROJECT_NAME, // Done
    // GET_ALL_SOLD_UNITS_BY_DATE, // Done
    GET_ALL_SOLD_UNITS_BY_ADDRESS, // Done
    // GET_ALL_SOLD_UNITS_BY_AREA, // Done
    GET_ALL_SOLD_UNITS_BY_LOCATION, // Done
    // GET_ALL_SOLD_UNITS_BY_PRICE, // Done
    // GET_ALL_SOLD_UNITS_BY_PRICERANGE, // Done
    // GET_RESERVATIONS_TO_SELL_OUT_RATIO,
    ALL_RESERVATIONS_TOOL, // Done
    UPDATE_DEPOSIT,
    GET_ALL_SOLD_UNITS, // Done
];
module.exports = tools;
