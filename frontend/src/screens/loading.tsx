import { View, Text, ActivityIndicator } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/pages";

type Props = NativeStackScreenProps<RootStackParamList, "Loading">;

export default function LoadingScreen({ route, navigation }: Props) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");

  const upc = route.params.code;

  useFocusEffect(
    useCallback(() => {
      let productName: string;
      let productBrand: string;

      let metadataPromise = fetch(`https://qodi.lukeo.hackclub.app/info/${upc}`)
        .then((r) => {
          if (!r.ok) {
            throw new Error("failed to fetch data");
          }
          return r.json();
        })
        .then((data) => {
          productName = data.name.trim();
          productBrand = data.brand.trim();

          function toTitleCase(str: string) {
            return str.replace(/\w\S*/g, (txt) => {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
          }

          productName = toTitleCase(productName);
          productBrand = toTitleCase(productBrand);

          setName(productName);
          setBrand(productBrand);
        });

      fetch(`https://qodi.lukeo.hackclub.app/health/${upc}`)
        .then((r) => {
          if (!r.ok) {
            throw new Error("failed to fetch data");
          }
          return r.json();
        })
        .then((data) => {
          metadataPromise.then(() => {
            navigation.navigate("Ingredients", {
              data,
              name: productName,
              brand: productBrand,
            });
          });
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
      <Text className="text-white text-2xl mx-5">
        Loading product with {name ? `name ${name}` : `UPC code ${upc}`}{" "}
        {brand ? `and brand ${brand}` : ""}
      </Text>
    </View>
  );
}
