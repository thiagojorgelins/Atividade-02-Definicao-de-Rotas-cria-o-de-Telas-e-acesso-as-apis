import { router, Stack } from "expo-router";
import { Button, GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { ButtonText } from "@gluestack-ui/themed";

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <Stack>
        <Stack.Screen
          name="index"
        />
        <Stack.Screen
          name="auth/register"
          options={{ headerTitle: "Cadastro", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="auth/reset"
          options={{ headerTitle: "Esqueceu a senha", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="contact/list"
          options={{
            headerTitle: "Lista de Contatos",
            headerTitleAlign: "center",
            headerRight: () => (
              <Button
                onPress={() => router.push("/contact/create")}
                backgroundColor="black"
                mr="$4"
              >
                <ButtonText>+</ButtonText>
              </Button>
            ),
          }}
        />
        <Stack.Screen
          name="contact/[contactId]"
          options={{
            headerTitle: "Detalhes do Contato",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="contact/create"
          options={{
            headerTitle: "Adicionar Contato",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}