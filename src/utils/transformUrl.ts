import { URLTransformer } from "@algont/m7-url-transformer";
import { developmentDomain } from "constants/config";

const transformer = new URLTransformer({
    developmentDomain: developmentDomain,
    nodeEnv: process.env.NODE_ENV,
});

export const transformUrl = (url: string) => transformer.transform(url);
