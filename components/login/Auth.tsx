import { supabase } from "@/lib/supabase/supabase";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Auth() {
  // ✅ testwaarden als defaults
  const [email, setEmail] = useState("test@plantje.app");
  const [password, setPassword] = useState("test123");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert("Fout", error.message);
        return;
      }

      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inloggen</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@adres.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text style={styles.label}>Wachtwoord</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Wachtwoord"
        autoCapitalize="none"
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        onPress={signInWithEmail}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          loading && styles.buttonDisabled,
          pressed && !loading && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Bezig..." : "Inloggen"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
  },
  button: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "black",
  },
  buttonText: { color: "white", fontWeight: "700" },
  buttonDisabled: { opacity: 0.6 },
  buttonPressed: { opacity: 0.85 },
});
