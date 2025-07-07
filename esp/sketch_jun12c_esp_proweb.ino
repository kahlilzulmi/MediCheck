#include <BluetoothSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define BLUETOOTH_NAME "Medicheck v1"
#define ONE_WIRE_BUS 2 // Data pin for DS18B20 sensor

BluetoothSerial SerialBT;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  SerialBT.begin(BLUETOOTH_NAME); // Bluetooth device name
  Serial.println("Bluetooth Device is ready to pair!");

  sensors.begin();
}

void loop() {
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);

  if (temperatureC == DEVICE_DISCONNECTED_C) {
    Serial.println("Error: Could not read temperature data");
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperatureC);
    Serial.println(" °C");

    SerialBT.print(temperatureC);
    SerialBT.println();
  }

  delay(2000);
}
