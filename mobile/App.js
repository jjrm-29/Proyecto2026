import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export default function App() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState([]);

  const configurado = useMemo(() => Boolean(supabase), []);

  const iniciarSesion = async () => {
    if (!supabase) {
      setMensaje("Configura EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setCargando(true);
    setMensaje("");

    const { error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password,
    });

    if (error) {
      setMensaje(error.message);
      setCargando(false);
      return;
    }

    const { data, error: productosError } = await supabase
      .from("productos")
      .select("id_producto,nombre_producto,precio_venta,stock")
      .order("id_producto", { ascending: true });

    setProductos(data || []);
    setMensaje(productosError ? productosError.message : "Sesion iniciada.");
    setCargando(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Pulperia</Text>
        <Text style={styles.subtitle}>Sistema movil de ventas</Text>

        {!configurado && (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Agrega las variables EXPO_PUBLIC_SUPABASE_URL y
              EXPO_PUBLIC_SUPABASE_ANON_KEY antes de iniciar.
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Correo"
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
          />
          <TextInput
            placeholder="Contrasena"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            disabled={cargando}
            style={({ pressed }) => [
              styles.button,
              pressed || cargando ? styles.buttonPressed : null,
            ]}
            onPress={iniciarSesion}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>
        </View>

        {mensaje ? <Text style={styles.message}>{mensaje}</Text> : null}

        <FlatList
          data={productos}
          keyExtractor={(item) => String(item.id_producto)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <View>
                <Text style={styles.productName}>{item.nombre_producto}</Text>
                <Text style={styles.productMeta}>Stock: {item.stock ?? 0}</Text>
              </View>
              <Text style={styles.price}>C$ {Number(item.precio_venta || 0).toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: "#182235",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#5f6b7a",
    fontSize: 16,
    marginBottom: 24,
  },
  notice: {
    backgroundColor: "#fff7e6",
    borderColor: "#ffd591",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  noticeText: {
    color: "#7c4a03",
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#dbe3ef",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#116149",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.78,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  message: {
    color: "#374151",
    marginTop: 14,
  },
  list: {
    gap: 10,
    paddingTop: 18,
  },
  product: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  productName: {
    color: "#182235",
    fontSize: 16,
    fontWeight: "700",
  },
  productMeta: {
    color: "#6b7280",
    marginTop: 2,
  },
  price: {
    color: "#116149",
    fontWeight: "800",
  },
});
