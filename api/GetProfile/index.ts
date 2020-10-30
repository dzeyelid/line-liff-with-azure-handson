import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";
import * as querystring from "querystring";

type BodyParams = {
  token: string
}

type LineAccessTokenVerifyParams = {
  access_token: string
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const bodyParams = req.body as BodyParams;
    const params: LineAccessTokenVerifyParams = {
      access_token: bodyParams.token
    };
    const verifyResult = await axios.get(
      `https://api.line.me/oauth2/v2.1/verify?${querystring.stringify(params)}`
    );
    const profile = await axios.get(
      "https://api.line.me/v2/profile",
      {
        headers: {
          "Authorization": `Bearer ${bodyParams.token}`
        }
      }
    )
    context.res = {
      status: 200,
      body: profile.data
    }
  } catch (e) {
    context.res = {
      status: 500,
      body: JSON.stringify(e)
    }
    return;
  }
};

export default httpTrigger;