import { redirectUrl , shorten_url } from "./urlcontroller";

const express =  require('express')
const appRouter = express();

// Generate tiny url
appRouter.post("/get-shortened-url", shorten_url);

// Redirect Back to the original url
appRouter.get("/redirect-url/:shortId" , redirectUrl);

export default appRouter;
