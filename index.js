const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const yup = require("yup");
const yupToJsonSchema = require("./yupToJsonSchema");
const tools = require("./tools");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.json());

// Example route to verify server is running
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

// Route to get information about available tools
app.get("/cmnd-tools", (req, res) => {
  const toolsResponse = tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    jsonSchema: tool.parameters,
    isDangerous: tool.dangerous,
    functionType: tool.functionType,
    rerun: tool.rerun,
    rerunWithDifferentParameters: tool.rerunWithDifferentParameters,
  }));
  res.json({ tools: toolsResponse });
});

// Route to execute a specific tool
app.post("/run-cmnd-tool", async (req, res) => {
  const { toolName, props } = req.body;
  const toolToRun = tools.find((tool) => tool.name === toolName);
  if (!toolToRun) {
    return res.status(404).json({ error: "Tool not found" });
  }

  try {
    const results = await toolToRun.runCmd(props);
    res.send(results);
  } catch (error) {
    console.error(`Error running tool '${toolName}':`, error);
    res.status(500).json({ error: `Error running tool '${toolName}'` });
  }
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on PORT http://localhost:${PORT}`)
);

module.exports = app; // Export the app instance for testing or other uses
