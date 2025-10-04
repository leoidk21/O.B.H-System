import React, { useRef, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import SignatureScreen from "react-native-signature-canvas";

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const ESignature  = () => {
  const ref = useRef<any>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const handleOK = (signature: string) => {
    // signature is a base64 encoded png
    console.log(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#FFFFFF", "#f2e8e2ff"]} style={{ flex: 1 }}>
          {/* HEADER */}
          <View>
              <NavigationSlider headerTitle="ESignature" />
          </View>
          {/* HEADER */}

          <View style={styles.introContainer}>
            <Text style={styles.introText}>
                Please sign below to confirm and authorize this agreement.
            </Text>
          </View>

          {/* CONTENT */}
          <View style={styles.previewContainer}>
            {/* SIGNATURE PAD */}
            <SignatureScreen
                ref={ref}
                onOK={handleOK}
                autoClear={true}
                descriptionText="Sign here"
                backgroundColor="#fff"
                penColor="black"
                webStyle={`
                    .m-signature-pad {
                        box-shadow: none;
                    }
                    .m-signature-pad--body {
                        border-radius: 12px;
                    }
                    .m-signature-pad--footer {
                        display: none;
                    }
                    canvas {
                        background-color: #fff;
                        border-radius: 12px;
                    }
                `}
            />
            </View>

            <View style={styles.buttonRow}>
                <View>
                    <TouchableOpacity
                        onPress={handleClear}
                        style={styles.clearButton}       
                    >
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                    onPress={handleConfirm}
                    style={styles.confirmButton}         
                    >
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
          {/* CONTENT */}
        </LinearGradient>
        {/* <View>
          <MenuBar activeScreen={"ESignature"} />
        </View> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    introContainer: {
        marginTop: hp("4%"),
        alignItems: "center",
    },

    introText: {
        fontSize: wp("4.5%"),
        textAlign: "center",
        fontFamily: "Poppins",
        marginHorizontal: wp("10%"),
    },


    previewContainer: {
        borderWidth: 1,
        borderRadius: 12,
        width: wp("90%"),
        height: hp("30%"),
        overflow: "hidden",
        marginVertical: 20,
        alignSelf: "center",
        borderColor: colors.borderv5,
        backgroundColor: colors.white,

        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    buttonRow: {
        gap: 12,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    clearButton: {
        borderRadius: wp("2.5%"),
        paddingVertical: wp("3.5%"),
        paddingHorizontal: wp("18%"),
        backgroundColor: colors.border,
    },

    confirmButton: {
        borderRadius: wp("2.5%"),
        paddingVertical: wp("3.5%"),
        paddingHorizontal: wp("18%"),
        backgroundColor: colors.button,
    },

    clearText: {
        color: colors.black,
    },

    saveText: {
        color: colors.white,
    },
});

export default ESignature;