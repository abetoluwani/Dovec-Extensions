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
            // calculate the ratio percentage
            reservationratio_to_selloutratio_percentage =
                ((reservationratio_to_selloutratio * 100) / totalSellOuts).toFixed(2);
            selloutratio_to_reservationratio_percentage =
                ((selloutratio_to_reservationratio * 100) / totalReservations).toFixed(2);
            return {

                totalReservations,
                totalSellOuts,
                reservationratio_to_selloutratio,
                reservationratio_to_selloutratio_percentage,
                selloutratio_to_reservationratio,
                selloutratio_to_reservationratio_percentage
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
                query.append("filters[0][column]", "unit_reservations.reservation_start_date");
                query.append("filters[0][operation]", "isDateBetween");
                query.append("filters[0][values][0]", start_date);
                query.append("filters[0][values][1]", end_date);
            };
            const { data } = await axios.get(
                `http://localhost:3001/unit-reservations/?${query.toString()}`
            );
            const response = data.data.map((reservation) => ({
                reservation_id: reservation.unit_reservation_id,
                unit_id: reservation.unit_id,
                address: reservation.venue_address,
                reservation_start_date: reservation.reservation_start_date,
                reservation_end_date: reservation.reservation_end_date,
            }));

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
                    address: units.address_line_1,
                    block: units.block,
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
                    block: units.block,
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
                })),
            };

            return result;
        } catch (err) {
            // Handle potential errors and return a meaningful message
            return "Error trying to execute the tool " + err;
        }
    },
};

// Revenue Comparison (Done)

const revenueComparisonSchema = yup.object({
    year1: yup.number().label("year1").required("should be a number"),
    year2: yup.number().label("year2").required("should be a number"),
});

const revenueComparisonJSONSchema = yupToJsonSchema(revenueComparisonSchema);

const REVENUE_COMPARISON = {
    name: "revenue_comparison_for_different_years",
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
            const authToken = process.env.AUTH_TOKEN;

            const fetchRevenueData = async (year) => {
                const startDate = `${year}-01-01 00:00:00`;
                const endDate = `${year}-12-31 23:59:59`;
                const query = new URLSearchParams({
                    "filters[1][column]": "units.sold_time",
                    "filters[1][operation]": "isDateBetween",
                    "filters[1][values][0]": startDate,
                    "filters[1][values][1]": endDate,
                });

                const { data } = await axios.get(
                    `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );

                return data.data.reduce((total, unit) => total + unit.unit_price, 0);
            };

            const [revenueYear1, revenueYear2] = await Promise.all([fetchRevenueData(year1), fetchRevenueData(year2)]);

            const revenueChange = revenueYear1 === 0 ? (revenueYear2 > 0 ? 100 : 0) : ((revenueYear2 - revenueYear1) / revenueYear1) * 100;
            const revenueAmount = revenueYear2 - revenueYear1;
            const revenueAmountText = revenueAmount ? (revenueAmount > 0 ? `Profit of ${revenueAmount}` : `Loss of ${revenueAmount}`) : 'No change';
            const revenuePercentageStatus = revenueChange ? (revenueYear2 > revenueYear1 ? `${revenueChange.toFixed(2)}% Profit` : `${revenueChange.toFixed(2)}% Loss`) : 'No change';

            return {
                year1: { year: year1, totalRevenue: revenueYear1 },
                year2: { year: year2, totalRevenue: revenueYear2 },
                revenueAmount: revenueAmountText,
                revenuePercentageStatus,
            };
        } catch (error) {
            return {
                message: `Error trying to execute the tool: ${error.message}`
            };
        }
    },
};


// Range Revenue Comparison (Done)

const revenue_range_comparisonSchema = yup.object({
    year1: yup.number().label("year1").required("should be a number"),
    year2: yup.number().label("year2").required("should be a number"),
});

const revenue_range_comparisonJSONSchema = yupToJsonSchema(revenue_range_comparisonSchema);


const REVENUE_RANGE_COMPARISON = {
    name: "revenue_range_comparison",
    description: "This tool compares the revenue for the range of 2 years and the years that fall within the range to find the total revenue , compares the revenue for amongst each other and gives  the percentage increase or decrease, as well as identifies any losses.",
    category: "Projects",
    subcategory: "Revenue",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: revenue_range_comparisonJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ year1, year2 }) => {
        try {

            const authToken = process.env.AUTH_TOKEN;
            if (!authToken) {
                throw new Error('AUTH_TOKEN environment variable is missing');
            }

            const fetchRevenueData = async (year) => {
                const startDate = `${year}-01-01 00:00:00`;
                const endDate = `${year}-12-31 23:59:59`;
                const query = new URLSearchParams({
                    "filters[1][column]": "units.sold_time",
                    "filters[1][operation]": "isDateBetween",
                    "filters[1][values][0]": startDate,
                    "filters[1][values][1]": endDate,
                });

                const response = await axios.get(
                    `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&${query.toString()}`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );

                if (response.status !== 200) {
                    throw new Error(`Failed to fetch revenue data for year ${year}: ${response.statusText}`);
                }

                const { data } = response;
                if (!Array.isArray(data.data)) {
                    throw new Error(`Invalid response data for year ${year}: ${JSON.stringify(data)}`);
                }

                return data.data.reduce((total, unit) => total + (unit.unit_price || 0), 0);
            };

            const yearRange = Array.from({ length: year2 - year1 + 1 }, (_, i) => year1 + i);

            const revenueDataPromises = yearRange.map((year) => fetchRevenueData(year));
            const revenueData = await Promise.all(revenueDataPromises);

            const revenueResults = yearRange.map((year, index) => ({
                year,
                totalRevenue: revenueData[index],
            }));

            const results = revenueResults.map((data, index) => {
                if (index === 0) {
                    return {
                        ...data,
                        revenueChange: 'N/A',
                        revenueAmount: 'N/A',
                        revenuePercentageStatus: 'N/A',
                    };
                }

                const prevData = revenueResults[index - 1];
                const prevTotalRevenue = prevData.totalRevenue || 0;
                const totalRevenue = data.totalRevenue || 0;
                const revenueChange = ((totalRevenue - prevTotalRevenue) / Math.abs(prevTotalRevenue)) * 100;
                const revenueAmount =
                    totalRevenue > prevTotalRevenue
                        ? `Profit of ${totalRevenue - prevTotalRevenue}`
                        : totalRevenue < prevTotalRevenue
                            ? `Loss of ${prevTotalRevenue - totalRevenue}`
                            : 'No change';

                const revenuePercentageStatus =
                    totalRevenue > prevTotalRevenue
                        ? `${revenueChange.toFixed(2)}% Profit`
                        : totalRevenue < prevTotalRevenue
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
                revenueResults: results,
            };
        } catch (error) {
            return {
                message: `Error trying to execute the tool: ${error.message}`,
            };
        }
    },
};



// Get All Projects
const getAllProjectsSchema = yup.object({
    organizationId: yup.number().label("organizationId").required(),
})

const getAllProjectsSchemaJSONSchema = yupToJsonSchema(getAllProjectsSchema);

const GET_ALL_PROJECTS = {
    name: "get_all_projects",
    description: "Get All Projects",
    category: "Projects",
    subcategory: "Revenue",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: getAllProjectsSchemaJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ organizationId }) => {
        try {
            const auth_token = process.env.AUTH_TOKEN;
            const { data } = await axios.get(
                `http://localhost:3001/organizations/${organizationId}/projects`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );

            const response = data.data;

            return response;
        } catch (err) {
            return {
                message: "Error trying to execute the tool: " + err.message
            };
        }
    }
};

// Get All Projects By Location
const getAllProjectsByLocationSchema = yup.object({
    location: yup.string().label("location").required("should be a string"),
    organizationId: yup.number().label("organizationId").required(),
});

const getAllProjectsByLocationSchemaJSONSchema = yupToJsonSchema(getAllProjectsByLocationSchema);


const GET_ALL_PROJECTS_BY_LOCATION = {
    name: "get_all_projects_by_location",
    description: "Get All Projects",
    category: "Projects",
    subcategory: "Projects",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: getAllProjectsByLocationSchemaJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ organizationId, location }) => {
        try {
            const auth_token = process.env.AUTH_TOKEN;
            const { data } = await axios.get(
                `http://localhost:3001/organizations/${organizationId}/projects/location/${location}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );

            // Process data to create the desired response structure
            const result = data.projectsByLocation.reduce((acc, project) => {
                if (!acc[project.projectName]) {
                    acc[project.projectName] = {
                        projectName: project.projectName,
                        iconUrl: project.iconUrl,
                        videoUrl: project.videoUrl,
                        downPaymentPercentagePerUnit: project.downPaymentPercentagePerUnit,
                        location: project.location,
                        totalBlocks: new Set(),
                        totalUnits: 0,
                        soldUnits: 0,
                        availableUnits: 0,
                        totalPrice: 0,
                    };
                }

                const projectAcc = acc[project.projectName];

                projectAcc.totalBlocks.add(project.block);
                projectAcc.totalUnits += 1;
                projectAcc.totalPrice += project.unitPrice;

                if (project.unitStatusId === "Sold") {
                    projectAcc.soldUnits += 1;
                } else {
                    projectAcc.availableUnits += 1;
                }

                return acc;
            }, {});

            // Convert Sets to their sizes and calculate starting prices
            Object.values(result).forEach(project => {
                project.totalBlocks = project.totalBlocks.size;
                project.startingPrice = Math.round((project.totalPrice / project.totalUnits) * 1000) / 1000;
                delete project.totalPrice;
            });

            // Create the final structured response
            const response = Object.values(result);

            return response;
        } catch (error) {
            console.error("Error fetching project data:", error);
        }


    }
};


// // Get All Pending Deposits (Not Completed yet)
// const getAllPendingDepositsSchema = yup.object({
// })
// const getAllPendingDepositsSchemaJSONSchema = yupToJsonSchema(getAllPendingDepositsSchema);

// const GET_ALL_PENDING_DEPOSITS = {
//     name: "get_all_pending_deposits",
//     description: "Get All Pending Deposits",
//     category: "Projects",
//     subcategory: "Revenue",
//     functionType: "backend",
//     dangerous: false,
//     associatedCommands: [], // List any associated commands if applicable
//     prerequisites: [], // List any prerequisites for your tool to run
//     parameters: getAllPendingDepositsSchemaJSONSchema,
//     rerun: true,
//     rerunWithDifferentParameters: true,

//     runCmd: async () => {
//         try {
//             const auth_token = process.env.AUTH_TOKEN;
//             const { data } = await axios.get(
//                 `http://localhost:3001/get-all-pending-deposits`,
//                 { headers: { Authorization: `Bearer ${auth_token}` } }
//             );
//             const response = data.data;
//             return data;
//         } catch (err) {
//             return {
//                 message: "Error trying to execute the tool: " + err.message
//             }
//         }
//     }
// };


// GET ALL SOLD UNITS BY PRICE RANGE  (Done)
const availableUnitsbypricerangeSchema = yup.object({
    price1: yup.number().label("price1").required(),
    price2: yup.number().label("price2").required(),
});

const availableUnitsbypricerangeJSONSchema = yupToJsonSchema(
    availableUnitsbypricerangeSchema
);

const GET_ALL_AVAILABLE_UNITS_BY_PRICERANGE = {
    name: "get_all_available_units_by_pricerange",
    description: "This tool gets all available units by price range",
    category: "Sales Analysis",
    subcategory: "Performance Analysis",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: availableUnitsbypricerangeJSONSchema,
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
                `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=1&${query.toString()}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            console.log(data);
            const response = data.data.map((units) => {
                return {
                    // address: units.address_line_1,
                    // unitType: units.unit_type,
                    unitId: units.unit_id,
                    unitArea: units.unit_area,
                    block: units.block,
                    unitPrice: units.unit_price,
                    Address: units.address_line_1,
                    Locaton: units.unit_location,

                };
            });
            // console.log(response);
            return response;
        } catch (err) {
            return "Error trying to execute the tool " + err;
        }
    },
};

// Available Units By Location
const availableUnitsbyLocationSchema = yup.object({
    location: yup.string().label("location").required(),
});

const availableUnitsbyLocationJSONSchema = yupToJsonSchema(
    availableUnitsbyLocationSchema
);

const GET_ALL_AVAILABLE_UNITS_BY_LOCATION = {
    name: "get_all_available_units_by_location",
    description: "This tool gets all available units by price range",
    category: "Sales Analysis",
    subcategory: "Performance Analysis",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: availableUnitsbyLocationJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ location }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;

            // localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=equals&filters[1][values][0]=3000
            //localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=between&filters[1][values][0]=3000&filters[1][values][1]=10000
            const query = new URLSearchParams({ location });

            if (location) {
                query.append("filters[1][column]", "units.unit_location");
                query.append("filters[1][operation]", "equals");
                query.append("filters[1][values][0]", location);
            }
            const { data } = await axios.get(
                `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=1&${query.toString()}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            console.log(data);
            const response = data.data.map((units) => {
                return {
                    // address: units.address_line_1,
                    // unitType: units.unit_type,
                    unitId: units.unit_id,
                    unitArea: units.unit_area,
                    block: units.block,
                    type: units.unit_type,
                    unitPrice: units.unit_price,
                    Address: units.address_line_1,
                    Locaton: units.unit_location,

                };
            });
            return response;
        } catch (err) {
            return "Error trying to execute the tool " + err;
        }
    },
};

// Available Units By Area
const availableUnitsbyAreaSchema = yup.object({
    area: yup.string().label("area").required(),
});

const availableUnitsbyAreaJSONSchema = yupToJsonSchema(
    availableUnitsbyAreaSchema
);

const GET_ALL_AVAILABLE_UNITS_BY_AREA = {
    name: "get_all_available_units_by_area",
    description: "This tool gets all available units by price range",
    category: "Sales Analysis",
    subcategory: "Performance Analysis",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: availableUnitsbyAreaJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ area }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;

            // localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=equals&filters[1][values][0]=3000
            //localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=6&filters[1][column]=units.unit_price&filters[1][operation]=between&filters[1][values][0]=3000&filters[1][values][1]=10000
            const query = new URLSearchParams({ area });

            if (area) {
                query.append("filters[1][column]", "units.unit_area");
                query.append("filters[1][operation]", "equals");
                query.append("filters[1][values][0]", area);
            }
            const { data } = await axios.get(
                `http://localhost:3001/units?filters[0][column]=units.unit_status_id&filters[0][operation]=equals&filters[0][values][0]=1&${query.toString()}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            console.log(data);
            const response = data.data.map((units) => {
                return {
                    // address: units.address_line_1,
                    // unitType: units.unit_type,
                    unitId: units.unit_id,
                    unitArea: units.unit_area,
                    block: units.block,
                    unitPrice: units.unit_price,
                    Address: units.address_line_1,
                    Locaton: units.unit_location,

                };
            });
            return response;
        } catch (err) {
            return "Error trying to execute the tool " + err;
        }
    },
};

// Update Deposit 
const updateDepositSchema = yup.object({
    depositId: yup.number().label("depositId"),
    status: yup.string().label("status"),
});

const updatedepositJSONSchema = yupToJsonSchema(updateDepositSchema);

const UPDATE_DEPOSITS = {
    name: "updatedeposit",
    description: "This tool updates deposits",
    category: "real_estate_management",
    subcategory: "deposits",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: updatedepositJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ depositId, status }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;
            const { data } = await axios.put(
                `http://localhost:3001/update-deposit/depositId/${depositId}/status/${status}`,
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );
            console.log(data);

            if (data.success === true) {
                return `Deposit ${depositId} has been ${status} successfully`;
            }
        } catch (err) {
            // Handle potential errors and return a meaningful message
            return "Error trying to execute the tool " + err;
        }
    },
};

const createProjectSchema = yup.object({
    organizationId: yup.number().required(),
    downPaymentPercentagePerUnit: yup.number().required(),
    iconUrl: yup.string().url().required(),
    isPublished: yup.boolean().required(),
    location: yup.string().required(),
    maxReservationDuration: yup.number().required(),
    maxReservationLimitPerRep: yup.number().required(),
    projectName: yup.string().required(),
    projectReferenceCode: yup.string().required(),
    videoUrl: yup.string().url().required(),
});

const createProjectJSONSchema = yupToJsonSchema(createProjectSchema);

const CREATE_PROJECT = {
    name: "create_project",
    description: "This tool creates a new project for an organization",
    category: "real_estate_management",
    subcategory: "projects",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [], // List any associated commands if applicable
    prerequisites: [], // List any prerequisites for your tool to run
    parameters: createProjectJSONSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
    runCmd: async ({ organizationId, downPaymentPercentagePerUnit, iconUrl, isPublished, location, maxReservationDuration, maxReservationLimitPerRep, projectName, projectReferenceCode, videoUrl }) => {
        try {
            auth_token = process.env.AUTH_TOKEN;
            const { data } = await axios.post(
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
                { headers: { Authorization: `Bearer ${auth_token}` } }
            );

            if (data && data.insertedProjectId) {
                return `Project ${projectName}  was created successfully with ID ${data.insertedProjectId}`;
            } else {
                // Handle potential errors and why the project was not created and return a meaningful message
                return "Failed to create project. No project ID returned.";
            }
        } catch (err) {
            // Handle potential errors and return a meaningful message
            return "Error trying to execute the tool: " + err.message;
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

            await contactNameSchema.validate({ contactName, organizationId });

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
                agent_name: contact.agent_name,
                email: contact.email,
                phoneNumber: contact.phone,
                birthDate: contact.birth_date,
            }));

            return contactDetails;
        } catch (error) {
            console.error("Error fetching contact details:", error);
            return `Error trying to execute the tool: ${error.message}`;
        }
    }
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
            const { data } = await axios.get(
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
const CONTRACTS_DETAIL_BY_AGENCYID = {
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
            return data;
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


// NEW TOOL: Create a new Accommodation
const createAccommodationSchema = yup.object({
    organizationId: yup.number().required(),
    contactId: yup.number().required(),
    numberOfPeople: yup.number().required(),
    checkInDate: yup.date().required(),
    checkOutDate: yup.date().required(),
    resortName: yup.string().max(100).required(),
    roomNumber: yup.string().max(50).required(),
    notes: yup.string().max(255).required(),
});

const createAccommodationJsonSchema = yupToJsonSchema(createAccommodationSchema);

const CREATE_ACCOMMODATION = {
    name: "create_accommodation",
    description: "Creates a new accommodation for a specific organization and contact",
    category: "Accommodation Management",
    subcategory: "create accommodation",
    functionType: "backend",
    dangerous: false,
    associatedCommands: [],
    prerequisites: [],
    parameters: createAccommodationJsonSchema,
    rerun: true,
    rerunWithDifferentParameters: true,
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
            const { data } = await axios.post(
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

            if (data && data.insertedAccommodationId) {
                return `Accommodation at ${resortName} was created successfully with ID ${data.insertedAccommodationId}`;
            } else {
                return "Failed to create accommodation. No accommodation ID returned.";
            }
        } catch (err) {
            return `Error trying to execute the tool: ${err.message}`;
        }
    },
};

//new tool: create contact
const createContactSchema = yup.object({
    organizationId: yup.number().required(),
    typeId: yup.number().required(),
    channelId: yup.number().required(),
    name: yup.string().max(100).required(),
    email: yup.string().max(100).required(),
    phone: yup.string().max(100).required(),
    countryId: yup.number().required(),
    birthDate: yup.date().required(),
    passportNumber: yup.string().max(100).required(),
    idNumber: yup.string().max(100).required(),
    agencyId: yup.number().required(),
    contactReferalSelectionRadio: yup.string().oneOf(["Direct", "Via Agency"]).required(),
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
    rerunWithDifferentParameters: true,
    runCmd: async ({
        organizationId,
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
        contactReferalSelectionRadio
    }) => {
        const TOKEN = process.env.TOKEN;
        try {
            const { data } = await axios.post(
                `http://localhost:3001/organizations/${organizationId}/contacts`,
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
                    contactReferalSelectionRadio,
                },
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            );

            if (data && data.insertedContactId) {
                return `Contact was created successfully with ID ${data.insertedContactId}`;
            } else {
                return "Failed to create contact. No contact ID returned.";
            }
        } catch (err) {
            return `Error trying to execute the tool: ${err.message}`;
        }
    },
};


const tools = [CREATE_PROJECT, UPDATE_DEPOSITS, GET_ALL_AVAILABLE_UNITS_BY_LOCATION, GET_ALL_AVAILABLE_UNITS_BY_AREA, GET_ALL_AVAILABLE_UNITS_BY_PRICERANGE, GET_ALL_PROJECTS_BY_LOCATION, GET_ALL_PROJECTS, REVENUE_RANGE_COMPARISON, REVENUE_COMPARISON, GET_AVAILABLE_UNIT_AND_BLOCKS_BY_PROJECT_NAME, GET_ALL_SOLD_UNITS_BY_DATE, GET_ALL_SOLD_UNITS_BY_PRICE, GET_ALL_SOLD_UNITS_BY_AREA, GET_ALL_SOLD_UNITS_BY_PRICERANGE, GET_RESERVATIONS_TO_SELL_OUT_RATIO, GET_ALL_UNITS, GET_ALL_RESERVATIONS, GET_ALL_DEPOSITS, GET_ALL_SOLD_UNITS, FILE_READER, PRODUCT_FINDER, WEATHER_FROM_LOCATION, GET_ALL_SOLD_UNITS_BY_PROJECT_NAME, GET_CONTACT_DETAILS_BY_NAME, GET_PROJECTS_DETAIL, UNITDETAIL_BY_UNITID,
    CONTRACTS_DETAIL_BY_AGENCYID, ACCOMMODATION_RESERVED_DETAIL_BY_CONTACT_ID, GET_CONTACTS,
    GET_ACCOMMODATION_DETAILS_BY_CHECKOUT, CREATE_CONTACT_NOTE,
    GET_REPRESENTATIVES, GET_ORGANIZATION_AGENCIES, GET_MAIN_AGENCIES, GET_CONTACT_NOTES,
    CREATE_PROJECT, CREATE_ACCOMMODATION];
    
module.exports = tools;









