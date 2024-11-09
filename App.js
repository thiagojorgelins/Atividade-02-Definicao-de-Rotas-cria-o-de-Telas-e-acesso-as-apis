import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Alert,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const CloudinaryUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const CLOUD_NAME = "ds0ut36n6";
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload/`;
  const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`;
  const LIST_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
  const API_KEY = "746615598258958";
  const API_SECRET = "ocFth439b6Me118FU51Owk7bV4g";

  const api = axios.create({
    headers: {
      Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
    },
  });

  const fetchImages = async () => {
    try {
      const { data } = await api.get(LIST_URL);
      
      const processedImages = (data.resources || []).map(resource => ({
        ...resource,
        url: resource.secure_url || `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${resource.public_id}`
      }));
      setUploadedImages(processedImages);
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      Alert.alert(
        "Erro", 
        error.response?.data?.error?.message || "Ocorreu um erro ao carregar as imagens. Tente novamente."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchImages();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão Necessária", "É necessário permitir o acesso à galeria para selecionar imagens.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Atenção", "Por favor, selecione uma imagem primeiro.");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("file", { 
      uri: image.uri, 
      type: "image/jpeg", 
      name: "upload.jpg" 
    });
    formData.append("upload_preset", "storage-atv4");
    formData.append("folder", "storage-atv4");

    try {
      const { data } = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert("Sucesso", "Imagem enviada com sucesso!");
      setImage(null);
      fetchImages();
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      Alert.alert(
        "Falha no Upload", 
        error.response?.data?.error?.message || "Não foi possível enviar a imagem. Tente novamente."
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (public_id) => {
    try {
      const { data } = await api.delete(DELETE_URL, {
        data: {
          public_ids: [public_id],
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Alert.alert("Sucesso", "Imagem excluída com sucesso!");
      fetchImages();
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);
      Alert.alert(
        "Erro ao Excluir", 
        error.response?.data?.error?.message || "Não foi possível excluir a imagem. Tente novamente."
      );
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const renderImageItem = ({ item }) => (
    <View style={styles.imageItem}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.url }} 
          style={styles.uploadedImage}
          resizeMode="cover"
        />
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir esta imagem?",
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              {
                text: "Excluir",
                onPress: () => deleteImage(item.public_id),
                style: "destructive"
              }
            ]
          );
        }}
      >
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gerenciador de Imagens</Text>

      <View style={styles.uploadSection}>
        {image && (
          <View style={styles.previewContainer}>
            <Image 
              source={{ uri: image.uri }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.pickButton]} 
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button, 
              styles.uploadButton,
              (uploading || !image) && styles.buttonDisabled
            ]}
            onPress={uploadImage}
            disabled={uploading || !image}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar Imagem</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={uploadedImages}
        keyExtractor={(item) => item.public_id}
        renderItem={renderImageItem}
        contentContainerStyle={styles.imageList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#4A90E2"
            title="Atualizando..."
            titleColor="#4A90E2"
          />
        }
        ListEmptyComponent={
          <Text style={styles.noImagesText}>Nenhuma imagem enviada ainda.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F2F5",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1A1A1A",
    textAlign: "center",
  },
  uploadSection: {
    marginBottom: 24,
  },
  previewContainer: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E1E4E8",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickButton: {
    backgroundColor: "#4A90E2",
  },
  uploadButton: {
    backgroundColor: "#34C759",
  },
  buttonDisabled: {
    backgroundColor: "#A8A8A8",
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  imageList: {
    paddingVertical: 8,
  },
  imageItem: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#E1E4E8",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  noImagesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666666",
    marginTop: 24,
  },
});

export default CloudinaryUpload;