"use strict";

const fetchMock = require("fetch-mock");

const {
  shipProduct,
  SHIPIT_SHIP_URL
} = require("./shipItApi");


test("shipProduct", async function () {
  fetchMock.post(`${SHIPIT_SHIP_URL}`, {
    receipt: {
      shipId: 1
    },
    status: 200
  });

  const shipId = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  expect(shipId).toEqual(expect.any(Number));
});
