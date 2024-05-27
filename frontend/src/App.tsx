import { registerRootComponent } from "expo";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScanScreen from "./screens/scan";
import LoadingScreen from "./screens/loading";

import type { RootStackParamList } from "./pages";

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
          }}
        />
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
