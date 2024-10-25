import { Box, Button, ButtonText, FormControl, FormControlLabel, FormControlLabelText, Input, InputField } from "@gluestack-ui/themed";
import { View, StyleSheet } from "react-native";

export default function ResetPage() {
  return (
    <View style={styles.container}>
      <Box w="$72" m="$6">
        <FormControl size="md">
          <FormControlLabel mb="$1">
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField type="text" placeholder="Digite seu email" />
          </Input>
        </FormControl>
      </Box>
      <Box w="$72">
        <Button backgroundColor="black">
          <ButtonText>Enviar</ButtonText>
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