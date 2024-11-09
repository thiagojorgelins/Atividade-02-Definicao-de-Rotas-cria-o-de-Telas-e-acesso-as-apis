import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const CloudinaryUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const CLOUD_NAME = "ds0ut36n6";
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload/`;
  const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`;
  const API_KEY = "746615598258958";
  const API_SECRET = "ocFth439b6Me118FU51Owk7bV4g1";

  // Função para selecionar uma imagem
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
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

  // Função para fazer o upload da imagem
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first");
      return;
    }
    setUploading(true);
    const data = new FormData();
    data.append("file", { uri: image.uri, type: "image/jpeg", name: "upload.jpg" });
    data.append("upload_preset", "storage-atv4");
    data.append("folder", "storage-atv4");
    try {
      const response = await axios.post(CLOUDINARY_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedImage = response.data;
      setUploadedImages((prevImages) => [
        ...prevImages,
        { url: uploadedImage.secure_url, public_id: uploadedImage.public_id },
      ]);
      Alert.alert("Upload successful!", `URL: ${uploadedImage.secure_url}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload failed", "Please try again");
    } finally {
      setUploading(false);
    }
  };

  // Função para excluir imagem
  const deleteImage = async (public_id) => {
    const authHeader = `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`;
    try {
      const response = await axios.delete(DELETE_URL, {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        data: {
          public_ids: [public_id],
        },
      });

      console.log(response.data);

      if (response.data.error) {
        alert(response.data.error.message);
      } else {
        alert("Image deleted successfully!");
        setUploadedImages((prevImages) =>
          prevImages.filter((img) => img.public_id !== public_id)
        );
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error deleting image. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cloudinary Image Upload</Text>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.previewImage} />
      )}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={uploadImage}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
      {uploadedImages.length > 0 && (
        <View style={styles.uploadedImagesContainer}>
          <Text style={styles.subHeader}>Uploaded Images</Text>
          <FlatList
            data={uploadedImages}
            keyExtractor={(item) => item.public_id}
            renderItem={({ item }) => (
              <View style={styles.imageItem}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.uploadedImage}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteImage(item.public_id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  previewImage: {
    width: "90%",
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  uploadedImagesContainer: {
    marginTop: 20,
    width: "100%",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  imageItem: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    width: "90%",
    alignSelf: "center",
  },
  uploadedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CloudinaryUpload;