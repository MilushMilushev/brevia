const express = require('express');
const PORT = process.env.PORT || 443

const app = express();
app.use(express.json())
app.post('*', async (req, res) => {
    res.send('Hello post')
    console.debug('req', req.body)
});

app.get('*', async (req, res) => {
    res.send('Hello get')
});

app.listen(PORT, function(err) {
    if(err) console.error(err);
    console.debug('Server listening on PORT: ', PORT)
});

//`https://api.telegram.org/bot${TOKEN}/${method}`