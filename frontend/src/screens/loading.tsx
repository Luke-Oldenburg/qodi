import { View, Text } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../pages";

type Props = NativeStackScreenProps<RootStackParamList, "Loading">;

export default function LoadingScreen({ route }: Props) {
  return (
    <View className="flex items-center justify-center h-full">
      <Text className="text-white text-2xl">
        Loading product with UPC code:
      </Text>
      <Text className="text-white text-2xl font-mono font-bold">
        {route.params.code}
      </Text>
    </View>
  );
}
