import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";
import * as querystring from "querystring";

type BodyParams = {
  token: string
}

type LineIdtokenVerifyBody = {
  id_token: string
  client_id: string
}

// type LineRefreshTokenBody = {
//   grant_type: "refresh_token"
//   refresh_token: string
//   client_id: string
//   client_secret?: string
// }

type LineAccessTokenVerifyParams = {
  access_token: string
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // try {
  //   const bodyParams = req.body as BodyParams;
    // const body: LineIdtokenVerifyBody = {
    //   id_token: bodyParams.token,
    //   client_id: process.env.LINE_CHANNEL_ID || ''
    // };
    // console.log(`body: ${body}`);
    // const verifyResult = await axios.post(
    //   "https://api.line.me/oauth2/v2.1/verify",
    //   querystring.stringify(body),
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //   }
    // );

  try {
    const bodyParams = req.body as BodyParams;
    const params: LineAccessTokenVerifyParams = {
      access_token: bodyParams.token
    };
    const verifyResult = await axios.get(
      `https://api.line.me/oauth2/v2.1/verify?${querystring.stringify(params)}`
    );
    console.log(`verifyResult: ${JSON.stringify(verifyResult)}`);

    const profile = await axios.post(
      "https://api.line.me/v2/profile",
      {
        headers: {
          "Authorization": bodyParams.token
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