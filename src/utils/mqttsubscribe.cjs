const mqtt = require("mqtt");
const WebSocket = require("ws");

const mqttHost = "broker.emqx.io";
const protocol = "mqtt";
const port = "1883";
const topic = "herbalawu/monitoring";

const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established.");

  ws.on("message", (data) => console.log("Received from client:", data));
  ws.on("close", () => console.log("WebSocket connection closed."));
});

function connectToBroker() {
  const clientId = `client${Math.random().toString(36).slice(2, 7)}`;
  const hostURL = `${protocol}://${mqttHost}:${port}`;

  const client = mqtt.connect(hostURL, {
    clientId,
    keepalive: 60,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  });

  client.on("error", (err) => {
    console.log("Error: ", err);
    client.end();
  });

  client.on("reconnect", () => console.log("Reconnecting..."));
  client.on("connect", () => {
    console.log("Client connected:", clientId);
    client.subscribe(topic, { qos: 0 });
    console.log(`Subscribed to Topic: ${topic}`);
  });

  client.on("message", (topic, message) => {
    console.log(`Received Message: ${message} on topic: ${topic}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
}

connectToBroker();
