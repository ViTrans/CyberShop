const app = require("./src/app");

const PORT = process.env.PORT || 3000;

const sever = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  sever.close();
  console.log("Server is closed");
  process.exit(0);
});
