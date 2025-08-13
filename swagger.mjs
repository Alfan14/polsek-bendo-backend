import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Polsek Bendo API Docs",
      version: "1.0.0",
      description: "API documentation backend Polsek Bendo",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/api/*.mjs"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
