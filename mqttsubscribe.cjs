const mqtt = require("mqtt");
const WebSocket = require("ws");

var mqttClient;
const mqttHost = "broker.emqx.io";
const protocol = "mqtt";
const port = "1883";

// WebSocket server
const wss = new WebSocket.Server({ port: 8081 }); // WebSocket listens on port 8081

wss.on("connection", function connection(ws) {
  console.log("WebSocket connection established.");

  // Broadcast the MQTT data to all WebSocket clients
  ws.on("message", function message(data) {
    console.log("Received from client:", data);
  });

  // Handle WebSocket disconnection
  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);
  const hostURL = `${protocol}://${mqttHost}:${port}`;

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(hostURL, options);

  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected:" + clientId);
  });

  mqttClient.on("message", (topic, message, packet) => {
    const mqttData = message.toString();
    console.log("Received Message: " + mqttData + "\nOn topic: " + topic);

    // Send the MQTT data to WebSocket clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(mqttData); // Send data to all connected WebSocket clients
      }
    });
  });
}

function subscribeToTopic(topic) {
  console.log(`Subscribing to Topic: ${topic}`);
  mqttClient.subscribe(topic, { qos: 0 });
}

connectToBroker();
subscribeToTopic("herbalawu/monitoring");
