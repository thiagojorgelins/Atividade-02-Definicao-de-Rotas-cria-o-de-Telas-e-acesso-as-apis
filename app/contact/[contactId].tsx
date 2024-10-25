import { View, Text, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Box,
  VStack,
  Icon,
  Input,
  InputField,
  Button,
  ButtonText,
  AvatarFallbackText,
} from "@gluestack-ui/themed";
import { Avatar } from "@gluestack-ui/themed";

export default function ContactDetails() {
  const { contactId } = useLocalSearchParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getContact = async () => {
    try {
      const userToken = await AsyncStorage.getItem("accessToken");
      if (!userToken) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/contacts/${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setContact(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
      } else {
        Alert.alert("Erro", data.message || "Não foi possível obter o contato");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContact();
  }, [contactId]);

  const handleUpdateContact = async () => {
    try {
      const userToken = await AsyncStorage.getItem("accessToken");
      if (!userToken) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/contacts/${contactId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            name,
            email,
            phone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Contato atualizado com sucesso!");
        getContact();
      } else {
        Alert.alert(
          "Erro",
          data.message || "Não foi possível atualizar o contato"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
  };

  const handleDeleteContact = async () => {
    try {
      const userToken = await AsyncStorage.getItem("accessToken");
      if (!userToken) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/contacts/${contactId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert("Sucesso", "Contato excluído com sucesso!");
        router.push("/contact/list");
      } else {
        const data = await response.json();
        Alert.alert(
          "Erro",
          data.message || "Não foi possível excluir o contato"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando detalhes do contato...</Text>
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Contato não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Box alignItems="center" m="$4">
        <Avatar bgColor="$amber600" size="md" borderRadius="$full">
          <AvatarFallbackText>{name}</AvatarFallbackText>
        </Avatar>
      </Box>
      <VStack space="md" m="$4">
        <Input>
          <InputField
            placeholder="Nome"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </Input>

        <Input>
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </Input>

        <Input>
          <InputField
            placeholder="Telefone"
            value={phone}
            inputMode="tel"
            onChangeText={(text) => setPhone(text)}
          />
        </Input>

        <Button backgroundColor="black" mt="$4" onPress={handleUpdateContact}>
          <ButtonText>Editar</ButtonText>
        </Button>

        <Button backgroundColor="red" mt="$2" onPress={handleDeleteContact}>
          <ButtonText>Excluir</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
