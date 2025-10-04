import React, { useState,  } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, Alert, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp, ParamListBase, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../config/colors";
import CheckBox from "react-native-check-box";

// import Collapsible from "react-native-collapsible";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

type PolicyItem = {
  title: string;
  content: string;
};

const policies: PolicyItem[] = [
  {
    title: "1. Booking & Reservations",
    content: "Bookings confirmed with a signed agreement + deposit. Tentative bookings held for 7 days. Deposits are non-refundable but may apply to future events if canceled >30 days in advance.",
  },
  {
    title: "2. Payment Policy",
    content: "Full payment required 14 days before the event. Acceptable methods: bank transfer, credit/debit card, in-app payment. Late payment may delay services or cancel event.",
  },
  {
    title: "3. Cancellation & Refunds",
    content: "Submit cancellation in-app or via email. Refunds: >30 days before: 50% deposit refundable <30 days before: deposit non-refundable. Third-party vendor fees are non-refundable.",
  },
  {
    title: "4. Out of Town Fee (OOTF)",
    content: "Applies for events outside the city or remote areas. Calculated based on travel, accommodation, and logistics.",
  },
  {
    title: "5. Service Changes",
    content: "Modifications allowed up to 14 days before the event. Changes within 14 days may incur extra fees.",
  },
  {
    title: "6. Vendor & Third-Party Services",
    content: "We coordinate trusted vendors (catering, décor, entertainment). Not responsible for vendor errors/delays. External vendors must be approved by Orchestrated By HIStory.",
  },
  {
    title: "7. Liability",
    content: "We are not responsible for: - Personal injury - Loss/damage of property - Weather-related disruptions",
  },
  {
    title: "8. Privacy & Data Protection",
    content: "Client info is confidential and used only for event planning. We don't share data without consent.",
  },
  {
    title: "9. Communication",
    content: "Provide valid contact info. Response times: - App / email: 24 - 48 hours - Urgent: via phone/emergency contact",
  },
  {
    title: "10. Amendments",
    content: "Policies may be updated at any time. Clients notified via app / email.",
  },
];

const CompanyPolicy = () => {

  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) {
      Alert.alert("Please accept the Company Policy to proceed.");
      return;
    }
    navigation.navigate("Home");
  };

  useFocusEffect(
    React.useCallback(() => {
      // Set StatusBar when CompanyPolicy screen comes into focus
      StatusBar.setBackgroundColor(colors.button);
      StatusBar.setBarStyle('light-content');

      // Reset StatusBar when CompanyPolicy screen goes out of focus
      return () => {
        StatusBar.setBackgroundColor('transparent'); // or your default app background
        StatusBar.setBarStyle('dark-content'); // default style
      };
    }, [])
  );

  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FFFFFF", "#f2e8e2ff"]}
        style={styles.container}
      >
        <ScrollView>
          <View style={styles.topContainer}>
            <View style={styles.top}>
              <View>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => navigation.navigate("EventDate")}
                >
                  <FontAwesomeIcon
                    size={18}
                    color="#FFFFFF"
                    icon={faChevronLeft}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.policies}>
              <Text style={styles.policiesText}>
                Please review our company policies{"\n"}before continuing with your event.
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.topContentText}>
              Orchestrated By HIStory Company Policies
            </Text>
          </View>

          {policies.map((policy, index) => (
            <View key={index} style={styles.section}>
              <TouchableOpacity 
                onPress={() => toggleSection(index)} 
                style={styles.sectionHeader}
              >
                <Text style={styles.sectionTitle}>{policy.title}</Text>
              </TouchableOpacity>
              <Text style={styles.sectionContent}>• {policy.content}</Text>
            </View>
          ))}

          <View style={styles.termsCondition}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
              <CheckBox isChecked={accepted} onClick={() => setAccepted(!accepted)} />
              <Text>Please accept our Terms & Conditions</Text>
            </View>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinue}
            >
              <Text style={styles.continue}>Continue</Text>    
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    backBtn: {
      gap: 5,
      left: wp("5%"),
      flexDirection: "row",
      alignItems: "center",
    },

    topContainer: {
      paddingVertical: hp("1.5%"),
      backgroundColor: colors.button,
    },

    top: {
      gap: 30,
      alignItems: "center",
      flexDirection: "row",
    },

    topContentText: {
      textAlign: "left",
      fontSize: wp("6%"),
      color: colors.black,
      marginTop: hp("2%"),
      fontFamily: "Loviena",
      marginHorizontal: wp("5%"),

      borderBottomWidth: 1,
      paddingBottom: hp("2%"),
      borderColor: colors.borderv1,
    },

    policies: {
      marginTop: hp("3%"),
      marginBottom: hp("1%"),
      marginHorizontal: wp("5%"),
    },

    policiesText: {
      fontSize: wp("4%"),
      color: colors.white,
    },

    step: {
      gap: wp("3%"),
      flexDirection: "row",
      marginTop: hp("3.2%"),
    },
  
    stepDot: {
      alignItems: "center",
      justifyContent: "center",
      width: wp("15%"),
      height: hp("0.8%"),
      borderRadius: 50,
    },

    stepText: {
      top: hp("2%"), 
      right: wp("6%"), 
      fontSize: wp("4%"), 
      color: colors.brown
    },

    section: {
      marginTop: hp("1%"),
      marginHorizontal: wp("5%"),
    },

    sectionTitle: {
      color: colors.black,
      fontSize: wp("4.5%"),
      marginVertical: hp("0.5%"),
    },

    sectionContent: {
      textAlign: "justify",
      marginHorizontal: wp("5%"),
    },

    sectionHeader: {},

    termsCondition: {
      marginTop: hp("2%"),
      marginHorizontal: wp("5%"),

      borderTopWidth: 1,
      paddingTop: hp("2%"),
      borderColor: colors.borderv1,
    },

    continueBtn: {
      width: wp('88%'),
      marginTop: hp('2%'),
      alignItems: 'center',
      borderRadius: wp('50%'),
      marginBottom: hp('2.5%'),
      paddingVertical: hp('1.4%'),
      paddingHorizontal: wp('5%'),
      backgroundColor: colors.button,
    },

    continue: {
      fontSize: 15,
      color: colors.white,
      fontFamily: 'Poppins',
    },
});

export default CompanyPolicy;
