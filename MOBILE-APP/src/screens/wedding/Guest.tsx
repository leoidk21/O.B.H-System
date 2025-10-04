import React, { useEffect, useRef, useState, useCallback } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Modal, Pressable } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Svg, { Path } from "react-native-svg";
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements'

import {  RootStackParamList, Guest } from "../../screens/type";
import { useGuestManagement } from './Hook/useGuestManagement';

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const GuestComponent  = () => {
 
  const [search, setSearch] = useState("");
  const relationshipOptions = ["Family", "Friend", "Colleague", "VIP / Sponsor", "Other"];

  // State for modals and selections
  const [modalVisible, setModalVisible] = useState(false);
  const [guestModal, setGuestModal] = useState(false);
  const [rsvpModal, setrsvpModal] = useState(false);
  const [checked, setChecked] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState(-1);
  const [selectedAge, setSelectedtAge] = useState(-1);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedRSVP, setSelectedRSVP] = useState(-1);

  // Use the custom hook
  const {
    currentGuest,
    invitedGuests,
    saveSideRelationship,
    saveRSVPStatus,
    addGuest,
    updateGuestName,
    getStatusColor,
    isGuestComplete,
    getGuestCompletionLevel,
    resetCurrentGuest
  } = useGuestManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);

  // ✅ FILTER GUESTS WHEN SEARCH QUERY OR INVITED GUESTS CHANGE
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGuests(invitedGuests);
    } else {
      const filtered = invitedGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.side.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.relationship.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGuests(filtered);
    }
  }, [searchQuery, invitedGuests]);

  // Side options
  const sideOptions = [
    { value: 'bride', label: "Bride's Side" },
    { value: 'groom', label: "Groom's Side" },
    { value: 'both', label: 'Both' },
  ];

  // Picker options
  const options = [
    { label: 'Select Gender', value: '', disabled: true },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  // Handler functions
  const handleSaveSideRelationship = () => {
    saveSideRelationship(checked, selectedRelationship, selectedAge, selectedValue, sideOptions);
    setGuestModal(false);
    setModalVisible(true);
  };

  const handleSaveRSVPStatus = () => {
    saveRSVPStatus(selectedRSVP);
    setrsvpModal(false);
    setModalVisible(true);
  };

  const handleAddGuest = () => {
    addGuest();
    resetGuestForm();
    setModalVisible(false);
  };

  const resetGuestForm = () => {
    setChecked('');
    setSelectedRelationship(-1);
    setSelectedtAge(-1);
    setSelectedValue('');
    setSelectedRSVP(-1);

    resetCurrentGuest();
  };

  const closeModal = () => setModalVisible(false);

  const closeGuestModal = () => {
    resetGuestForm();
    setGuestModal(false);
  }
  
  const closersvpModal = () => setrsvpModal(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#FFFFFF", "#f2e8e2ff"]} style={{ flex: 1 }}>
          
          {/* HEADER */}
          <View>
              <NavigationSlider headerTitle="Guest" />
          </View>
          {/* HEADER */}

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
                              setGuestModal(true)
                              setModalVisible(false)
                          }}
                        >
                          <View style={styles.sideRelationship}>
                            <Text>Side & Relationship</Text>
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                size={12}
                                color="#343131"
                            />
                          </View>
                      </TouchableOpacity>

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

                      {/* Display selected choices preview */}
                      <View style={styles.selectedChoicesPreview}>
                          {currentGuest.side && (
                              <Text style={styles.choiceText}>Side: {currentGuest.side}</Text>
                          )}
                          {currentGuest.relationship && (
                              <Text style={styles.choiceText}>Relationship: {currentGuest.relationship}</Text>
                          )}
                          {currentGuest.ageGroup && (
                              <Text style={styles.choiceText}>Age: {currentGuest.ageGroup}</Text>
                          )}
                          {currentGuest.gender && (
                              <Text style={styles.choiceText}>Gender: {currentGuest.gender}</Text>
                          )}
                          {currentGuest.status && (
                              <Text style={styles.choiceText}>Status: {currentGuest.status}</Text>
                          )}
                      </View>

                      <View style={styles.saveButtonContainer}>
                          <TouchableOpacity
                              style={styles.saveButton}
                              onPress={() => {
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
          {/* ADD NEW GUEST MODAL */}

          {/* SIDE & RELATIONSHIP GUEST MODAL */}
          <Modal
              visible={guestModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setGuestModal(false)}
              statusBarTranslucent={true}
              onDismiss={closeGuestModal}
          >
            {/* MODAL OVERLAY */}
              <View style={styles.modalOverlay}>
                  {/* MODAL CONTAINER */}
                  <View style={styles.modalContainer}>
                      <View style={styles.closeButtonContainer}>
                          <Text style={styles.modalTitle}>Side & Relationship</Text>
                          <TouchableOpacity
                              style={styles.closeBtn}
                              onPress={handleSaveSideRelationship}
                          >
                              <Text style={styles.saveSideRelationship}>Save</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.underline}></View>

                      {/* SIDES CONTAINER */}
                      <View>
                        <Text style={{ marginLeft: wp("5%"), marginTop: hp("1.5%"), marginBottom: hp("0.5%") }}>Side</Text>
                        <View style={styles.sideContainer}>
                          {sideOptions.map((option) => (
                            <Pressable
                              key={option.value}
                              onPress={() => setChecked(option.value)}
                              style={{ flexDirection: "row", alignItems: "center", margin: 2 }}
                            >
                              <RadioButton
                                value={option.value}
                                status={checked === option.value ? "checked" : "unchecked"}
                                onPress={() => setChecked(option.value)}
                              />
                              <Text>{option.label}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                      {/* SIDES CONTAINER */}

                      {/* RELATIONSHIP */}
                      <View>
                        <Text style={{ marginLeft: wp("5%"), marginTop: hp("1.5%"), marginBottom: hp("0.5%") }}>
                          Relationship
                        </Text>

                        <View style={styles.selectRSContainer}>
                          {["Family", "Friend", "Colleague", "VIP / Sponsor", "Other"].map(
                            (label, index) => (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.selectRelationship,
                                  {
                                    backgroundColor: selectedRelationship === index
                                      ? "#102E50" // apply background color when selected
                                      : "#ffffff", // or any other default color
                                  },
                                ]}
                                onPress={() => setSelectedRelationship(index)}
                              >
                                <Text
                                  style={[
                                    styles.selectRelationshipText,
                                    {
                                      color: selectedRelationship === index
                                        ? "#ffffff" // apply text color when selected
                                        : "#000000", // or any other default text color
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
                      {/* RELATIONSHIP */}

                      {/* RELATIONSHIP */}
                      <View>
                        <Text style={{ marginLeft: wp("5%"), marginTop: hp("1.5%"), marginBottom: hp("0.5%") }}>
                          Age Group
                        </Text>

                        <View style={styles.selectRSContainer}>
                          {["Adult", "Teen", "Child"].map(
                            (label, index) => (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.selectRelationship,
                                  {
                                    backgroundColor: selectedAge === index
                                      ? "#102E50"
                                      : "#ffffff",
                                  },
                                ]}
                                onPress={() => setSelectedtAge(index)}
                              >
                                <Text
                                  style={[
                                    styles.selectRelationshipText,
                                    {
                                      color: selectedAge === index
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
                      {/* RELATIONSHIP */}

                      <View style={styles.picker}>
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue) => setSelectedValue(itemValue)}
                          >
                            {options.map((option, index) => (
                              <Picker.Item
                                key={index}
                                label={option.label}
                                value={option.value}
                                enabled={!option.disabled}
                              />
                            ))}
                        </Picker>
                      </View>
                  </View>
                  {/* MODAL CONTAINER */}
              </View>
            {/* MODAL OVERLAY */}

          </Modal>
          {/* SIDE & RELATIONSHIP GUEST MODAL */}

          {/* RSVP STATUS */}
          <Modal
              visible={rsvpModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setrsvpModal(false)}
              statusBarTranslucent={true}
              onDismiss={closersvpModal}
          >
            {/* MODAL OVERLAY */}
              <View style={styles.modalOverlay}>
                  {/* MODAL CONTAINER */}
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
                      {/* RELATIONSHIP */}
                  </View>
                  {/* MODAL CONTAINER */}
              </View>
            {/* MODAL OVERLAY */}
          </Modal>
          {/* RSVP STATUS */}

          {/* SEARCH BAR */}
          <View style={styles.searchBarContainer}>
              <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M7.99393 14.5217C4.25828 14.5217 1.22998 11.5461 1.22998 7.86966C1.22998 4.19319 4.25828 1.21165 7.99393 1.21165C11.7296 1.21165 14.7585 4.19319 14.7585 7.86966C14.7585 11.5461 11.7296 14.5217 7.99393 14.5217ZM18.8196 17.9666L13.9146 13.1379C15.1986 11.7421 15.9879 9.90092 15.9879 7.86966C15.9879 3.52204 12.409 0 7.99393 0C3.57886 0 0 3.52204 0 7.86966C0 12.2113 3.57886 15.7334 7.99393 15.7334C9.90155 15.7334 11.6512 15.0741 13.0255 13.9753L17.9501 18.8218C18.1907 19.0594 18.5797 19.0594 18.8196 18.8218C19.0601 18.5902 19.0601 18.2042 18.8196 17.9666Z" fill="#343131"/>
              </Svg>

              <TextInput
                  style={styles.searchInput}
                  placeholder="Search by guests list..."
                  placeholderTextColor="#999"
                  autoCorrect={false}
                  value={searchQuery}
                  onChangeText={setSearchQuery} // ✅ Update search query
                  clearButtonMode="while-editing"
              />
          </View>

          <View style={styles.totalGuests}>
            <Text style={styles.totalGuestsText}>
              Total Guest: {invitedGuests.length}
              {searchQuery && ` (Found: ${filteredGuests.length})`} {/* ✅ Show filtered count */}
            </Text>
          </View>
          {/* SEARCH BAR */}

          {/* GUEST LIST */}
          <View style={styles.invitedGuestsContainer}>
            <ScrollView 
              style={styles.scrollGuests}
              contentContainerStyle={styles.scrollViewContent}
            >
              {filteredGuests.map((guest) => { // ✅ Use filteredGuests instead of invitedGuests
              const completionLevel = getGuestCompletionLevel(guest);
              const isComplete = isGuestComplete(guest);
                
                return (
                  <View 
                    key={guest.id} 
                    style={[
                      styles.guestBadge,
                      isComplete && styles.completeGuestBadge,
                      !isComplete && completionLevel > 0 && styles.partialGuestBadge,
                      !isComplete && completionLevel === 0 && styles.incompleteGuestBadge
                    ]}
                  >
                    <View style={[styles.statusIndicator, 
                      { backgroundColor: getStatusColor(guest.status) }]} />
                    
                    <View style={styles.guestInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.nameText}>{guest.name}</Text>
                        {guest.status === 'Accepted' && (
                          <Icon name="check-circle" size={16} color={getStatusColor(guest.status)} />
                        )}
                      </View>
                      
                      <View style={styles.detailsRow}>
                        <Text style={[styles.statusText, 
                          { color: getStatusColor(guest.status) }]}>
                          {guest.status}
                        </Text>
                        <Text style={styles.roleText}>
                          {guest.side} • {guest.relationship}
                          {guest.ageGroup && ` • ${guest.ageGroup}`}
                          {guest.gender && ` • ${guest.gender}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
                
              })}
              {searchQuery && filteredGuests.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No guests found for "{searchQuery}"
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
          {/* GUEST LIST */}

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

  sideRelationship: {
      borderWidth: 1,
      borderRadius: 9,
      width: wp("76%"),
      alignSelf: "center",
      alignItems: "center",
      flexDirection: "row",
      marginTop: hp("1.5%"),
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("3%"),
      borderColor: colors.borderv3,
      justifyContent: "space-between",
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

  sideContainer: {
    borderWidth: 1,
    borderRadius: 9,
    width: wp("76%"),
    marginTop: hp("1%"),
    alignSelf: "center",
    borderColor: colors.borderv3,
  },

  selectedRelationshipText: {
    textAlign: "center",
    color: colors.white,
  },

  selectRelationshipText: {},

  selectRSContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginHorizontal: wp("5%"),
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },

  selectRelationship: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 9,
    flexBasis: "30%",
    margin: wp("1%"),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("2%"),
    borderColor: colors.borderv3,
  },

  selectedRelationshipButton: {},

  picker: {
    borderWidth: 1,
    borderRadius: 9,
    width: wp("72%"),
    alignSelf: "center",
    marginTop: hp("1.5%"),
    marginBottom: hp("2%"),
    paddingHorizontal: wp("3%"),
    borderColor: colors.borderv3,
  },

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

  guestBadge: {
    borderRadius: wp("3%"),
    marginVertical: hp("1%"),
    paddingVertical: hp("1%"),
    marginHorizontal: wp("7%"),
    paddingHorizontal: wp("3%"),
    backgroundColor: colors.white,
    elevation: 3,
    borderWidth: 1,
    shadowRadius: 3,
    shadowOpacity: 0.1,
    shadowColor: colors.black,
    borderColor: 'transparent',
    shadowOffset: { width: 0, height: hp("0.5%") },
  },
  statusIndicator: {},
  guestInfo: {},
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameText: {},
  detailsRow: {},
  statusText: {},
  roleText: {},
  emailText: {},
  phoneText: {},
  
  selectedChoicesPreview: {
    marginTop: hp("1.5%"),
    marginHorizontal: wp("4%"),
  },
  
  choiceText: {
    marginHorizontal: wp("1%"),
  },
  completeGuestBadge: {},
  partialGuestBadge: {},
  incompleteGuestBadge: {},
  completionText: {},

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

export default GuestComponent ;