const express = require('express');
const app = express();
app.use(express.json());

const expressWs = require('express-ws')(app);
const wssWs = expressWs.getWss();

const PORT = !process.env || 4000;


app.ws('/', (ws, req) => {

    ws.on('message', (msg) => {
        const obj = JSON.parse(msg);
        if(obj.method === 'connection') {
            connectionHandler(ws, obj);
        } else {
            broadcastToUsers(ws, obj)
        }
    })
});

function connectionHandler(ws, msg) {
    ws.id = msg.id;
    broadcastToUsers(ws, msg);
}

function broadcastToUsers(ws, msg) {
    wssWs.clients.forEach(client => {
        if(client.id === ws.id) {
            client.send(JSON.stringify(msg));
        }
    })
}

app.listen(PORT, () => console.log(`Server started on Port- ${PORT}`));