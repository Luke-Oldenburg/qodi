import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../pages";

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
    <View className="flex h-full w-screen justify-evenly items-center bg-black">
      <CameraView
        facing={facing}
        className="flex w-screen"
        barcodeScannerSettings={{
          barcodeTypes: ["upc_a", "upc_e"],
        }}
        onBarcodeScanned={(data) => {
          setCode(data.data);
        }}
      >
        <View className="h-5/6 w-screen" />
      </CameraView>
      <TouchableOpacity
        className="h-10 w-2/3 rounded-md flex justify-center items-center z-20 bg-orange-500"
        onPress={toggleCameraFacing}
      >
        <Text className="text-3xl">Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}
