import React, { useState } from "react";
import {
  Box,
  HStack,
  Pressable,
  Text,
  VStack,
  Avatar,
  AvatarFallbackText,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const getTokenAndFetchContacts = async () => {
        try {
          const userToken = await AsyncStorage.getItem("accessToken");
          if (userToken) {
            await fetchContacts(userToken);
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Erro", "Não foi possível recuperar o token");
        }
      };

      getTokenAndFetchContacts();

      return () => {
      };
    }, [])
  );

  const fetchContacts = async (userToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data: Contact[] = await response.json();

      if (response.ok) {
        setContacts(data);
      } else {
        Alert.alert(
          "Erro", "Não foi possível obter os contatos"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  function goToContact(contact: Contact) {
    router.push({
      pathname: "/contact/[contactId]",
      params: { contactId: contact.id.toString(), name: contact.name },
    });
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando contatos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Box w="100%" px="$4">
        <FlatList
          data={contacts}
          renderItem={({ item }) => (
            <Pressable onPress={() => goToContact(item)} p="$2">
              <Box borderBottomWidth="$1" borderColor="$trueGray300" py="$2">
                <HStack space="md" alignItems="center">
                  <Avatar bgColor="$amber600" size="md" borderRadius="$full">
                    <AvatarFallbackText>{item.name}</AvatarFallbackText>
                  </Avatar>
                  <VStack>
                    <Text color="$coolGray800" fontWeight="$bold">
                      {item.name}
                    </Text>
                    <Text color="$coolGray600">{item.email}</Text>
                    <Text color="$coolGray600">{item.phone}</Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
