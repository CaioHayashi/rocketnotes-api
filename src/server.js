require("express-async-errors");
require("dotenv/config");

const migrationsRun = require(".//database/sqlite/migrations");
const cors = require('cors')
const express = require("express");
const AppError = require("./utils/AppError");
const routes = require("./routes");
const uploadConfig = require('./configs/upload')

const app = express();
app.use(cors())
app.use(express.json());

app.use(routes);
migrationsRun();

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use((error, request, response, next) => {
	if (error instanceof AppError) {
		return response.status(error.statusCode).json({
			status: "error",
			message: error.message
		});
	}

    console.error(error)

	return response.status(500).json({
		status: "error",
		message: "Internal server error"
	});
});

const port = process.env.SERVER_PORT || 3333;
app.listen(port, () => console.log(`Server is running on port ${port}`));
