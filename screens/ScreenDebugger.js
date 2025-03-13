import React, { useEffect } from "react";

export default function DebugScreen({ navigation }) {
  useEffect(() => {
    console.log("🔹 Login Screen Mounted");  // Check if it mounts
  }, []);

  return (
    <SafeAreaView>
      <Text>Login Screen</Text>
    </SafeAreaView>
  );
}
