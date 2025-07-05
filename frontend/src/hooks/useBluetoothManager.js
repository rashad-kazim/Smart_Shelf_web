// src/hooks/useBluetoothManager.js
import { useState } from "react";

// --- ATTENTION! ---
// These UUIDs MUST BE IDENTICAL to the Bluetooth service and characteristic
// definitions in your ESP32 firmware (Arduino/ESP-IDF code).
// These are just placeholders. Replace them with your actual UUIDs.
const ESP32_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const WIFI_CREDENTIALS_CHARACTERISTIC_UUID =
  "beb5483e-36e1-4688-b7f5-ea07361b26a8"; // Expectation: string in "ssid,password" format
const TOKEN_CHARACTERISTIC_UUID = "cba1d466-344c-4be3-ab3f-189f8ae924ab"; // Expectation: ESP32 token string
const IP_ADDRESS_CHARACTERISTIC_UUID = "5f2b8732-c509-4c3a-a5e3-4b7325a7e3d2"; // Expectation: Server IP address string

export const useBluetoothManager = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [error, setError] = useState(null);

  // Helper function to write data to ESP32 in the correct format
  const writeValueToCharacteristic = async (characteristic, value) => {
    const encoder = new TextEncoder("utf-8");
    await characteristic.writeValue(encoder.encode(value));
  };

  // Function to connect to a device
  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [ESP32_SERVICE_UUID] }],
        optionalServices: [ESP32_SERVICE_UUID],
      });
      const server = await device.gatt.connect();
      setConnectedDevice(server.device);
      return server;
    } catch (err) {
      console.error("Bluetooth connection error:", err);
      setError(err);
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to send all configuration to ESP32
  const sendConfiguration = async (
    server,
    { wifi_ssid, wifi_password, token, server_local_ip }
  ) => {
    if (!server?.connected) {
      setError("Not connected to any device.");
      return false;
    }
    setError(null);
    try {
      const service = await server.getPrimaryService(ESP32_SERVICE_UUID);

      // 1. Send WiFi Information
      const wifiCharacteristic = await service.getCharacteristic(
        WIFI_CREDENTIALS_CHARACTERISTIC_UUID
      );
      const wifiValue = `${wifi_ssid},${wifi_password}`;
      await writeValueToCharacteristic(wifiCharacteristic, wifiValue);

      // 2. Send Token Information
      const tokenCharacteristic = await service.getCharacteristic(
        TOKEN_CHARACTERISTIC_UUID
      );
      await writeValueToCharacteristic(tokenCharacteristic, token);

      // 3. Send Server IP Address (newly added)
      const ipCharacteristic = await service.getCharacteristic(
        IP_ADDRESS_CHARACTERISTIC_UUID
      );
      await writeValueToCharacteristic(ipCharacteristic, server_local_ip);

      return true; // Success
    } catch (err) {
      console.error("Failed to send configuration:", err);
      setError("Failed to send configuration to the device.");
      return false; // Failure
    }
  };

  // Function to disconnect
  const disconnect = () => {
    if (connectedDevice?.gatt?.connected) {
      connectedDevice.gatt.disconnect();
    }
    setConnectedDevice(null);
  };

  return {
    isConnecting,
    connectedDevice,
    error,
    connect,
    sendConfiguration,
    disconnect,
  };
};
