import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { useRefreshOnFocus } from "@/util/useRefreshOnFocus";
import storage from "@/util/storage";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList } from "../types/pages";
import type { HealthResponse, InfoResponse } from "../types/backend";

type Props = BottomTabScreenProps<RootStackParamList, "Ingredients">;

export default function IngredientsScreen({ route, navigation }: Props) {
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

  const isSaved = useQuery({
    queryKey: ["isSaved", route.params.code],
    queryFn: async () => {
      return (await storage.getIdsForKey("saved")).includes(route.params.code);
    },
  });

  useRefreshOnFocus(async () => {
    info.refetch();
    health.refetch();
    isSaved.refetch();
  });

  if (!route.params.code) {
    navigation.navigate("Scan");
    return null;
  }

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
        <View className="flex flex-row justify-between items-start my-3 px-10">
          <Text className="text-white text-3xl font-bold pr-3">
            Ingredients for {info.data.name}{" "}
            {info.data.brand ? `by ${info.data.brand}` : ""}
          </Text>
          <TouchableOpacity
            onPress={async () => {
              if (isSaved.data == true) {
                storage.remove({
                  key: "saved",
                  id: route.params.code,
                });
                Toast.show({
                  type: "info",
                  text1: "Removed!",
                  text2: `Removed ${info.data.name} from your bookmarks`,
                });
                isSaved.refetch();
                return;
              } else {
                storage.save({
                  key: "saved",
                  id: route.params.code,
                  data: {
                    code: route.params.code,
                    name: info.data.name,
                    brand: info.data.brand,
                    ingredients: health.data,
                  },
                });
                Toast.show({
                  type: "success",
                  text1: "Saved!",
                  text2: `Saved ${info.data.name} to your bookmarks`,
                });
                isSaved.refetch();
              }
            }}
          >
            <MaterialIcons
              name="bookmark"
              size={40}
              color={isSaved.data == true ? "red" : "white"}
            />
          </TouchableOpacity>
        </View>
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
