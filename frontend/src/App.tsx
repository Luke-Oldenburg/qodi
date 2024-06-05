import { registerRootComponent } from "expo";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScanScreen from "./screens/scan";
import LoadingScreen from "./screens/loading";
import IngredientsScreen from "./screens/ingredients";

import ScanBack from "./components/scan-back";

import type { RootStackParamList } from "./types/pages";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            title: "Scan a barcode",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{
            title: "Loading product",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Ingredients"
          component={IngredientsScreen}
          options={{
            headerLeft: () => <ScanBack />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
