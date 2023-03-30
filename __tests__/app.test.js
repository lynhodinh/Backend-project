const request = require("supertest");
const { app } = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const toBeSortedBy = require("jest-sorted");

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
        expect(body.categories).toHaveLength(4);
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
describe("Testing SAD path", () => {
  test("404: returns an error message for non-specified routes", () => {
    return request(app)
      .get("/api/categoriesssss")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Route does not exist");
      });
  });
});
describe("GET /api/reviews/:review_id", () => {
  test("200: Will return an object corresponding to the review ID with all info", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
        });
      });
  });
  test("404: responds with an error message for valid but non existent review_ids", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Review ID not found");
      });
  });

  test("400: responds with an error message when passed a bad user ID", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "We were unable to process your request as it appears to be invalid. Please check your spelling and try again"
        );
      });
  });
});
describe("GET /api/reviews", () => {
  test("200: should return an array of all the review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(13);
        body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("200: the reviews should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/reviews/:review_id/comments", () => {
  test("200: should return an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(3);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });
  test("200: comments should be served with the most recent comments first", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should respond with an empty array if the review ID is valid, but the review has no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("404: Returns a review ID not found error message for valid but non existent review_ids", () => {
    return request(app)
      .get("/api/reviews/9999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("ID not found");
      });
  });
  test("400: Returns a bad request error message if given a wrongly formated review_id", () => {
    return request(app)
      .get("/api/reviews/wrong-input/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "We were unable to process your request as it appears to be invalid. Please check your spelling and try again"
        );
      });
  });
});
describe("POST /api/reviews/:review_id/comments", () => {
  test("201: Correctly posts a comment object under the specified review_id", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({
        username: "bainesface",
        body: "Testing comment.",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          body: "Testing comment.",
          votes: 0,
          author: "bainesface",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("201: ignore any extra, unnecessary properties on the input object.", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({
        username: "bainesface",
        body: "Test comment.",
        extraProp: "This property should be ignored.",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).not.toHaveProperty("extraProp");
      });
  });
  test("400: if input for review_id in path is formatted incorrectly", () => {
    return request(app)
      .post("/api/reviews/notanumber/comments")
      .send({
        username: "bainesface",
        body: "Testing comment.",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "We were unable to process your request as it appears to be invalid. Please check your spelling and try again"
        );
      });
  });
  test("404: if review_id is in the correct format but does not exist", () => {
    return request(app)
      .post("/api/reviews/28/comments")
      .send({
        username: "bainesface",
        body: "Testing comment.",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("ID not found");
      });
  });
  test("400: if body does not have a comment it will inform them to add one", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({
        username: "bainesface",
        body: "",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Please post a comment");
      });
  });
  test("POST responds with 404 if username doesn't exist", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({
        username: "fakeuser",
        body: "Testing comment.",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Username not found");
      });
  });
});
describe("PATCH /api/reviews/:review_id (votes)", () => {
  test("200: should respond with the corresponding review object with the vote property value increased", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedVote).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 2,
        });
      });
  });
  test("200: should respond with the corresponding review object with the vote property value decreased", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedVote).toMatchObject({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: -99,
        });
      });
  });
  test("404: Returns a review ID not found error message for valid but non existent review_ids", () => {
    return request(app)
      .patch("/api/reviews/666")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("ID not found");
      });
  });
  test("400: Returns a bad request error message if given a wrongly formated review_id", () => {
    return request(app)
      .patch("/api/reviews/wronginput")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "We were unable to process your request as it appears to be invalid. Please check your spelling and try again"
        );
      });
  });
  test("400: if a if the input value of inc_votes is in the incorrect format", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({
        inc_votes: "wrong input",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "We were unable to process your request as it appears to be invalid. Please check your spelling and try again"
        );
      });
  });
});
