## Getting Started:

This repository hosts a nodejs - Express applications, designed to execute various server-side tools and add them to CMND.ai dynamically based on requests. It allows users to query tool information and run specific tools by passing parameters.

1. Clone the repository:

```bash
git clone git@github.com:CyprusCodes/cmnd-extension-sample-nodejs.git
```

2. Navigate to the cloned directory:

```bash
cd cmnd-extension-sample-nodejs
```

3. Install the node modules

```bash
npm install
```

4. Navigate to the tools file

5. Within the tools.js, create your tool definition by specifying its name, description, parameters, and the runCmd, which is the function itself, below is an example of function definition.

```js
require("dotenv").config();
const axios = require("axios"); // Only for external API calls
const yup = require("yup");
const yupToJsonSchema = require("./yupToJsonSchema");

const yourSchema = yup.object({
  // Define your validation schema here Use yup methods to define validation rules for each parameter
  // Example:
  // parameter1: yup.string().required(),
  // parameter2: yup.number().positive(),
});

const yourJSONSchema = yupToJsonSchema(yourSchema);

const YOUR_TOOL_NAME = {
  name: "your_tool_name",
  description: "Describe what your tool does and how it works here", // Describe functionality
  category: "your_category", // Choose a relevant category
  subcategory: "your_subcategory", // Specify a subcategory if applicable
  functionType: "your_function_type", // Specify backend or frontend
  dangerous: false, // Set to true if user confirmation is required
  associatedCommands: [], // List any associated commands (if any)
  prerequisites: [], // List any prerequisites for your tool to run
  parameters: yourJSONSchema,
  rerun: true, // Set to false if rerun is not allowed
  rerunWithDifferentParameters: true, // Set to false if different parameters are not allowed
  runCmd: async (
    {
      /* your parameter names here */
    }
  ) => {
    try {
      // Implement your tool's logic here:

      const data = await axios.get(/* url based on parameters */);
      return JSON.stringify(data);
    } catch (err) {
      // Handle potential errors and return a meaningful message
      return "Error trying to execute the tool";
    }
  },
};

// Add your tool object to the tools array (assuming it exists)
const tools = [YOUR_TOOL_NAME, YOUR_OTHER_TOOL_NAME];
module.exports = tools; // Export the tool object
```

6. Run your app (server):

```bash
npm start
```

7. Any API keys required for your tools should be stored in your .env file.

Therefore, you will not need to modify the index.js in any case. Instead, you will only make changes to the tools.js file, where you will initially add your tool's schema definition, implement the tool, and finally configure the tool settings.

## Run Your Server Publicly using ngrok

1. Create an ngrok account and set up ngrok on your personal computer. [ngrok accounts and setup](https://ngrok.com/docs/getting-started/?os=macos)
2. After setting ngrok on you computer, run the server

```bash
npm start
```

3. Now your app is runing on localhost, if you want to run it on public URL, you can run the below command in your terminal, but make sure the port of your app specified in your index.js or .env is the same as the port used by ngrok in your command

```bash
ngrok http 8000
```

✅ And DONE! Your server is successfully redirected to from the url you get on your terminal.
You can open the tools.js file in your code editor and investigate the tools and make further changes if necessary.
