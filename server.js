const express = require("express");
const cors = require("cors");
const { appRoutes } = require("./Routes/routes");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", appRoutes);

app.listen(process.env.PORT || port, () =>
  console.log(`Server is listening on port: ${port}`)
);
