import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Pressable } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import Svg, { Path } from "react-native-svg";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import MapView from 'react-native-maps';

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const Venue  = () => {

  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    console.log("Venue Saved:", { venue, address });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#FFFFFF", "#f2e8e2ff"]} style={{ flex: 1 }}>
          {/* HEADER */}
          <View>
              <NavigationSlider headerTitle="Venue" />
          </View>
          {/* HEADER */}

          {/* SEARCH BAR */}
          <View style={styles.searchBar}>
              <Text style={styles.searchBarText}>Set Your Event Venue</Text>
              <View style={styles.searchBarContainer}>
                  <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M7.99393 14.5217C4.25828 14.5217 1.22998 11.5461 1.22998 7.86966C1.22998 4.19319 4.25828 1.21165 7.99393 1.21165C11.7296 1.21165 14.7585 4.19319 14.7585 7.86966C14.7585 11.5461 11.7296 14.5217 7.99393 14.5217ZM18.8196 17.9666L13.9146 13.1379C15.1986 11.7421 15.9879 9.90092 15.9879 7.86966C15.9879 3.52204 12.409 0 7.99393 0C3.57886 0 0 3.52204 0 7.86966C0 12.2113 3.57886 15.7334 7.99393 15.7334C9.90155 15.7334 11.6512 15.0741 13.0255 13.9753L17.9501 18.8218C18.1907 19.0594 18.5797 19.0594 18.8196 18.8218C19.0601 18.5902 19.0601 18.2042 18.8196 17.9666Z" fill="#343131"/>
                  </Svg>

                  <TextInput
                      style={styles.searchInput}
                      placeholder="Search or enter a venue..."
                      value={venue}
                      onChangeText={setVenue}
                  />
              </View>

              <View style={styles.searchBarContainer}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} size={18} color="#777" />
                  <TextInput
                      style={styles.searchInput}
                      placeholder="Address (optional)"
                      value={address}
                      onChangeText={setAddress}
                  />
              </View>

              {/* <View>
                <MapView style={styles.map}/>
              </View> */}

              <View>
                  <TouchableOpacity 
                    onPress={handleSave} 
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save Venue</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </LinearGradient>
        
        <View>
          <MenuBar activeScreen={"Venue"} />
        </View>
      
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    gap: 10,
    borderWidth: 1,
    alignSelf: "center",
    marginTop: hp("2%"),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.5%"),
    borderColor: colors.borderv2,
  },

  searchInput: {
    width: wp("72%"),
    height: hp("5.5%"),
  },

  searchBar: {
    marginTop: hp("3%"),
    marginBottom: hp("1%"),
    marginHorizontal: wp("6%"),
  },

  searchBarText: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: colors.black,
  },

  saveButton: {
    marginTop: hp("3%"),
    padding: wp("3.5%"),
    borderRadius: wp("2.5%"),
    backgroundColor: colors.button,
  },

  saveButtonText: {
    color: colors.white,
    textAlign: "center",
  },

  map: {},

});

export default Venue;