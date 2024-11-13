const mqtt = require("mqtt");
const WebSocket = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocket.Server({ port: process.env.WS_PORT });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established.");

  ws.on("message", (data) => console.log("Received from client:", data));
  ws.on("close", () => console.log("WebSocket connection closed."));
});

function connectToBroker() {
  const clientId = `client${Math.random().toString(36).slice(2, 7)}`;
  const hostURL = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;

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
    // Subscribe to both monitoring and actuator topics
    const topics = [process.env.MQTT_TOPIC, process.env.MQTT_ACTUATOR_TOPIC];
    topics.forEach((topic) => {
      client.subscribe(topic, { qos: 0 });
      console.log(`Subscribed to Topic: ${topic}`);
    });
  });

  client.on("message", (topic, message) => {
    // console.log(`Received Message: ${message} on topic: ${topic}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            topic,
            data: JSON.parse(message.toString()),
          })
        );
      }
    });
  });
}

connectToBroker();
