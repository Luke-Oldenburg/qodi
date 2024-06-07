import { View, Text, ActivityIndicator } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/pages";

type Props = NativeStackScreenProps<RootStackParamList, "Loading">;

export default function LoadingScreen({ route, navigation }: Props) {
  const upc = route.params.code;

  useFocusEffect(
    useCallback(() => {
      fetch(`https://qodi.lukeo.hackclub.app/${upc}`)
        .then((r) => {
          if (!r.ok) {
            throw new Error("failed to fetch data");
          }
          return r.json();
        })
        .then((data) => {
          navigation.navigate("Ingredients", { data });
        })
        .catch((e) => {
          console.error(e);
          navigation.navigate("Scan");
        });
    }, [upc])
  );

  return (
    <View className="flex items-center justify-center h-full">
      <ActivityIndicator size="large" color="white" />
      <Text className="text-white text-2xl">
        Loading product with UPC code:
      </Text>
      <Text className="text-white text-2xl font-mono font-bold">{upc}</Text>
    </View>
  );
}
