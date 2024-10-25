import { View, StyleSheet, Alert } from "react-native";
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const userToken = await AsyncStorage.getItem('accessToken');
      if (userToken) {
        setToken(userToken);
      } else {
        router.push('/');
      }
    };

    getToken();
  }, []);

  const handleAddContact = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Contato adicionado com sucesso!');
        router.push('/contact/list');
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível adicionar o contato');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Box w="$72" m="$6">
        <FormControl size="md">
          <FormControlLabel mb="$1">
            <FormControlLabelText>Nome</FormControlLabelText>
          </FormControlLabel>
          <Input >
            <InputField
              type="text"
              placeholder="Digite o nome"
              value={name}
              onChangeText={text => setName(text)}
            />
          </Input>
        </FormControl>

        <FormControl size="md">
          <FormControlLabel mb="$1">
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="text"
              placeholder="Digite o email"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </Input>
        </FormControl>

        <FormControl size="md">
          <FormControlLabel mb="$1">
            <FormControlLabelText>Telefone</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="text"
              placeholder="Digite o telefone"
              value={phone}
              inputMode="tel"
              onChangeText={text => setPhone(text)}
            />
          </Input>
        </FormControl>

        <Button backgroundColor="black" mt="$4" onPress={handleAddContact}>
          <ButtonText>Adicionar Contato</ButtonText>
        </Button>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
