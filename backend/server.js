import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
connectDB();
// Database connection

// API routes
app.use("/api/users", userRoutes);
// API routes


app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 6001;
app.listen(port, () => console.log(`Server running in ${port}`));