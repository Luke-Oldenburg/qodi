import { useState } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/pages";

type Props = NativeStackScreenProps<RootStackParamList, "Scan">;

export default function ScanScreen({ navigation }: Props) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [code, setCode] = useState<string>("");

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          Qodi needs your permission to show the camera.
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (code) {
    const upcCode = code;
    setCode("");
    navigation.navigate("Loading", { code: upcCode });
  }

  return (
    <View className="flex relative h-full w-screen justify-end items-center bg-black">
      <CameraView
        facing={facing}
        className="flex w-screen"
        barcodeScannerSettings={{
          barcodeTypes: ["upc_a", "ean13"],
        }}
        onBarcodeScanned={(data) => {
          setCode(`0${data.data}`);
        }}
      >
        <View className="h-full w-screen" />
      </CameraView>
      <View className="absolute bottom-3 flex flex-row justify-evenly py-2 px-5 items-center mx-5 bg-black rounded-full">
        <TouchableOpacity
          className="flex justify-center items-center z-20 mr-5"
          onPress={toggleCameraFacing}
        >
          <MaterialIcons name="flip-camera-ios" size={30} color="white" />
        </TouchableOpacity>
        <Text className="justify-self-end text-white text-lg text-center flex-shrink">
          Scan any UPC-A or EAN-13 barcode to get started!
        </Text>
      </View>
    </View>
  );
}
