const { app } = require("./src/routers/routers");

app.listen(5001, () => {
    console.log("listening on port 5001");
});