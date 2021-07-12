import supertest from "supertest";
import app from "../src/app";
import connection from "../src/database";

beforeEach(async () => {
    await connection.query(`DELETE FROM shopplist`);
    await connection.query(`
        INSERT INTO shopplist
        (text) VALUES ('Teste')
    `);
});

afterAll(async () => {
    connection.end();
});

describe("GET /items", () => {
    it("returns object list for valid params", async () => {
        const result = await supertest(app).get("/items");

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    text: expect.any(String),
                })
            ])
        );
    });
});

describe("POST /items", () => {
    it("returns status 400 for invalid body", async () => {
        const body = { bla: "blabla" };

        const result = await supertest(app).post("/items").send(body);

        expect(result.status).toEqual(400);
    });

    it("returns status 400 for empty body", async () => {
        const body = { text: "" };

        const result = await supertest(app).post("/items").send(body);

        expect(result.status).toEqual(400);
    });

    it("returns status 200 for valid params", async () => {
        const body = { text: "Teste" };

        const result = await supertest(app).post("/items").send(body);

        expect(result.status).toEqual(200);
    });
});