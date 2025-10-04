import React, { useRef, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal, TextInput, Platform, Button } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import { RootStackParamList } from "../../screens/type";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";
import { Alert } from "react-native";

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const Schedule = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [modalVisible, setModalVisible] = React.useState(false);

    const closeModal = () => {
        setModalVisible(false);
    };

    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] = useState('');

    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<"date" | "time">("date");

    const [dateSelected, setDateSelected] = useState(false);
    const [timeSelected, setTimeSelected] = useState(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
            setDate(selectedDate);

            if (mode === "date") {
                setDateSelected(true);
            } else if (mode === "time") {
                setTimeSelected(true);
            }
        }
        setShowPicker(false);
    };

    const showMode = (currentMode: "date" | "time") => {
        setMode(currentMode);
        setShowPicker(true);
    };

    type EventSegment = {
        name: string;
        notes: string;
        time: string;
    };

    const [eventSegments, setEventSegments] = useState<EventSegment[]>([]);
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [segmentToDelete, setSegmentToDelete] = useState<number | null>(null);

    const deleteSegment = (index: number) => {
        console.log("Deleting index:", index);
        setEventSegments(eventSegments.filter((_, i) => i !== index));
    };

    const [segmentToEdit, setSegmentToEdit] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    
    const [showEditPicker, setShowEditPicker] = useState(false);
    const [editTime, setEditTime] = useState("");
    const [editTempDate, setEditTempDate] = useState(new Date());

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={["#FFFFFF", "#f2e8e2ff"]}
                    style={{ flex: 1 }}
                >
                    {/* HEADER */}
                    <View>
                        <NavigationSlider headerTitle="Schedule" />
                    </View>
                    {/* HEADER */}

                    {/* MODAL */}
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
                                    <Text style={styles.modalTitle}>Add Event Time Frame</Text>
                                    <TouchableOpacity
                                        style={styles.closeBtn}  
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.closeButtonText}>&times;</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.underline}></View>

                                {/* DITO KA MUNA MAG START PLEASE LANG */}

                                <View style={styles.inputEvent}>
                                    <Text>Name</Text>
                                    <TextInput
                                        style={styles.inputEventText}
                                        value={inputValue}
                                        onChangeText={setInputValue}
                                        placeholder="Enter Event Segment"
                                    />
                                    {/* <Text>You typed: {inputValue}</Text> */}
                                </View>

                                <View style={styles.dateTimePickerContainer}>
                                    {/* <Text>{date.toLocaleString()}</Text> */}
                                    <View style={styles.dateTimeContainer}>
                                        <TouchableOpacity onPress={() => showMode("time")}>
                                            <Text style={styles.dateTimeText}>Time</Text>
                                            <View style={styles.timePicker}> 
                                                <Text>
                                                    {timeSelected ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select a time"}
                                                </Text>
                                                <Svg width="18" height="18" viewBox="0 0 16 17" fill="none">
                                                    <Path d="M8 15.527C11.866 15.527 15 12.2829 15 8.2811C15 4.27928 11.866 1.03516 8 1.03516C4.13401 1.03516 1 4.27928 1 8.2811C1 12.2829 4.13401 15.527 8 15.527Z" stroke="black" stroke-width="1.5"/>
                                                    <Path d="M8 5.38269V8.28107L9.75 10.0926" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.inputNotesContainer}>
                                        <Text>Notes</Text>
                                        <TextInput
                                            style={styles.inputNotes}
                                            value={inputValue2}
                                            onChangeText={setInputValue2}
                                            multiline
                                            textAlignVertical="top"
                                            placeholder="The ceremony will take place at St. Patricks Chapel."
                                        />
                                    </View>

                                    <View style={styles.saveButtonContainer}>
                                        <TouchableOpacity 
                                            style={styles.saveButton} 
                                            onPress={() => {
                                                if (!inputValue.trim()) {
                                                    Alert.alert("Please input a name for the event segment.");
                                                    return;
                                                }
                                                if (!timeSelected) {
                                                    Alert.alert("Please select a time for the event segment.");
                                                    return;
                                                }
                                                if (!inputValue2.trim()) {
                                                    Alert.alert("Please include notes for the event segment.");
                                                    return;
                                                }

                                                const newSegment = {
                                                    name: inputValue,
                                                    notes: inputValue2,
                                                    time: timeSelected ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
                                                };

                                                setEventSegments([...eventSegments, newSegment]);
                                                closeModal();

                                                setInputValue("");
                                                setInputValue2("");
                                                // setDate(new Date());
                                                // setDateSelected(false);
                                                setTimeSelected(false);                             
                                            }}
                                        >
                                            <Text style={styles.saveButtonText}>Add Segment</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {showPicker && (
                                        <DateTimePicker
                                            value={date}
                                            mode={mode}
                                            is24Hour={true}
                                            display={Platform.OS === "ios" ? "spinner" : "default"}
                                            onChange={onChange}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/* MODAL */}

                    {/* TITLE CONTENT */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Event Schedule</Text>
                    </View>

                    <View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{new Date().toDateString()}</Text>
                        </View>
                    </View>

                    {/* EVENT SEGMENT */}
                    {eventSegments.map((segment, index) => (
                        <TouchableOpacity 
                            key={index}
                            activeOpacity={0}
                            onPress={() => {
                                setSegmentToDelete(index);
                                setShowDeleteModal(true);
                            }}
                        >
                        <View key={index} style={styles.eventSegment}>
                            <View style={styles.eventTimeFrame}>
                                <View style={styles.eventTimeCon}>
                                    <Text style={styles.eventTimeText}>
                                    {segment.time || "No Time"}
                                    </Text>
                                </View>
                                <View style={styles.eventNotesCon}>
                                    <Text style={styles.eventSegmentText}>{segment.name}</Text>
                                    <Text style={styles.eventNotesText}>{segment.notes}</Text>
                                </View>
                            </View>
                        </View>
                        </TouchableOpacity>
                    ))}
                    {/* EVENT SEGMENT */}

                    {/* DELETED SEGMENT */}
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={showDeleteModal}
                        statusBarTranslucent={true}
                        onRequestClose={() => setShowDeleteModal(false)}
                    >
                        <View style={styles.modalBackground}>
                            <View style={styles.deletedModalContainer}>
                                <View
                                    style={styles.warningModalContainer} 
                                >
                                    <Text style={styles.warningModalText}>
                                        Do you want to make changes?
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setShowDeleteModal(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>&times;</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.updateDeleteModal}>
                                    <TouchableOpacity
                                        style={styles.updatemodalButton}
                                        onPress={() => {
                                            if (segmentToDelete !== null) {
                                                const seg = eventSegments[segmentToDelete];
                                                setSegmentToEdit(segmentToDelete);
                                                setEditName(seg.name);
                                                setEditTime(seg.time);
                                                setEditNotes(seg.notes);
                                                setShowEditModal(true);
                                            }
                                            setSegmentToDelete(null);
                                            setShowDeleteModal(false);
                                        }}
                                    >
                                        <Text style={styles.updatemodalButtonText}>Edit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.delmodalButton}
                                        onPress={() => {
                                        if (segmentToDelete !== null) {
                                            deleteSegment(segmentToDelete);
                                        }
                                            setSegmentToDelete(null);
                                            setShowDeleteModal(false);
                                        }}
                                    >
                                        <Text style={styles.delmodalButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/* DELETED SEGMENT */}

                    <Modal
                        statusBarTranslucent={true}
                        transparent={true}
                        animationType="slide"
                        visible={showEditModal}
                        onRequestClose={() => setShowEditModal(false)}
                    >
                    <View style={styles.modalBackground}>
                        <View style={styles.editModalContainer}>
                            <Text style={styles.editWarningModalText}>Edit Event Segment</Text>

                            <View style={styles.modalDivider}>
                                <View>
                                    <Text style={styles.editText}>Event Name</Text>
                                    <TextInput
                                        style={styles.editInputName}
                                        value={editName}
                                        onChangeText={setEditName}
                                        // placeholder="Type here..."
                                    />
                                </View>

                                <View>
                                    <Text style={styles.editText}>Segment Time</Text>
                                    <View style={styles.editTimeContainer}>
                                        <TouchableOpacity onPress={() => setShowEditPicker(true)}>
                                            <Text>
                                                {editTime || "Select Time"}
                                            </Text>
                                        </TouchableOpacity>
                                        <Svg width="18" height="18" viewBox="0 0 16 17" fill="none">
                                            <Path d="M8 15.527C11.866 15.527 15 12.2829 15 8.2811C15 4.27928 11.866 1.03516 8 1.03516C4.13401 1.03516 1 4.27928 1 8.2811C1 12.2829 4.13401 15.527 8 15.527Z" stroke="black" stroke-width="1.5"/>
                                            <Path d="M8 5.38269V8.28107L9.75 10.0926" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </Svg>
                                    </View>
                                </View>

                                {showEditPicker && (
                                    <DateTimePicker
                                        value={editTempDate}
                                        mode="time"
                                        is24Hour={false}
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={(event, selectedDate) => {
                                        setShowEditPicker(false);
                                        if (!selectedDate) return;

                                        setEditTempDate(selectedDate);

                                        const formatted = selectedDate.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        });
                                        setEditTime(formatted);
                                        }}
                                    />
                                )}
                            
                                <View>
                                    <Text style={styles.editText}>Notes</Text>
                                    <TextInput
                                        multiline
                                        style={styles.editInputNotes}
                                        value={editNotes}
                                        onChangeText={setEditNotes}
                                        // placeholder="Notes"
                                    />
                                </View>
                            </View>            

                            <View style={styles.updateDeleteModal}>
                                <TouchableOpacity
                                    style={styles.updatemodalButton}
                                    onPress={() => {
                                        if (segmentToEdit !== null) {
                                        const updated = [...eventSegments];
                                        updated[segmentToEdit] = {
                                            ...updated[segmentToEdit],
                                            name: editName,
                                            time: editTime,
                                            notes: editNotes,
                                        };
                                        setEventSegments(updated);
                                        }

                                        if (!editName || !editName) {
                                            Alert.alert("Error", "Please fill in all the fields.");
                                            return;
                                        }

                                        if (!editNotes || !editNotes) {
                                            Alert.alert("Error", "Please fill in all the fields.");
                                            return;
                                        }

                                        setShowEditModal(false);
                                        setSegmentToEdit(null);
                                    }}
                                >
                                    <Text style={styles.updatemodalButtonText}>Save</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.delmodalButton}
                                    onPress={() => setShowEditModal(false)}
                                >
                                    <Text style={styles.delmodalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    </Modal>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <View>
                    <MenuBar activeScreen="Schedule"/>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        marginLeft: hp("3%"),
        marginTop: hp("2%"),
    },

    titleText: {
        fontSize: wp('6%'),
        color: colors.brown,
        fontFamily: "Loviena",
    },

    dateContainer: {
        marginLeft: hp("2.8%"),
        marginTop: hp("1%"),
        marginBottom: hp("2.5%"),
        backgroundColor: colors.button,
        borderRadius: wp("2%"),
        padding: wp("2%"),
        width: wp("40%"),  
    },

    dateText: {
        textAlign: "center",    
        color: colors.white,
        fontFamily: "Poppins",
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
        width: wp("85%"),
        minHeight: hp("10%"),
        maxHeight: hp("70%"),
        height: 'auto',
        borderRadius: wp("2.5%"),
        backgroundColor: 'white',
        overflow: 'hidden',
    },

    modalTitle: {
        fontSize: wp("4.5%"),
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
        width: wp("75%"),
        alignSelf: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,  
    },

    inputEvent: {
        alignSelf: "center",
        marginTop: hp("1.5%"),
    },

    inputEventText: {
        borderWidth: 1,
        borderRadius: 9,
        width: wp("76%"),
        marginTop: hp("1%"),
        paddingHorizontal: wp("3%"),
        borderColor: colors.borderv3,
    },

    inputNotesContainer: {
        alignSelf: "center",
        marginTop: hp("0.5%"),
    },

    inputNotes: {
        borderWidth: 1,
        borderRadius: 9,
        width: wp("76%"),
        marginTop: hp("1%"),
        height: hp("8%"),
        textAlignVertical: "top",
        paddingHorizontal: wp("3%"),
        borderColor: colors.borderv3,
    },

    dateTimePickerContainer: {
        marginTop: hp("0.5%"), 
        marginHorizontal: wp("1%"), 
    },

    dateTimeContainer: {
        gap: 10,
        alignSelf: "center",
        flexDirection: "row",     
        alignItems: "center",
        marginVertical: hp("1%"),
        marginHorizontal: wp("4%"),
        justifyContent: "space-between",
    },
    
    timePicker: {
        gap: 10,
        borderWidth: 1,
        borderRadius: 9,
        width: wp("76%"),
        height: hp("6%"),
        flexDirection: "row",
        alignItems: "center",
        borderColor: colors.borderv3,
        paddingHorizontal: wp("2.5%"),
        justifyContent: "space-between",
    },

    dateTimeText: {
        marginBottom: hp("1%"),
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

    eventSegment: {
        marginTop: hp("1%"),
        marginHorizontal: wp("5%"),
        marginBottom: hp("1.5%"),
    },

    eventTimeFrame: {
        gap: 10,
        flexDirection: "row",
    },

    eventTimeCon: {
        borderWidth: 2,
        width: wp("24%"),  
        height: wp("24%"),
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#CBD5E1",
        borderRadius: wp("50%") / 2,
    },

    eventTimeText: {
        textAlign: "center", 
    },

    eventNotesCon: {
        width: wp("63%"),
        borderRadius: wp("2.5%"),
        paddingVertical: hp("1%"),
        backgroundColor: "#E0F2FE",
        paddingHorizontal: wp("3.5%"),
    },

    eventSegmentText: {
        fontWeight: "600",
        color: colors.black,
        fontSize: wp("4.5%"),
        marginBottom: hp("0.5%"),
    },

    eventNotesText: {
        color: colors.black,
    },

    deleteButton: {
        position: "absolute",
        right: 5,
        top: 5,
    },

    modalBackground: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1001,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },

    deletedModalContainer: {
        width: wp("80%"),
        overflow: 'hidden',
        alignSelf: "center",
        alignItems: "center",
        padding: wp("1%"),
        justifyContent: "center",
        borderRadius: wp("2.5%"),
        marginVertical: hp("30%"),
        backgroundColor: colors.white,
    },
    
    cancelButton: {
        padding: 0,
        margin: 0,
    },
    
    cancelButtonText: {
        fontSize: wp("7%"),
    },

    warningModalContainer: {
        gap: 18,
        alignItems: "center",
        flexDirection: "row",  
        borderBottomWidth: 1,
        paddingBottom: hp("1%"),
        borderColor: colors.border,
    },
    
    warningModalText: {
        textAlign: "center",
        fontSize: wp("4.5%"),
    },

    updateDeleteModal: {
        alignItems: "center",
        marginTop: hp("2.2%"),
    },
    
    updatemodalButton: {
        width: wp("70%"),
        padding: wp("2.5%"),
        borderRadius: wp("2.5%"),
        marginBottom: hp("1.5%"),
        backgroundColor: colors.borderv2,
    },

    updatemodalButtonText: {
        textAlign: "center",
    },

    delmodalButton: {
        width: wp("70%"),
        padding: wp("2.5%"),
        marginBottom: hp("2%"),
        borderRadius: wp("2.5%"),
        backgroundColor: colors.borderv2,
    },

    delmodalButtonText: {
        textAlign: "center",
    },

    editModalContainer: {
        height: 'auto',
        width: wp("85%"),
        overflow: 'hidden',
        maxHeight: hp("70%"),
        borderRadius: wp("2.5%"),
        backgroundColor: colors.white,  
    },

    editWarningModalText : {
        alignItems: "center",
        borderBottomWidth: 1,
        paddingBottom: hp("2%"),
        marginVertical: hp("2%"),
        borderColor: colors.border,
        marginHorizontal: wp("4%"),
        fontSize: wp("4.5%"),
    },

    editInputContainer: {
        alignItems: "center",
    },

    editInputName: {
        borderWidth: 1,
        borderRadius: 9,
        width: wp("76%"),
        marginTop: hp("3%"),
        alignSelf: "center",
        paddingHorizontal: wp("3%"),
        borderColor: colors.borderv3,
    },

    editTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        borderWidth: 1,
        width: wp("76%"),
        marginTop: hp("3%"),
        borderRadius: 9,
        height: hp("6%"),
        justifyContent: "space-between",
        paddingHorizontal: wp("4%"),
        borderColor: colors.borderv3,
    },

    editInputNotes: {
        borderWidth: 1,
        borderRadius: 9,
        width: wp("76%"),
        marginTop: hp("3%"),
        height: hp("8%"),
        alignSelf: "center",
        textAlignVertical: "top",
        paddingHorizontal: wp("3%"),
        borderColor: colors.borderv3,
    },

    editText: {
        position: "absolute",
        zIndex: 1000,
        left: wp("8%"),
        top: hp("1.5%"),
        color: colors.borderv3,
        backgroundColor: colors.white,
    },

    modalDivider: {
        marginTop: -hp("2%"),
    },
});

export default Schedule