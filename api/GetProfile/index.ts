import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";
import * as querystring from "querystring";

type BodyParams = {
  token: string
}

type LineVerifyBody = {
  id_token: string
  client_id: string
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // context.log('HTTP trigger function processed a request.');
    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };

  try {
    const bodyParams = req.body as BodyParams;
    const body: LineVerifyBody = {
      id_token: bodyParams.token,
      client_id: process.env.LINE_CHANNEL_ID || ''
    };
    // const formData = new FormData();
    // formData.append('id_token', bodyParams.token);
    // formData.append('client_id', process.env.LINE_CHANNEL_ID || '');
    console.log(`body: ${body}`);
    const response = await axios.post(
      "https://api.line.me/oauth2/v2.1/verify",
      querystring.stringify(body),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    );
    context.res = {
      status: 200,
      body: response.data
    }
  } catch (e) {
    console.log(e);
    context.res = {
      status: 500,
      body: e
    }
  }
};

export default httpTrigger;