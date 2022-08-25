// Write your tests here
const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

test('sanity', () => {
  expect(true).toBe(true)
})

describe("Tests", () => {

  beforeEach(async () => {
    await db("users").truncate();
  });

  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });
  
  //GET
  describe("Get", () => {
    test("Responds properly if missing token", async () => {
      let result = await request(server).get("/api/jokes");
      expect(result.body).toEqual({ message: "token required" });
    });
    test("Responds with jokes when proper token entered", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "jo", password: "1234" });
      let result = await request(server)
        .post("/api/auth/login")
        .send({ username: "jo", password: "1234" });
      result = await request(server)
        .get("/api/jokes")
        .set("Authorization", result.body.token);
      expect(result.body).toHaveLength(3);
    });
  });

  //REGISTER
  describe("Register", () => {
    test("Registers new user", async () => {
      let result = await request(server)
        .post("/api/auth/register")
        .send({ username: "jo", password: "1234" });
      expect(result.body).toMatchObject({ username: "jo", id: 1 });
    });
    test("Responds properly if username taken", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "jo", password: "1234" });
      let result = await request(server)
        .post("/api/auth/register")
        .send({ username: "jo", password: "1234" });
      expect(result.body).toEqual({ message: "username taken" });
    });
  });

  //LOGIN
  describe("Login", () => {
    test("Responds properly if invalid credentials", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "jo", password: "1234" });
      const result = await request(server)
        .post("/api/auth/login")
        .send({ username: "jo", password: "12345" });
      expect(result.body).toMatchObject({ message: "invalid credentials" });
    });
    test("Responds properly if missing username or password", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "jo", password: "1234" });
      const result = await request(server)
        .post("/api/auth/login")
        .send({ username: "jo" });
      expect(result.body).toMatchObject({
        message: "username and password required",
      });
    });
  });
});
