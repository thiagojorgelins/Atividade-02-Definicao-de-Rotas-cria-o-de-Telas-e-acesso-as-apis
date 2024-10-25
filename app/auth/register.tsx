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
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.push('/');
      } else {
        Alert.alert('Erro', data || 'Falha no cadastro');
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
          <Input>
            <InputField
              type="text"
              placeholder="Digite seu nome"
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
              placeholder="Digite seu email"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </Input>
        </FormControl>
        <FormControl size="md">
          <FormControlLabel mb="$1">
            <FormControlLabelText>Senha</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </Input>
        </FormControl>
      </Box>
      <Box w="$72">
        <Button backgroundColor="black" onPress={handleRegister}>
          <ButtonText>Cadastrar</ButtonText>
        </Button>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
