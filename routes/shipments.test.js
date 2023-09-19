"use strict";

const request = require("supertest");
const app = require("../app");

/**
 * test POST route "/shipments"
 */
describe("POST /", function () {
  /**
   * test to see if valid json data:
   * { productId, name, addr, zip }
   *  returns valid response: { shipped: shipId }
   *
   */
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  /**
   * test to see if empty request body will return
   * a 400 status code
   */
  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  /**
   * test to see if error occurs when a field
   * in the response body is invalid
   */
  test("throws error if JSON body is invalid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 900,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: ["instance.productId must be greater than or equal to 1000"],
        status: 400
      }
    });
  });

  /**
   * tests to if errors occur when multiple fields
   * have the wrong data types
   */
  test("throws error if JSON body has multiple wrong fields", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: true,
      addr: 100000,
      zip: {key: "123456789"},
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: ["instance.name is not of a type(s) string",
        "instance.addr is not of a type(s) string",
        "instance.zip is not of a type(s) string"],
        status: 400
      }
    });
  });

  /**
   * tests if a missing field will throw an "requires property" error
   */
  test("throws error if category is missing", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      addr: "100 Test St",
      zip:  "123456789",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: [
        "instance requires property \"name\""],
        status: 400
      }
    });
  });
});
