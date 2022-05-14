import express from "express";
import cors from "cors";

export const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

export const server = app.listen(PORT, () => console.log(`Server on port ${PORT}`));
