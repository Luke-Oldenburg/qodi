import { View, Text, ScrollView } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/pages";

type Props = NativeStackScreenProps<RootStackParamList, "Ingredients">;

export default function IngredientsScreen({ route }: Props) {
  return (
    <View className="flex items-center justify-start h-full">
      <Text className="text-white text-4xl font-bold my-3 mx-5">
        Ingredients for {route.params.name}{" "}
        {route.params.brand ? `by ${route.params.brand}` : ""}
      </Text>
      <ScrollView
        className="flex w-full gap-5 my-3"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {route.params.data.map((ingredient) => (
          <View
            key={ingredient.ingredient}
            className="flex justify-start items-start rounded-md bg-green-800 w-4/5 p-3"
          >
            <Text className="text-white text-2xl font-bold">
              {ingredient.display_name}
            </Text>
            <Text className="text-white text-lg">{ingredient.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
