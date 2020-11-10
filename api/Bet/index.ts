import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";
import * as querystring from "querystring";
import { CosmosClient, SqlQuerySpec } from "@azure/cosmos";
import { GameManager, GlobalResult, LineUser, PlayerResult, Color } from "../core/GameManager";

type HttpRequestBetBody = {
  token: string
  selectedColor: Color
};

type HttpRequestBetParams = {
  stageId: string
};

type LineAccessTokenVerifyParams = {
  access_token: string
};

type LineProfile = {
  displayName: string
  userId: string
  pictureUrl: string
  statusMessage: string
};

interface HttpRequestBet extends HttpRequest {
  body: HttpRequestBetBody
  params: HttpRequestBetParams
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequestBet): Promise<void> {
  // Validate parameters and request body
  if (!req.body) {
    context.res = {
      status: 400,
      body: "Request body is missing"
    }
    return;
  }

  if (!req.body.token) {
    context.res = {
      status: 400,
      body: "Access token is missing"
    };
    return;
  }

  if (!req.body.selectedColor || !GameManager.validColorType(req.body.selectedColor)) {
    context.res = {
      status: 400,
      body: "Selected color is missing or invalid"
    }
    return;
  }

  const params: LineAccessTokenVerifyParams = {
    access_token: req.body.token,
  };

  // Get LINE user ID
  let lineUser: LineUser;
  try {
    const verifyResult = await axios.get(
      `https://api.line.me/oauth2/v2.1/verify?${querystring.stringify(params)}`
    );
    const profileResponse = await axios.get(
      "https://api.line.me/v2/profile",
      {
        headers: {
          "Authorization": `Bearer ${params.access_token}`
        }
      }
    );

    const lineProfile: LineProfile = profileResponse.data;
    lineUser = {
      id: lineProfile.userId
    };
  } catch (e) {
    context.res = {
      status: 400,
      body: "Access token is invalid or expired"
    };
    return;
  }

  // Get last player's result
  const cosmosDbConnectionString = process.env.COSMOS_DB_CONNECTION_STRING;
  const cosmosDbClient = new CosmosClient(cosmosDbConnectionString);
  const { database } = await cosmosDbClient.databases.createIfNotExists({ id: process.env.COSMOS_DB_DATABASE_ID });
  const { container } = await database.containers.createIfNotExists({ id: process.env.COSMOS_DB_CONTAINER_ID_PLAYER_RESULTS });

  const querySpec: SqlQuerySpec = {
    query: "SELECT * FROM c WHERE c.lineUser.id = @lineUserId ORDER BY c._ts DESC OFFSET 0 LIMIT 1",
    parameters: [
      {
        name: "@lineUserId",
        value: lineUser.id
      }
    ]
  };
  const { resources: playerResults } = await container.items.query(querySpec).fetchAll();
  const lastPlayerResult: PlayerResult = playerResults[0];
  console.log(lastPlayerResult);

  const lastGlobalResult: GlobalResult = context.bindings.lastGlobalResult[0];

  // Judge
  let matched = false;
  let winStreakCount = 0;
  if (lastGlobalResult && lastGlobalResult.selectedColor == req.body.selectedColor) {
    matched = true;
    winStreakCount = ++lastPlayerResult.winStreakCount;
  }

  const playerResult: PlayerResult = {
    lineUser,
    selectedColor: req.body.selectedColor,
    previousColor: lastGlobalResult ? lastGlobalResult.selectedColor : null,
    matched,
    winStreakCount
  };

  const globalResult: GlobalResult = {
    stage: {
      id: req.params.stageId
    },
    selectedColor: req.body.selectedColor,
    previousColor: lastGlobalResult ? lastGlobalResult.selectedColor : null,
    matched
  };

  // Save player's result
  const { resource: savedPlayerResult } = await container.items.create(playerResult);
  console.log(savedPlayerResult);

  // Save global result
  context.bindings.globalResultsOut = globalResult;

  // Return the result
  context.res = {
    status: 201,
    body: playerResult
  };

};

export default httpTrigger;