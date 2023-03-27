const request = require("supertest");
const { app } = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
    return seed(testData);
  });
  
  afterAll(() => {
    return db.end();
  });
  describe("GET /api/categories", () => {
    test("200: should return an array of all the category objects", () => {
      return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toBeInstanceOf(Array);
        body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
            );
          });
        });
    });
  });