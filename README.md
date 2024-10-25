# Projeto de Desenvolvimento para Dispositivos Móveis

Este repositório contém o projeto da **Atividade 02** da disciplina de **Desenvolvimento para Dispositivos Móveis** do curso de **Análise e Desenvolvimento de Sistemas** do campus **IFPE Jaboatão**. O projeto é construído com [Expo](https://expo.dev) e utiliza o **JSON Server** para simular uma API.

## Objetivo

Este projeto visa proporcionar uma experiência prática no desenvolvimento de aplicativos móveis, focando na criação de interfaces utilizando Expo e na integração com uma API simulada.

## Tecnologias Utilizadas

As principais tecnologias utilizadas neste projeto são:

- [Expo](https://expo.dev): Plataforma para o desenvolvimento rápido de aplicativos móveis usando React Native.
- [React Native](https://reactnative.dev/): Biblioteca para criação de interfaces de usuário em dispositivos móveis.
- [JSON Server](https://www.npmjs.com/package/json-server): Um servidor de API REST fake para desenvolvimento e testes de integração.

## Instruções para Rodar a Aplicação

### Pré-requisitos

1. Certifique-se de ter o Node.js e o npm instalados em sua máquina.

### Passo a Passo

1. **Instalar Dependências**

   ```bash
   npm install
   ```

2. **Configurar Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do projeto com a variável de ambiente `EXPO_PUBLIC_API_URL`. Dependendo do modo de execução, utilize:

   - Se for executar localmente:
     ```plaintext
     EXPO_PUBLIC_API_URL="localhost:3000"
     ```
   - Se for executar no aplicativo Expo em um dispositivo móvel, use o IP da sua máquina:
     ```plaintext
     EXPO_PUBLIC_API_URL="192.168.11.151:3000"
     ```

3. **Iniciar a Aplicação**

   Abra dois terminais:

   - No primeiro terminal, execute o comando para iniciar a aplicação Expo:
     ```bash
     npx expo start
     ```
     ou
     ```bash
     npm start
     ```

   - No segundo terminal, execute o comando para iniciar o JSON Server, que simula a API:
     ```bash
     npm run jsa
     ```

4. **Abrir a Aplicação**

   Após iniciar o Expo, você pode optar por abrir a aplicação em:

   - Um emulador Android
   - Um simulador iOS
   - O aplicativo Expo Go (para testar diretamente no seu dispositivo)

---