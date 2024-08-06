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

// GET SOLD UNIT AND BLOCKS BY PROJECT NAME (Done)
const getAllSoldUnitByProjectNameSchema = yup.object({
    projectName: yup.string().label("projectName").required(),
    organizationId: yup.number().label("organizationId").required(),
    availableStatus: yup
        .number()
        .label("availableStatus")
        .optional("should be a string"),
});
const getAllSoldUnitByProjectNameSchemaJSONSchema = yupToJsonSchema(
    getAllSoldUnitByProjectNameSchema
);
const GET_ALL_SOLD_UNITS_BY_PROJECT_NAME = {
    name: "get_all_sold_units_by_project_name",
    description: "This tool gets all sold unit by project name",
    category: "Projects",
    subcategory: "Projects",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: getAllSoldUnitByProjectNameSchemaJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ projectName, organizationId, availableStatus }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;
            availableStatus = 6;
            const { data } = await axios.get(
                `http://localhost:3001/organizations/${organizationId}/projects/${projectName}/availableStatus/${availableStatus}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            console.log(data);
            const response = data.unitsandBlocksbyProject;

            // Structure the final result
            const result = {
                availableUnits: response.map((item) => ({
                    unitId: item.unitId,
                    blockName: item.blockName,
                    projectName: item.projectName,
                    unitStatusId: item.unitStatusId,
                })),
            };
            if (result.availableUnits.length === 0) {
                return "No units have been sold for this project";
            } else {
                return result;
            }
        } catch (err) {
            // Handle potential errors and return a meaningful message
            return "Error trying to execute the tool " + err;
        }
    },
};

// GET ALL SOLD UNITS (Done)
const soldAllUnitsSchema = yup.object({});

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
            return response;
        } catch (err) {
            // Handle potential errors and return a meaningful message
            return "Error trying to execute the tool " + err;
        }
    },
};

// Get All Deposits (Done)
const getAllDepositsSchema = yup.object({});

const getAllDepositsJSONSchema = yupToJsonSchema(getAllDepositsSchema);

const GET_ALL_DEPOSITS = {
    name: "get_all_deposits",
    description: "This tool gets all deposits",
    category: "real_estate_management",
    subcategory: "deposits",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: getAllDepositsJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;
            const { data } = await axios.get(
                `http://localhost:3001/get-all-deposits`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            const response = data.deposits;
            const result = {
                deposit: response.map((item) => ({
                    depositId: item.depositId,
                    depositAmount: item.depositAmount,
                    agencyName: item.agencyName,
                    mainListingPrice: item.mainListingPrice,
                    mainListingPriceType: item.mainListingPriceType,
                    agreementPrice: item.agreementPrice,
                    agreementPriceType: item.agreementPriceType,
                    discountPrice: item.discountPrice,
                    discountPriceType: item.discountPriceType,
                    agencyCommission: item.agencyCommission,
                    contactChannel: item.contactChannel,
                    depositStatus: item.depositStatus
                })),
            };
            if (result.deposit.length === 0) {
                return "No deposit has been made";
            } else {
                return result;
            }
        } catch (err) {
            // Handle potential errors and return a meaningful message
            return "Error trying to execute the tool " + err;
        }
    },
};



// Get Reservations The Reservations Ratio  to Sell Out Ratio for a given date (Done)
const reservetoselloutratioSchema = yup.object({
    start_date: yup.date().label("start_date").optional("should be a string"),
    end_date: yup.date().label("end_date").optional("should be a string"),
 });
const reservetoselloutratioJSONSchema = yupToJsonSchema(
    reservetoselloutratioSchema
);
const GET_RESERVATIONS_TO_SELL_OUT_RATIO = {
    name: "get_reservations_to_sell_out_ratio",
    description: "Calculates the reservations to sell out ratio ",
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
                    "units.unit_status_id"
                );
                sellOutQuery.append("filters[0][operation]", "equals");
                sellOutQuery.append("filters[0][values][0]", "6");
                sellOutQuery.append("filters[1][column]", "units.sold_time");
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
                `http://localhost:3001/units?${sellOutQuery.toString()}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            const soldUnits = solddata.data.data;
            console.log(soldUnits, "soldUnits");

            // Calculate reservation and sell-out counts
            const totalReservations = reservations.length;
            console.log(totalReservations, "totalReservations");
            const totalSellOuts = soldUnits.length;
            console.log(totalSellOuts, "totalSellOuts");


            // reservation ratio to sell out ratio
            reservationratio_to_selloutratio = totalReservations / totalSellOuts;
            selloutratio_to_reservationratio = totalSellOuts / totalReservations;
            return {

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

// Get All Units (Done)
const getAllUnitsSchema = yup.object({});

const getAllUnitsJSONSchema = yupToJsonSchema(getAllUnitsSchema);

const GET_ALL_UNITS = {
    name: "get_all_units",
    description: "This tool gets all units",
    category: "real_estate_management",
    subcategory: "units",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: getAllUnitsJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;
            const { data } = await axios.get(
                `http://localhost:3001/units`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            const response = data.data;


            const result = {
                units: response.map((item) => ({
                    unit_id: item.unit_id,
                    address_line_1: item.address_line_1,
                    block: item.block,
                    unitType: item.unit_type,
                    unitArea: item.unit_area,
                    unitPrice: item.unit_price,
                    unitLocation: item.unit_location,
                    unitSoldTime: item.sold_time,
                })),
            };
            if (result.units.length === 0) {
                return "No units have been created";
            } else {
                return result;
            }

        } catch (err) {
            // Handle potential errors and return a meaningful message
            return "Error trying to execute the tool " + err;
        }
    },
};

// Get All Reservations (Done)
const reservationSchema = yup.object({
    start_date: yup.date().label("start_date").required("should be a Date"),
    end_date: yup.date().label("end_date").required("should be a Date"),
});
const reservationJSONSchema = yupToJsonSchema(reservationSchema);
const GET_ALL_RESERVATIONS = {
    name: "get_all_reservations",
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
                console.log(data, "dataaa");
                query.append("filters[0][operation]", "isDateBetween");
                query.append("filters[0][values][0]", start_date);
                query.append("filters[0][values][1]", end_date);
            };

            const { data } = await axios.get(
                `http://localhost:3001/unit-reservations/?${query.toString()}`
            );
            const response = data.data;

            return response;
        } catch (err) {
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

// GET ALL SOLD UNITS BY PRICE (Done)
const soldUnitsbypriceSchema = yup.object({
    price: yup.number().label("price").required(),
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
    runCmd: async ({ price }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;

            // localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=equals&filters[1][values][0]=3000
            //localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=between&filters[1][values][0]=3000&filters[1][values][1]=10000
            const query = new URLSearchParams({ price });

            if (price) {
                query.append("filters[1][column]", "units.unit_price");
                query.append("filters[1][operation]", "equals");
                query.append("filters[1][values][0]", price);
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
const GET_AVAILABLE_UNIT_AND_BLOCKS_BY_PROJECT_NAME = {
    name: "get_available_unit_and_blocks_by_project_name",
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


const tools = [ GET_ALL_SOLD_UNITS_BY_DATE, GET_ALL_SOLD_UNITS_BY_PRICE, GET_ALL_SOLD_UNITS_BY_AREA, GET_ALL_SOLD_UNITS_BY_PRICERANGE, GET_RESERVATIONS_TO_SELL_OUT_RATIO, GET_ALL_UNITS, GET_ALL_RESERVATIONS, GET_ALL_DEPOSITS, GET_ALL_SOLD_UNITS, FILE_READER, PRODUCT_FINDER, WEATHER_FROM_LOCATION, GET_ALL_SOLD_UNITS_BY_PROJECT_NAME];
module.exports = tools;