import { registerRootComponent } from "expo";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { focusManager } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import ScanScreen from "./screens/scan";
import SavedScreen from "./screens/saved";
import IngredientsScreen from "./screens/ingredients";

import type { RootStackParamList } from "./types/pages";

const Tabs = createBottomTabNavigator<RootStackParamList>();

const queryClient = new QueryClient();

export default function App() {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={DarkTheme}>
          <Tabs.Navigator
            screenOptions={{
              headerShown: false,
              tabBarLabelStyle: { marginBottom: 2 },
            }}
          >
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
            <Tabs.Screen
              name="Saved"
              component={SavedScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <MaterialIcons
                    name="bookmark"
                    size={24}
                    color={focused ? "#0068C8" : "white"}
                  />
                ),
              }}
            />
          </Tabs.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
      <Toast />
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
