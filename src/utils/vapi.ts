import Vapi from "@vapi-ai/server-sdk";

export const vapi = new Vapi({
  apiKey: process.env.VAPI_API_KEY,  
});
