import React, { useEffect, useRef, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "../config/colors";
import { RootStackParamList } from "../../screens/type";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

const Event = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <SafeAreaProvider>
            
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={["#FFFFFF", "#f2e8e2ff"]}
                    style={{ flex: 1 }}
                >
                    {/* HEADER */}
                    <View>
                        <NavigationSlider headerTitle="Event" />
                    </View>
                    {/* HEADER */}
                    <ScrollView>
                        {/* CONTENT */}
                        <View style={styles.header}>
                            <Text style={styles.highlightText}>Your current event</Text>
                        </View>
                        <View style={styles.content}>
                            <View style={styles.dividerContainer}></View>
                            <View style={styles.event}>
                                <Image
                                    source={require("../../assets/WEDDING-ICON.png")}
                                    style={styles.eventImage}
                                />
                                <View>
                                    <Text style={styles.eventTitle}>WEDDING</Text>
                                    <Text style={styles.eventDescription}>Make your wedding elegant with a well-organised event.</Text>
                                </View>
                            </View>

                            <View style={styles.divider}></View>

                            <View style={styles.eventDetailsContainer}>
                                <View style={styles.eventDetails}>
                                    <Image
                                        source={require("../../assets/SCHEDULE.png")}
                                        style={{ width: wp("5%"), height: hp("5%") }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.eventDescription, styles.eventDescriptionText]}>Date: Not yet specified</Text>
                                </View>
                                <View style={styles.eventDetails}>
                                    <Image
                                        source={require("../../assets/CLOCK.png")}
                                        style={{ width: wp("5%"), height: hp("5%") }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.eventDescription, styles.eventDescriptionText]}>Time: Not yet specified</Text>
                                </View>
                                <View style={styles.eventDetails}>
                                    <Image
                                        source={require("../../assets/VENUE.png")}
                                        style={{ width: wp("5%"), height: hp("5%") }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.eventDescription, styles.eventDescriptionText]}>Venue: Not yet specified</Text>
                                </View>
                            </View>
                        </View>
                        {/* </LinearGradient> */}
                        {/* CONTENT */}

                        <View style={styles.otherEvents}>
                            <Text style={styles.otherEventsText}>Choose other events?</Text>
                        </View>

                        {/* DEBUT */}
                        <View style={styles.weddingContainer}>
                            <View>
                                <Image
                                    source={require("../../assets/select.png")}
                                    style={styles.select}
                                />
                
                                <View style={styles.beforeImageCentered}>
                                    <Image
                                        source={require("../../assets/DEBUTIMG.png")}
                                        style={[styles.weddingImage, { borderRadius: wp("4%") }]}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.beforeImage} />
                                        <Text style={styles.overlayTextTop}>DEBUT</Text>
                                        <Text style={styles.overlayTextBottom}>
                                        Step into elegance and make your 18th unforgettable.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* PARTIES */}
                        <View style={styles.weddingContainer}>
                            <View>
                                <Image
                                    source={require("../../assets/select.png")}
                                    style={styles.select}
                                />

                                <View style={styles.beforeImageCentered}>
                                    <Image
                                        source={require("../../assets/PARTIESIMG.png")}
                                        style={[styles.weddingImage, { borderRadius: wp("4%") }]}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.beforeImage} />
                                        <Text style={styles.overlayTextTop}>PARTIES</Text>
                                        <Text style={styles.overlayTextBottom}>
                                            Celebrate your special day with us! We’ll take care of the
                                            rest.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* OTHERS */}
                        <View style={[styles.weddingContainer, styles.weddingContainerBottom]}>
                            <View>
                                <Image
                                    source={require("../../assets/select.png")}
                                    style={styles.select}
                                />
                
                                <View style={styles.beforeImageCentered}>
                                    <Image
                                        source={require("../../assets/OTHERIMG.png")}
                                        style={[styles.weddingImage, { borderRadius: wp("4%") }]}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.beforeImage} />
                                        <Text style={styles.overlayTextTop}>OTHERS</Text>
                                        <Text style={styles.overlayTextBottom}>
                                            Not listed? Tell us more about it!
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* CONTENT */}
                        
                    </ScrollView>
                </LinearGradient>
                <View>
                    <MenuBar activeScreen="Event"/>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: wp("4.5%"),
    },

    burgerIcon: {
        width: wp("6%"),
        height: wp("6%"),
    },

    closeButton: {
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp("2.5%"),
        marginLeft: wp("6%"),
    },

    sidebarContainer: {
        flex: 1,
        zIndex: 1000,
    },

    menuIndicatorActive: {
        width: wp("70%"),
        height: hp("7%"),
        alignSelf: "center",
        padding: wp("2.5%"),
        borderRadius: wp("2%"),
        justifyContent: "center",
        backgroundColor: colors.borderv2,
    },

    menuIndicatorInactive: {
        padding: wp("2.5%"),
        justifyContent: "center",
        marginLeft: wp("4.5%"),
        marginTop: hp("0.5%"),
    },

    menuHeader: {
        marginLeft: wp("6%"),
        marginBottom: hp("2%"),
        fontSize: wp("4.5%"),
    },

    accMenuHeader: {
        marginLeft: wp("6%"),
        marginBottom: hp("1%"),
        fontSize: wp("4.5%"),
    },

    sidebarLine: {
        width: wp("68%"),
        alignSelf: "center",
        borderBottomWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
    },

    sidebarContent: {
        zIndex: 1001,
        marginTop: hp("2.5%"),
    },

    sidebarMenu: {
        marginTop: hp("2.5%"),
        marginBottom: hp("2.5%"),
    },

    menuItem: {
        marginLeft: wp("2%"),
    },

    menuText: {
        fontSize: wp("4%"),
    },

    menuSubItem: {
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    menuIcon: {
        objectFit: "contain",
        width: wp("6%"),
        height: wp("6%"),
    },

    profilePic: {
        width: wp("11%"),
        height: wp("11%"),
        objectFit: "contain",
    },

    profileName: {
        fontSize: wp("4%"),
        fontWeight: "600",
    },

    profileEmail: {
        width: wp("45%"),
        fontSize: wp("3.2%"),
    },

    navigationContainer: {
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        width: wp("100%"),
        padding: wp("2.2%"),
        flexDirection: "row",
        position: "absolute",
        paddingBottom: hp("1.5%"),
        backgroundColor: colors.white,
        justifyContent: "space-around",
    },

    navigation: {
        alignItems: "center",
    },

    navigationLine: {
        top: -10,
        zIndex: 1,
        left: "50%",
        height: "6%",
        width: wp("12%"),
        position: "absolute",
        borderRadius: wp("2.5%"),
        backgroundColor: colors.black,
        transform: [{ translateX: -wp("6%") }],
    },

    inactiveText: {
        color: "gray",
        fontSize: wp("3%"),
        marginTop: hp("0.5%"),
    },

    activeText: {
        fontSize: wp("3%"),
        marginTop: hp("0.5%"),
    },

    header: {
        marginTop: hp("2.5%"),
        marginHorizontal: wp("5%"),
    },

    highlightText: {
        fontSize: wp('6%'),
        color: colors.brown,
        fontFamily: "Loviena",
    },

    content: {
        height: 'auto',
        width: wp("90%"),
        alignSelf: "center",
        marginTop: hp("2%"),
        paddingTop: wp("3%"),
        borderRadius: wp("4%"),
        paddingBottom: wp("2%"),
        paddingHorizontal: wp("6%"),
        backgroundColor: colors.white,
        elevation: 2, shadowOpacity: 0.1, shadowRadius: wp("0.4%"), shadowColor: colors.black, shadowOffset: { width: 0, height: hp("0.2%") },
    },
    
    dividerContainer: {
        width: wp("3%"),
        top: 0,
        left: 0,
        bottom: 0,
        position: "absolute",
        borderTopLeftRadius: wp("2%"),
        borderBottomLeftRadius: wp("2%"),
        backgroundColor: colors.checklistv2,
    },
    
    eventImage: {
        width: wp("20%"),
        height: wp("15%"),
        resizeMode: "contain",
    },

    event: {
        gap: 6,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1.5%"),
    },

    eventTitle: {
        top: hp("0.5%"),
        fontWeight: "600",
        fontSize: wp("4.5%"),
        fontFamily: "Poppins",
    },

    eventDescription: {
        width: wp("60%"),
        fontSize: wp("3.5%"),
        fontFamily: "Poppins",
    },

    eventDescriptionText: {
        marginTop: hp("0.5%"),
    },

    eventDetails: {
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    eventDetailsContainer: {
        marginLeft: wp("2.5%"),
    },

    divider: {
        alignSelf: "center",
        width: wp("76%"),
        borderBottomWidth: 1,
        marginVertical: hp("1.5%"),  
        borderBottomColor: colors.border,
    },

    otherEvents: {
        marginTop: hp("2%"),
        marginHorizontal: wp("5%"),
    },

    otherEventsText: {
        fontWeight: "600",
        fontSize: wp("5%"),
        fontFamily: "Loviena",
    },

    weddingContainer: {
        overflow: "hidden",
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
    },

    beforeImageCentered: {
        alignItems: "center",
        justifyContent: "center",
    },

    weddingImage: {
        width: wp("88%"),
        height: wp("34%"),
        marginTop: hp("2.2%"),
    },

    beforeImage: {
        top: 0,
        left: 0,
        zIndex: 1,
        width: wp("88%"),
        height: wp("34%"),
        position: "absolute",
        marginTop: hp("2.2%"),
        borderRadius: wp("4%"),
        backgroundColor: "rgba(0, 0, 0, 0.36)",
    },

    overlayTextTop: {
        zIndex: 2,
        color: "white",
        top: wp("10%"),
        left: wp("6%"),
        right: wp("40%"),
        fontWeight: "400",
        fontSize: wp("5.5%"),
        position: "absolute",
        fontFamily: "Poppins",
    },

    overlayTextBottom: {
        zIndex: 2,
        color: "white",
        top: wp("20%"),
        left: wp("6%"),
        right: wp("20%"),
        fontWeight: "400",
        position: "absolute",
        fontSize: wp("3.6%"),
        fontFamily: "Poppins",
    },

    select: {
        zIndex: 2,
        top: wp("5%"),
        right: wp("6%"),
        width: wp("8%"),
        height: wp("8%"),
        position: "absolute",
        marginTop: hp("2.4%"),
    },
  
    weddingContainerBottom: {
        marginBottom: hp("10%"),
    },
});

export default Event;
