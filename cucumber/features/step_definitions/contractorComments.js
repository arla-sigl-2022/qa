const assert = require("assert");
const fetch = require("node-fetch");
const { config } = require("dotenv");
const { Given, When, Then } = require("@cucumber/cucumber");

config();

const apiCredentials = {
  client_id: process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  grant_type: "client_credentials",
};

async function getAuthToken() {
  const response = await fetch(process.env.AUTH0_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiCredentials),
  });
  const {access_token} = await response.json();
  return access_token;
}

Given("a contractor {string}, {int} and {int}", (contractor, page, limit) => {
  this.page = page;
  this.limit = limit;
  this.contractor = contractor;
});

When("a user calls contractor comment API", async () => {
  const jwtToken = await getAuthToken();
  const body = { contractor: this.contractor };
  const response = await fetch(
    `${process.env.API_URL}/v1/contractor/comment?page=${this.page}&limit=${this.limit}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const json = await response.json();
  this.apiResponse = json;
});

Then("the user should recieve {int}", (expectednumberOfComments) => {
  if (this.apiResponse) {
    const comments = this.apiResponse.comments;
    assert.strictEqual(comments.length, expectednumberOfComments);
  } else {
    assert.fail("no API response!");
  }
});
