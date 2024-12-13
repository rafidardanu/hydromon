const mqtt = require("mqtt");
const WebSocket = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocket.Server({ port: process.env.WS_PORT });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established.");

  ws.on("message", (data) => {
    console.log("Received from client:", data);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
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
    console.error("MQTT Error:", err);
    client.end();
  });

  client.on("reconnect", () => {
    console.log("Reconnecting to MQTT broker...");
  });

  client.on("connect", () => {
    console.log(`Client connected to MQTT broker: ${hostURL} as ${clientId}`);

    const topics = [process.env.MQTT_MONITORING, process.env.MQTT_ACTUATOR];
    topics.forEach((topic) => {
      client.subscribe(topic, { qos: 0 }, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic ${topic}:`, err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });
  });

  client.on("message", (topic, message) => {
    // console.log(`Received message on topic ${topic}:`, message.toString());

    wss.clients.forEach((wsClient) => {
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(
          JSON.stringify({
            topic,
            data: JSON.parse(message.toString()),
          })
        );
      }
    });
  });

client.on("close", (err) => {
  console.error("MQTT connection closed:", err || "No error");
});

}

connectToBroker();
