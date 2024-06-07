import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/pages";

export default function ScanBack() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      className="flex justify-center items-center z-20 mr-5"
      onPress={() => {
        navigation.navigate("Scan");
      }}
    >
      <Ionicons name="arrow-back" size={25} color="white" />
    </TouchableOpacity>
  );
}
