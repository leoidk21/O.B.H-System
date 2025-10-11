import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Modal } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Svg, { Path } from "react-native-svg";

import { Guest } from "../../screens/type";
import { useGuestManagement } from './Hook/useGuestManagement';

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const GuestComponent  = () => {
  // State for modals and selections
  const [modalVisible, setModalVisible] = useState(false);
  const [rsvpModal, setrsvpModal] = useState(false);
  const [selectedRSVP, setSelectedRSVP] = useState(-1);

  // Use the custom hook
  const {
    currentGuest,
    invitedGuests,
    saveRSVPStatus,
    addGuest,
    updateGuestName,
    getStatusColor,
    resetCurrentGuest
  } = useGuestManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);

  // FILTER GUESTS WHEN SEARCH QUERY OR INVITED GUESTS CHANGE
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGuests(invitedGuests);
    } else {
      const filtered = invitedGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGuests(filtered);
    }
  }, [searchQuery, invitedGuests]);

  // Handler functions
  const handleSaveRSVPStatus = () => {
    saveRSVPStatus(selectedRSVP);
    setrsvpModal(false);
    setModalVisible(true);
  };

  const resetGuestForm = () => {
    setSelectedRSVP(-1);
    resetCurrentGuest();
  };

  const closeModal = () => setModalVisible(false);
  const closersvpModal = () => setrsvpModal(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#FFFFFF", "#f2e8e2ff"]} style={{ flex: 1 }}>
          
          {/* HEADER */}
          <View>
              <NavigationSlider headerTitle="Guest" />
          </View>

          {/* ADD NEW GUEST MODAL */}
          <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
              statusBarTranslucent={true}
          >
              <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                      <View style={styles.closeButtonContainer}>
                          <Text style={styles.modalTitle}>Add New Guest</Text>
                          <TouchableOpacity
                              style={styles.closeBtn}
                              onPress={closeModal}
                          >
                              <Text style={styles.closeButtonText}>&times;</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.underline}></View>

                      <View style={styles.inputGuest}>
                          <TextInput
                              style={styles.inputGuestText}
                              value={currentGuest.name}
                              onChangeText={updateGuestName}
                              placeholder="Enter Full Name"
                          />
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          setrsvpModal(true)
                          setModalVisible(false)
                        }}
                      >
                        <View style={styles.rsvpStatusContainer}>
                            <Text>RSVP Status</Text>
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                size={12}
                                color="#343131"
                            />
                        </View>
                      </TouchableOpacity>

                      <View style={styles.saveButtonContainer}>
                          <TouchableOpacity
                              style={styles.saveButton}
                              onPress={() => {
                                  if (selectedRSVP === -1) {
                                    setSelectedRSVP(2); // 2 is the index for "Pending" in your array
                                    saveRSVPStatus(2);
                                  }
                                  addGuest();
                                  resetGuestForm();
                                  setModalVisible(false);
                              }}
                          >
                              <Text style={styles.saveButtonText}>Add Guest</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
          </Modal>

          {/* RSVP STATUS */}
          <Modal
              visible={rsvpModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setrsvpModal(false)}
              statusBarTranslucent={true}
              onDismiss={closersvpModal}
          >
              <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                      <View style={styles.closeButtonContainer}>
                          <Text style={styles.modalTitle}>RSVP Status</Text>
                          <TouchableOpacity
                              style={styles.closeBtn}
                              onPress={handleSaveRSVPStatus}
                          >
                              <Text style={styles.saveSideRelationship}>Save</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.underline}></View>

                      {/* RELATIONSHIP */}
                      <View>
                        <View style={styles.selectRSVPContainer}>
                          {["Accepted", "Decline", "Pending"].map(
                            (label, index) => (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.selectRSVP,
                                  {
                                    backgroundColor: selectedRSVP === index
                                      ? "#102E50"
                                      : "#ffffff",
                                  },
                                ]}
                                onPress={() => setSelectedRSVP(index)}
                              >
                                <Text
                                  style={[
                                    styles.selectedRSVPText,
                                    {
                                      color: selectedRSVP === index
                                        ? "#ffffff"
                                        : "#000000",
                                    },
                                  ]}
                                >
                                  {label}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>
                      </View>
                  </View>
              </View>
          </Modal>

          {/* SEARCH BAR */}
          <View style={styles.searchBarContainer}>
              <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <Path fillRule="evenodd" clipRule="evenodd" d="M7.99393 14.5217C4.25828 14.5217 1.22998 11.5461 1.22998 7.86966C1.22998 4.19319 4.25828 1.21165 7.99393 1.21165C11.7296 1.21165 14.7585 4.19319 14.7585 7.86966C14.7585 11.5461 11.7296 14.5217 7.99393 14.5217ZM18.8196 17.9666L13.9146 13.1379C15.1986 11.7421 15.9879 9.90092 15.9879 7.86966C15.9879 3.52204 12.409 0 7.99393 0C3.57886 0 0 3.52204 0 7.86966C0 12.2113 3.57886 15.7334 7.99393 15.7334C9.90155 15.7334 11.6512 15.0741 13.0255 13.9753L17.9501 18.8218C18.1907 19.0594 18.5797 19.0594 18.8196 18.8218C19.0601 18.5902 19.0601 18.2042 18.8196 17.9666Z" fill="#343131"/>
              </Svg>

              <TextInput
                  style={styles.searchInput}
                  placeholder="Search by guests list..."
                  placeholderTextColor="#999"
                  autoCorrect={false}
                  value={searchQuery}
                  onChangeText={setSearchQuery} 
                  clearButtonMode="while-editing"
              />
          </View>

          <View style={styles.totalGuests}>
            <Text style={styles.totalGuestsText}>
              Total Guest: {invitedGuests.length}
              {searchQuery && ` (Found: ${filteredGuests.length})`}
            </Text>
          </View>

          {/* GUEST LIST */}
          <View style={styles.invitedGuestsContainer}>
            <ScrollView 
              style={styles.scrollGuests}
              contentContainerStyle={styles.scrollViewContent}
            >
              <View style={styles.guestBadgeContainer}>
                {/* HEADER */}
                <View style={styles.guestLabels}>
                  <Text style={[styles.guestLabelText, styles.columnName]}>Name</Text>
                  <Text style={[styles.guestLabelText, styles.columnStatus]}>Status</Text>
                  <Text style={[styles.guestLabelText, styles.columnLink]}>Invite Link</Text>
                </View>

                {/* ROWS */}
                {filteredGuests.map((guest) => (
                  <View key={guest.id} style={styles.guestBadge}>
                    <Text style={[styles.filteredGuestText, styles.columnName]}>{guest.name}</Text>
                    <Text
                      style={[
                        styles.filteredGuestText,
                        styles.columnStatus,
                        { color: getStatusColor(guest.status) },
                      ]}
                    >
                      {guest.status}
                    </Text>
                    <Text style={[styles.filteredGuestText, styles.columnLink]}>
                      …/invite/{guest.inviteLink}
                    </Text>
                  </View>
                ))}
              </View>
              
              {searchQuery && filteredGuests.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No guests found for "{searchQuery}"
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View>
          <MenuBar activeScreen="Guest"/>
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("2.5%"),
    borderRadius: wp("3%"),
    marginBottom: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.5%"),
    borderColor: colors.borderv2,
  },

  searchInput: {
    width: wp("72%"),
    height: hp("5.5%"),
  },

  totalGuests: {
    marginLeft: wp("6.5%"),
    marginBottom: hp("1.2%"),
  },

  totalGuestsText: {
    fontSize: wp("4%"),
  },

  buttonContainer: {
    marginRight: hp("2.2%"),
    alignSelf: "flex-end",
    marginTop: hp("3.5%"),
    position: "absolute",
    zIndex: 1000,
    bottom: hp("10%"),
    justifyContent: "flex-start",
  },

  button: {
    width: wp("12%"),
    height: wp("12%"),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp("20%") / 2,
    backgroundColor: colors.button,
  },

  buttonText: {
    fontSize: wp("7%"),
    textAlign: "center",
    color: colors.white,
  },

  modalOverlay: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalContainer: {
    height: 'auto',
    width: wp("85%"),
    overflow: 'hidden',
    maxHeight: hp("100%"),
    borderRadius: wp("2.5%"),
    backgroundColor: colors.white,
  },

  modalTitle: {
    fontSize: wp("5%"),
    paddingVertical: hp("0.5%"),
  },

  closeButtonText: {
      fontSize: wp("7%"),
  },

  closeBtn: {
      margin: 0,
      padding: 0,
  },

  closeButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: hp("1%"),
      marginHorizontal: wp("4%"),
      justifyContent: "space-between",
  },

  underline: {
      width: wp("76%"),
      alignSelf: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
  },

  inputGuest: {
      alignSelf: "center",
      marginTop: hp("1.2%"),
  },

  inputGuestText: {
      borderWidth: 1,
      borderRadius: 9,
      width: wp("76%"),
      marginTop: hp("1%"),
      paddingHorizontal: wp("3%"),
      borderColor: colors.borderv3,
  },

  rsvpStatusContainer: {
      borderWidth: 1,
      borderRadius: 9,
      width: wp("76%"),
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp("1.5%"),
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("3%"),
      borderColor: colors.borderv3,
      justifyContent: "space-between",
  },

  saveButtonContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: hp("2.5%"),
  },

  saveButton: {
      width: wp("76%"),
      padding: wp("3%"),
      marginTop: hp("2%"),
      borderRadius: wp("2.5%"),
      backgroundColor: colors.button,
  },

  saveButtonText: {
      textAlign: "center",
      color: colors.white,
  },

  saveSideRelationship: {},

  selectRSVPContainer: {
    marginVertical: hp("1.5%"),
    marginHorizontal: wp("5%"),
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },

  selectRSVP: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 9,
    margin: wp("2%"),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.8%"),
    borderColor: colors.borderv3,
  },

  selectedRSVPText: {},
  
  invitedGuestsContainer: {
     flex: 1,
     maxHeight: 'auto',
  },

  scrollGuests: {
    flex: 1,
  },

  scrollViewContent: {
    paddingBottom: hp("10%"),
  },

  guestBadgeContainer: {
    alignItems: "center",
    marginBottom: hp("2%"),
    marginHorizontal: wp("5%"),
  },

  guestLabels: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
    borderRadius: wp("2%"),
    paddingVertical: hp("1.6%"),
    paddingHorizontal: wp("3%"),
    backgroundColor: colors.borderv2,
  },

  guestBadge: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.borderv2,
    borderRadius: wp("2%"),
    paddingVertical: hp("1.6%"),
    paddingHorizontal: wp("3%"),
    backgroundColor: colors.white,
    marginBottom: hp("1%"),
  },

  guestLabelText: {
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
  },

  filteredGuestText: {
    textAlign: "center",
    color: colors.black,
  },

  columnName: { flex: 2, textAlign: "left" },
  columnStatus: { flex: 1, textAlign: "center" },
  columnLink: { flex: 2, textAlign: "right" },

  noResultsContainer: {},
  noResultsText: {},
});

const getStatusColor = (status: string): string => {
  const statusColors = {
    Accepted: '#4CAF50',
    Pending: '#FF9800',
    Declined: '#F44336',
  };
  return statusColors[status as keyof typeof statusColors] || '#666';
};

export default GuestComponent;