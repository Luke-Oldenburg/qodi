import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { MaterialIcons } from "@expo/vector-icons";

import storage from "@/util/storage";
import { useRefreshOnFocus } from "@/util/useRefreshOnFocus";

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList } from "../types/pages";

type Props = BottomTabScreenProps<RootStackParamList, "Saved">;

export default function SavedScreen({ navigation }: Props) {
  const savedProducts = useQuery({
    queryKey: ["savedList"],
    queryFn: async () => {
      const savedCodes = await storage.getAllDataForKey("saved");
      return savedCodes;
    },
  });

  useRefreshOnFocus(async () => {
    savedProducts.refetch();
  });

  if (savedProducts.isError) {
    return (
      <SafeAreaView className="flex relative h-full w-screen justify-start items-center bg-black">
        <Text className="text-3xl text-white">
          Error loading saved products
        </Text>
      </SafeAreaView>
    );
  }

  if (savedProducts.isLoading) {
    return (
      <SafeAreaView className="flex relative h-full w-screen justify-start items-center bg-black">
        <Text className="text-3xl text-white">Loading saved products...</Text>
      </SafeAreaView>
    );
  }

  if (!savedProducts.data || savedProducts.data.length === 0) {
    return (
      <SafeAreaView className="flex relative h-full w-screen justify-start items-center bg-black">
        <Text className="text-3xl text-white">No saved products</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex relative h-full w-screen justify-start items-center bg-black">
      <Text className="text-3xl text-white">Saved Products</Text>
      <ScrollView
        className="flex w-full gap-5 my-3"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {savedProducts.data.map((product) => (
          <TouchableOpacity
            key={product.code}
            className="flex flex-row justify-between items-start rounded-md bg-green-800 w-4/5 p-3"
            onPress={() => {
              navigation.navigate("Ingredients", { code: product.code });
            }}
          >
            <Text className="text-white text-2xl">{product.name}</Text>
            <TouchableOpacity
              onPress={() => {
                storage.remove({
                  key: "saved",
                  id: product.code,
                });
                savedProducts.refetch();
              }}
            >
              <MaterialIcons name="delete" size={30} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
