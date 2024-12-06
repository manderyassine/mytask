const express = require('express');
const app = express();
const port = 9000;

app.use(express.static('.'));

app.listen(port, () => {
    console.log(`News app running at http://localhost:${port}`);
});
