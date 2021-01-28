
const app = require('./app');
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Validator API online at port: ${port}`);
});