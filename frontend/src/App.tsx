import { registerRootComponent } from "expo";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import ScanScreen from "./screens/scan";
import IngredientsScreen from "./screens/ingredients";

import type { RootStackParamList } from "./types/pages";

const Tabs = createBottomTabNavigator<RootStackParamList>();

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={DarkTheme}>
          <Tabs.Navigator screenOptions={{ headerShown: false }}>
            <Tabs.Screen
              name="Scan"
              component={ScanScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <MaterialIcons
                    name="camera"
                    size={24}
                    color={focused ? "#0068C8" : "white"}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Ingredients"
              component={IngredientsScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <MaterialIcons
                    name="info"
                    size={24}
                    color={focused ? "#0068C8" : "white"}
                  />
                ),
              }}
            />
          </Tabs.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
