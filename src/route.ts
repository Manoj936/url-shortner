import { redirect_url, shorten_url } from "./urlcontroller";

const express =  require('express')
const appRouter = express();

// Generate tiny url
appRouter.post("/get-shortened-url", shorten_url);

// Redirect Back to the original url
appRouter.get("/redirect-url" , redirect_url);

export default appRouter;
