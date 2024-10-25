import { View, Text, StyleSheet, Alert } from "react-native";
import { Link, router } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { CircleUserRound } from "lucide-react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        router.replace('/contact/list')
      } else {
        Alert.alert('Erro', data || 'Falha no login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
  };

  return (
    <View style={styles.container}>
      <CircleUserRound color="black" size={128} />
      <Box w="$72" m="$6">
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
        <Button backgroundColor="gray" onPress={handleLogin}>
          <ButtonText>Logar-se</ButtonText>
        </Button>
        <Button
          variant="solid"
          mt="$2"
          onPress={() => router.push("/auth/register")}
          backgroundColor="black"
        >
          <ButtonText>Cadastrar-se</ButtonText>
        </Button>
        <Center m="$6">
          <Link href="/auth/reset">
            <Text>Esqueceu sua senha?</Text>
          </Link>
        </Center>
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
