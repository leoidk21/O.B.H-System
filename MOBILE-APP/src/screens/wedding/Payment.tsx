import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Image, ImageSourcePropType } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, Asset, MediaType, ImageLibraryOptions } from 'react-native-image-picker';

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const Payment  = () => {

  const [image, setImage] = useState<Asset | null>(null);
  const message = "Proof of payment";
  const [uploading, setUploading] = useState(false);

  const selectImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0];
        setImage(source);
      }
    });
  };

  const handleUpload = () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      Alert.alert('Success', 'Proof of payment uploaded successfully!');
    }, 2000);
  };

  const removeImage = () => {
    setImage(null);
  };

  const imageSource: ImageSourcePropType | null = image 
    ? { uri: image.uri } 
    : null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#FFFFFF", "#f2e8e2ff"]} style={{ flex: 1 }}>
          {/* HEADER */}
          <View>
              <NavigationSlider headerTitle="Payment" />
          </View>
          {/* HEADER */}

          {/* PAYMENT */}
          <ScrollView
                contentContainerStyle={{ 
                    flexGrow: 1,
                    paddingBottom: hp("8%") 
                }}
                showsVerticalScrollIndicator={false}
            >
            <View style={styles.paymentContainer}>
                <View style={styles.paymentHeader}>
                    <Text style={styles.paymentHeaderTitle}>Payment Pending</Text>
                    <Text style={styles.paymentSubTitle}>Request by Admin</Text>
                    <Text style={styles.paymentSubText}>Pay ₱ 10,000 for Venue Deposit</Text>
                </View>
                
                <View style={styles.divider}></View>

                <View>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.paymentHeaderTitle}>Payment Method:</Text>
                        <Text style={styles.gcashText}>GCash</Text>
                    </View>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.paymentHeaderTitle}>Due Date:</Text>
                        <Text style={styles.deadlineText}>May 15, 2025</Text>
                    </View>
                </View>

                <View style={styles.divider}></View>

                <View>
                    <Text style={styles.paymentHeaderTitle}>GCash account to send to:</Text>
                    <Text style={styles.paymentHeaderTitle}>0917-XXX-XXXX</Text>
                    <TouchableOpacity
                        style={styles.gcashBtn}
                        onPress={() => {}}
                    >
                        <Text style={styles.gcashBtnText}>GCash</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider}></View>

                <View>
                    <Text style={styles.pendingText}>The system has flagged your payment as pending.</Text>
                </View>
            </View>

            <View style={[styles.paymentContainer, styles.uploadContainer]}>
                <View>
                    <Text style={styles.paymentHeaderTitle}>Upload your proof of payment here</Text>
                </View>
                
                <View style={styles.divider}></View>
                
                <View>
                    <Text style={styles.paymentSubText}>Message</Text>    
                    <TextInput
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={message}
                        style={styles.messageInput}
                    />
                </View>

                <View style={styles.uploadImageContainer}>
                    {image ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image 
                        source={{ uri: image.uri }} 
                        style={styles.imagePreview}
                        resizeMode="contain"
                        />
                        <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                        <Icon name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    ) : (
                    <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
                        <Icon name="cloud-upload" size={32} color="#007AFF" />
                        <Text style={styles.uploadText}>Tap to upload image</Text>
                    </TouchableOpacity>
                    )}
                </View>
            </View>
          {/* PAYMENT */}
          </ScrollView>

        </LinearGradient>
        <View>
          <MenuBar activeScreen={"Payment"} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    paymentContainer: {
        height: 'auto',
        width: wp("90%"),
        borderRadius: 12,
        marginVertical: 20,
        alignSelf: "center",
        backgroundColor: "white",
        paddingVertical: wp("5%"),
        paddingHorizontal: wp("5%"),

        elevation: 3,
        shadowRadius: 3.84,
        shadowOpacity: 0.25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
    },

    paymentHeader: {
        flexDirection: "column",
    },

    paymentHeaderTitle: {
        fontWeight: "600",
        fontSize: wp("4.4%"),
        paddingBottom: hp("0.5%"),
    },

    paymentSubTitle: {
        fontSize: wp("3.5%"),
        color: colors.borderv4,
    },

    paymentSubText: {
        fontSize: wp("4.2%"),
    },

    paymentMethod: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    gcashText: {
        fontSize: wp("4.5%"),
        color: colors.facebookBtn,
    },

    deadlineText: {
        color: colors.red,
        fontSize: wp("4.5%"),
    },

    gcashBtn: {
        borderRadius: 12,
        alignItems: "center",
        marginTop: hp("1.5%"),
        marginBottom: hp("0.8%"),
        justifyContent: "center",
        paddingVertical: hp("1.5%"),
        backgroundColor: colors.facebookBtn,
    },

    gcashBtnText: {
        color: colors.white,
        fontSize: wp("4.5%"),
    },

    pendingText: {
        color: colors.borderv4,
    },

    divider: {
        borderWidth: 0.5,
        marginVertical: hp("1.5%"),
        borderColor: colors.borderv1,
    },

    uploadContainer: {
        marginTop: hp("-1%"),
    },
    
    messageInput: {
        borderWidth: 0.5,
        borderRadius: 12,
        marginTop: hp("1%"),
        fontSize: wp("4.5%"),
        paddingLeft: wp("5%"),
        color: colors.borderv3,
        paddingVertical: hp("1.5%"),
        borderColor: colors.borderv4,
    },

    uploadImageContainer: {
        borderWidth: 1,
        height: hp("12%"),
        marginTop: hp("2%"),
        alignItems: 'center',
        borderStyle: 'dashed',
        borderRadius: wp("3%"),
        justifyContent: 'center',
        borderColor: colors.borderv4,
    },

    uploadButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    uploadText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.facebookBtn,
    },

    uploadSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },

    imagePreviewContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },

    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },

    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Payment;