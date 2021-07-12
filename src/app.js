import express from "express";
import cors from "cors";
import connection from "./database.js";
import joi from "joi";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/items", async (req, res) => {
    try {
        const items = await connection.query(`
            SELECT * FROM shopplist
        `);

        return res.send(items.rows);
    } catch (e) {
        console.log(e.message);
        return res.sendStatus(500);
    }
});

app.post("/items", async (req, res) => {
    try {
        const itemSchema = joi.object({
            text: joi.string().min(1).trim().required()
        });

        const itemValidation = await itemSchema.validateAsync(req.body);    

        const { text } = req.body;

        await connection.query(`
            INSERT INTO shopplist
            (text) VALUES ($1)
        `, [text]);

        return res.sendStatus(200);
    } catch (e) {
        if (e.message.includes("text")) {
            return res.sendStatus(400);
        }
        console.log(e.message);
        return res.sendStatus(500);
    }
});

export default app;
