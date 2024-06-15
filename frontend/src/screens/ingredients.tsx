import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList } from "../types/pages";
import type { HealthResponse, InfoResponse } from "../types/backend";

type Props = BottomTabScreenProps<RootStackParamList, "Ingredients">;

export default function IngredientsScreen({ route }: Props) {
  const info = useQuery({
    queryKey: ["info", route.params.code],
    queryFn: async ({ queryKey }): Promise<InfoResponse> => {
      const res = await fetch(
        `https://qodi.lukeo.hackclub.app/info/${queryKey[1]}`
      );
      if (!res.ok) {
        throw new Error("failed to fetch data");
      }
      return res.json();
    },
  });

  const health = useQuery({
    queryKey: ["health", route.params.code],
    queryFn: async ({ queryKey }): Promise<HealthResponse> => {
      const res = await fetch(
        `https://qodi.lukeo.hackclub.app/health/${queryKey[1]}`
      );
      if (!res.ok) {
        throw new Error("failed to fetch data");
      }
      return res.json();
    },
  });

  if (info.isError || health.isError) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text className="text-white text-2xl mx-5">
          Failed to load product with UPC code {route.params.code}
        </Text>
      </View>
    );
  }

  if (info.isLoading) {
    return (
      <View className="flex items-center justify-center h-full">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white text-2xl mx-5">
          Loading product with UPC code {route.params.code}
        </Text>
      </View>
    );
  }

  if (!health.isSuccess && info.isSuccess) {
    return (
      <View className="flex items-center justify-center h-full">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white text-2xl mx-5">
          Loading product "{info.data.name}" from brand "{info.data.brand}"
        </Text>
      </View>
    );
  }

  if (health.isSuccess && info.isSuccess) {
    return (
      <SafeAreaView className="flex items-center justify-start h-full">
        <Text className="text-white text-4xl font-bold my-3 mx-5">
          Ingredients for {info.data.name}{" "}
          {info.data.brand ? `by ${info.data.brand}` : ""}
        </Text>
        <ScrollView
          className="flex w-full gap-5 my-3"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {health.data.map((ingredient) => (
            <View
              key={ingredient.ingredient}
              className="flex justify-start items-start rounded-md bg-green-800 w-4/5 p-3"
            >
              <Text className="text-white text-2xl font-bold">
                {ingredient.display_name}
              </Text>
              <Text className="text-white text-lg">
                {ingredient.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
