import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Modal, Pressable, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import colors from "../config/colors";
import Svg, { Path, G, Rect, ClipPath, Defs } from "react-native-svg";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import NavigationSlider from './ReusableComponents/NavigationSlider';
import MenuBar from "./ReusableComponents/MenuBar";

import { getUserData } from "../auth/user-auth";
import { logout } from "../auth/user-auth";

const Account  = () => {

const [user, setUser] = useState<any>(null);

useEffect(() => {
  loadUserData();
}, []);

const loadUserData = async () => {
  try {
    const userData = await getUserData();
    console.log('👤 User data loaded:', userData);
    setUser(userData);
  } catch (error) {
    console.error('Error loading user data:', error);
  }
};

const handleLogout = async () => {
  Alert.alert(
    "Logout", 
    "Are you sure you want to logout?", 
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "SignIn" }],
          });
        }
      }
    ]
  );
};

const navigation: NavigationProp<ParamListBase> = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient colors={["#FFFFFF", "#f2e8e2ff"]} style={{ flex: 1 }}>
          {/* HEADER */}
          <View>
              <NavigationSlider headerTitle="Account" />
          </View>
          {/* HEADER */}

          <ScrollView contentContainerStyle={{ paddingBottom: hp("3%") }}>
            {/* ================== CONTENT ================== */}
            <View>
                {/* -------- PROFILE -------- */}
                <LinearGradient
                  colors={["#fbe6e4ff", "#faeeeeff", "#e5c699ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profile}
                >
                  <View style={styles.userProfileContainer}>
                      <Image 
                        style={styles.userProfile}
                        resizeMode="contain"
                        source={require("../../assets/PROFILEPIC.png")} 
                      />
                      <View style={styles.editIcon}>
                        <Svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <Path d="M9.57688 3.45545L3.6674 9.40369C3.13968 9.93988 1.56149 10.1854 1.17815 9.82959C0.794804 9.4738 1.07359 7.88532 1.60131 7.34912L7.5108 1.4009C7.78367 1.13933 8.14736 0.995488 8.52413 1.00011C8.9009 1.00473 9.26095 1.15745 9.5274 1.42565C9.79385 1.69384 9.94559 2.05627 9.95017 2.43552C9.9548 2.81478 9.81187 3.1808 9.55199 3.45545H9.57688Z" stroke="#343131" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <Path d="M10.0002 10H5.51953" stroke="#343131" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </Svg>
                      </View>
                  </View>

                  <Text style={styles.profileName}>
                    {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : 'Guest User'}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {user?.email || 'No email'}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.editProfileButton}
                  >
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                  </TouchableOpacity>
                </LinearGradient>
                {/* -------- PROFILE -------- */}

                {/* -------- PERSONAL INFO -------- */}
                <View style={styles.personalInfo}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Personal Info</Text>
                    </View>
                    {/* GENDER */}
                    <View style={styles.infoRowContainer}>
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 24 20" fill="none">
                              <Path
                                  d="M22.23 11.3682C23.3217 10.2658 24.0009 8.73126 24.0002 7.04776C24.0009 5.3643 23.3217 3.82977 22.23 2.72763C21.1396 1.62375 19.6218 0.937191 17.9557 0.938234C16.2902 0.937191 14.7717 1.62379 13.6821 2.72763C12.5897 3.82977 11.9104 5.3643 11.9111 7.04776C11.9104 8.73122 12.5897 10.2657 13.6821 11.3682C14.5853 12.2825 15.7825 12.9089 17.1138 13.0971V15.6071H14.3723V17.3102H17.1138V19.9998H18.7983V17.3102H21.5399V15.6071H18.7983V13.0971C20.1296 12.9089 21.3268 12.2825 22.23 11.3682ZM17.9557 10.9437C17.4207 10.9433 16.9164 10.8347 16.4556 10.6379C15.7654 10.3431 15.1746 9.84742 14.7588 9.22516C14.3436 8.60224 14.102 7.8585 14.102 7.04776C14.102 6.50667 14.2095 5.99722 14.4042 5.53184C14.6955 4.83387 15.1855 4.2371 15.8015 3.81674C16.4182 3.39675 17.1539 3.1525 17.9557 3.15179C18.4906 3.15217 18.995 3.26086 19.4558 3.45797C20.1459 3.75239 20.7367 4.2481 21.1525 4.87035C21.5677 5.4937 21.8094 6.23735 21.81 7.04781C21.8094 7.5889 21.7018 8.09834 21.5071 8.56377C21.2159 9.26169 20.7251 9.85884 20.1098 10.2789C19.4932 10.6991 18.7581 10.9431 17.9557 10.9437Z"
                                  fill="#343131"
                              />
                              <Path
                                  d="M6.8865 7.45587V3.26026L8.55947 4.95096L9.75122 3.747L6.04458 0L2.33723 3.747L3.52833 4.95096L5.20195 3.25992V7.45587C3.87066 7.64435 2.67347 8.27078 1.77028 9.18538C0.677907 10.2876 -0.000655774 11.8217 4.75573e-07 13.5052C-0.000655774 15.1894 0.677907 16.7235 1.77028 17.8256C2.86064 18.9298 4.37841 19.6161 6.04458 19.6154C7.71005 19.6161 9.22786 18.9298 10.3182 17.8256C11.4105 16.7235 12.0891 15.1893 12.0891 13.5052C12.0891 11.8218 11.4105 10.2876 10.3182 9.18542C9.41503 8.27082 8.2178 7.64435 6.8865 7.45587ZM9.59606 15.0215C9.30408 15.7194 8.81405 16.3163 8.19872 16.7366C7.58212 17.157 6.84637 17.4012 6.04458 17.4012C5.50894 17.4012 5.00527 17.2925 4.54448 17.0958C3.85434 16.8006 3.26353 16.3053 2.8477 15.683C2.43183 15.0597 2.19023 14.3163 2.19023 13.5053C2.19023 12.9646 2.29777 12.4551 2.49239 11.9897C2.78438 11.2921 3.27445 10.6949 3.89039 10.2746C4.50633 9.85459 5.24208 9.61072 6.04453 9.61001C6.57951 9.61001 7.08314 9.7187 7.54462 9.91581C8.23411 10.2106 8.82487 10.7059 9.24075 11.3282C9.65658 11.9515 9.89822 12.6949 9.89822 13.5053C9.89826 14.0466 9.79069 14.5564 9.59606 15.0215Z"
                                  fill="#343131"
                              />
                          </Svg>
                          <View>
                              <Text style={styles.infoTitle}>Gender</Text>
                              <Text>Choose Gender</Text>
                          </View>
                      </View>
                      <View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#333" />
                      </View>
                    </View>
                    {/* GENDER */}

                    {/* PASSWORD */}
                    <View style={styles.infoRowContainer}>
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 24 22" fill="none">
                              <Path
                                  d="M3.6691 6.12146C2.61641 6.84522 1.76294 7.61912 1.10893 8.30122C-0.369645 9.84329 -0.369644 12.1478 1.10893 13.6899C3.02656 15.6899 6.65898 18.4792 12 18.4792C13.4385 18.4792 14.753 18.2769 15.9435 17.9422L14.0976 16.1645C13.4361 16.2778 12.7369 16.341 12 16.341C7.52277 16.341 4.43821 14.0104 2.74012 12.2393C2.04694 11.5164 2.04694 10.4747 2.74012 9.75178C3.38273 9.08157 4.22389 8.33122 5.26394 7.65736L3.6691 6.12146Z"
                                  fill="#343131"
                              />
                              <Path
                                  d="M8.15125 10.438C8.12302 10.6199 8.1084 10.8061 8.1084 10.9956C8.1084 13.0622 9.84797 14.7374 11.9938 14.7374C12.1905 14.7374 12.3839 14.7233 12.5729 14.6962L8.15125 10.438Z"
                                  fill="#343131"
                              />
                              <Path
                                  d="M15.8474 11.4736L11.4971 7.28403C11.6596 7.26407 11.8252 7.25378 11.9934 7.25378C14.1393 7.25378 15.8788 8.92904 15.8788 10.9956C15.8788 11.1576 15.8682 11.3171 15.8474 11.4736Z"
                                  fill="#343131"
                              />
                              <Path
                                  d="M18.785 14.302C19.8026 13.6364 20.6275 12.8991 21.26 12.2393C21.9532 11.5164 21.9532 10.4747 21.26 9.75179C19.562 7.98077 16.4774 5.65014 12.0002 5.65014C11.289 5.65014 10.6131 5.70893 9.97221 5.81494L8.12012 4.03135C9.29382 3.70718 10.5872 3.51196 12.0002 3.51196C17.3412 3.51196 20.9736 6.30126 22.8912 8.30124C24.3698 9.84331 24.3698 12.1478 22.8912 13.6899C22.2472 14.3617 21.4096 15.1226 20.3787 15.8368L18.785 14.302Z"
                                  fill="#343131"
                              />
                              <Path
                                  d="M0.907183 1.82505C0.473647 1.40755 0.473647 0.730633 0.907183 0.313133C1.34071 -0.104378 2.0436 -0.104378 2.47713 0.313133L23.1013 20.175C23.5349 20.5925 23.5349 21.2694 23.1013 21.6869C22.6678 22.1044 21.9649 22.1044 21.5314 21.6869L0.907183 1.82505Z"
                                  fill="#343131"
                              />
                          </Svg>
                          <View>
                              <Text style={styles.infoTitle}>Password</Text>
                              <Text>**********</Text>
                          </View>
                      </View>
                      <View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#333" />
                      </View>
                    </View>
                    {/* PASSWORD */}
                </View>
                {/* -------- PERSONAL INFO -------- */}

                {/* -------- EVENT SUMMARY -------- */}
                <View style={styles.personalInfo}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Event Summary</Text>
                    </View>

                    {/* EVENT */}
                    <View style={styles.infoRowContainer}>
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 24 23" fill="none">
                              <G clip-path="url(#clip0_2001_81)">
                                  <Path
                                      d="M15.8438 19.3617C15.4688 19.3617 15.1875 19.0699 15.1875 18.7105V15.5207C15.1875 15.1613 15.4688 14.8918 15.8438 14.8918H19.1722C19.5472 14.8918 19.8517 15.1613 19.8517 15.5207V18.7105C19.8517 19.0699 19.5472 19.3617 19.1722 19.3617H15.8438ZM19.1722 15.5207H15.8438V18.7105H19.1722V15.5207ZM22.5 2.15625C23.3205 2.15625 24 2.80744 24 3.59375V21.5625C24 22.3488 23.3205 23 22.5 23H1.5C0.6795 23 0 22.3488 0 21.5625V3.59375C0 2.80744 0.6795 2.15625 1.5 2.15625H7.5V0.71875C7.5 0.314094 7.8285 0 8.25 0C8.6715 0 9 0.314813 9 0.71875V2.15625H15V0.71875C15 0.314094 15.3285 0 15.75 0C16.1715 0 16.5 0.314813 16.5 0.71875V2.15625H22.5ZM1.5 21.5625H22.5V3.59375H16.5V4.3125C16.5 4.71716 16.1715 5.03125 15.75 5.03125C15.3285 5.03125 15 4.71644 15 4.3125V3.59375H9V4.3125C9 4.71716 8.6715 5.03125 8.25 5.03125C7.8285 5.03125 7.5 4.71644 7.5 4.3125V3.59375H1.5V21.5625Z"
                                      fill="#343131"
                                  />
                              </G>
                              <Defs>
                                  <ClipPath id="clip0_2001_81">
                                      <Rect width="24" height="23" fill="white" />
                                  </ClipPath>
                              </Defs>
                          </Svg>
                          <View>
                              <Text style={styles.infoTitle}>Event</Text>
                              <Text>Wedding</Text>
                          </View>
                      </View>
                      <View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#333" />
                      </View>
                    </View>
                    {/* EVENT */}

                    {/* WHEN */}
                    <View style={styles.infoRowContainer}>
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 24 24" fill="none">
                              <Path
                                  d="M0 0V23.1909H23.1909V0H0ZM22.2249 0.966062V5.31425H0.966969V0.966062H22.2249ZM0.966062 22.2249V6.28122H22.224V22.2249H0.966062Z"
                                  fill="black"
                              />
                              <Path
                                  d="M7.24609 2.41602H8.69609V3.86511H7.24609V2.41602Z"
                                  fill="black"
                              />
                              <Path
                                  d="M14.4941 2.41602H15.9432V3.86511H14.4941V2.41602Z"
                                  fill="black"
                              />
                              <Path
                                  d="M8.28565 9.71857C8.11255 10.894 7.5534 10.9148 6.42784 10.9556L6.25293 10.9619V11.7812H8.15968V17.1408H9.17105V9.5636H8.3074L8.28565 9.71857Z"
                                  fill="black"
                              />
                              <Path
                                  d="M13.9898 11.9961C13.5403 11.9961 13.079 12.1429 12.7138 12.3885L13.0582 10.6168H16.2436V9.65613H12.3042L11.5357 13.7596H12.4102L12.4637 13.6763C12.7691 13.2005 13.3264 12.9041 13.9191 12.9041C14.8834 12.9041 15.583 13.6173 15.583 14.5988C15.583 15.4869 15.0256 16.3859 13.9608 16.3859C13.0509 16.3859 12.3966 15.7715 12.3694 14.8915L12.364 14.7157H11.3535L11.358 14.9015C11.3907 16.3334 12.4156 17.2949 13.91 17.2949C15.4162 17.2949 16.5953 16.1422 16.5953 14.6713C16.5953 13.0709 15.5495 11.9952 13.9925 11.9952L13.9898 11.9961Z"
                                  fill="black"
                              />
                          </Svg>
                          <View>
                              <Text style={styles.infoTitle}>When</Text>
                              <Text>Not yet specified</Text>
                          </View>
                      </View>
                      <View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#333" />
                      </View>
                    </View>
                    {/* WHEN */}

                    {/* TIME */}
                    <View style={styles.infoRowContainer}>
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 24 24" fill="none">
                              <Path
                                  d="M12 23C18.0752 23 23 18.0752 23 12C23 5.92487 18.0752 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0752 5.92487 23 12 23Z"
                                  stroke="#343131"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                              />
                              <Path
                                  d="M12 4.66663V12"
                                  stroke="#343131"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                              />
                              <Path
                                  d="M17.1822 17.1822L12 12"
                                  stroke="#343131"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                              />
                          </Svg>
                          <View>
                              <Text style={styles.infoTitle}>Time</Text>
                              <Text>Not yet specified</Text>
                          </View>
                      </View>
                      <View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#333" />
                      </View>
                    </View>
                    {/* TIME */}

                    {/* PARTNER */}
                    <View style={styles.infoRowContainer}>
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 26 24" fill="none">
                              <Path
                                  d="M4.11216 4.39529C5.22475 4.39529 6.12667 3.41137 6.12667 2.19764C6.12667 0.983919 5.22475 0 4.11216 0C2.99958 0 2.09766 0.983919 2.09766 2.19764C2.09766 3.41137 2.99958 4.39529 4.11216 4.39529Z"
                                  fill="#343131"
                              />
                              <Path
                                  d="M16.8934 4.69302C18.006 4.69302 18.9079 3.7091 18.9079 2.49537C18.9079 1.28165 18.006 0.297729 16.8934 0.297729C15.7808 0.297729 14.8789 1.28165 14.8789 2.49537C14.8789 3.7091 15.7808 4.69302 16.8934 4.69302Z"
                                  fill="#343131"
                              />
                              <Path
                                  d="M24.3307 16.3053C23.4323 16.4709 22.5294 16.6781 21.6544 16.9719C21.5819 16.5245 21.5046 16.0784 21.4375 15.6302C22.5331 15.1596 23.3922 14.651 23.5371 14.1764L20.9201 10.7125C20.9189 10.7009 20.8178 9.75832 20.7724 9.29798C21.3053 9.73778 21.8345 10.1825 22.362 10.6317C22.8908 11.0817 23.5862 11.1974 24.1052 10.6317C24.5349 10.1615 24.6356 9.18189 24.1052 8.73004C23.6857 8.37329 20.5338 5.78407 19.7688 5.26122C18.8549 4.52853 17.2771 5.25453 16.9603 6.20333C15.9174 7.40217 14.7219 8.42196 13.5268 9.43595C13.3291 9.60383 13.2194 9.84538 13.1809 10.1052C13.0381 9.95075 12.8412 9.83511 12.5809 9.78243C10.1268 9.29262 8.04561 7.90224 6.59346 5.67334C6.03806 4.79464 4.43284 4.61113 3.6597 5.46527C3.24181 5.9265 3.10839 6.49667 3.08629 7.0923C2.22556 7.97189 1.29443 8.7671 0.361666 9.55829C-0.169587 10.0092 -0.0689029 10.9902 0.361666 11.4595C0.880642 12.0256 1.5752 11.9091 2.10523 11.4595C2.52065 11.1067 2.93608 10.7527 3.34577 10.3919C3.47347 11.5965 3.61918 12.7989 3.7702 13.9991C2.83089 15.2658 2.08845 16.7343 1.25268 18.0609C0.919933 18.5891 1.10984 19.2454 1.44505 19.691C2.31969 20.8524 3.12762 22.0784 3.9421 23.2907C4.87118 24.673 7.01257 23.3349 6.07121 21.932C5.33654 20.8381 4.60187 19.7392 3.83446 18.6694C4.34975 17.7925 4.84867 16.887 5.42536 16.0566C5.56288 16.078 5.7004 16.0847 5.83505 16.0767C5.84201 16.086 5.84692 16.095 5.85388 16.1043C7.49266 18.1997 9.07333 20.3563 10.5918 22.5562C11.5356 23.9225 13.6774 22.5848 12.7205 21.1975C10.7052 18.2774 7.95802 14.5822 7.5385 14.134C7.56633 13.7321 7.35023 12.2109 7.12267 10.0521C8.51424 11.209 10.1264 12.0171 11.9261 12.3774C12.7389 12.5391 13.3074 11.9068 13.4425 11.2224C13.4703 11.2612 13.4957 11.3041 13.5272 11.338C14.0462 11.9042 14.7407 11.7872 15.2703 11.338C15.8564 10.8402 16.4421 10.341 17.0114 9.82082C17.0687 10.3928 17.1297 10.9638 17.1948 11.5349L15.8032 17.4371C15.8032 17.4371 16.0255 17.3822 16.3906 17.2853C15.8347 18.9829 15.317 20.697 14.7256 22.3776C14.155 24.0001 16.5391 24.694 17.1035 23.0929C17.8325 21.0185 18.4268 18.8757 19.1565 16.7955C19.2691 17.467 19.3706 18.1395 19.389 18.8226C19.4152 19.9013 20.4011 20.4188 21.2439 19.9844C22.3903 19.3923 23.7368 19.1271 24.9835 18.8972C26.5511 18.6092 25.8852 16.0177 24.3307 16.3053Z"
                                  fill="#343131"
                              />
                          </Svg>
                          <View>
                              <Text style={styles.infoTitle}>Partner</Text>
                              <Text>Partner's name</Text>
                          </View>
                      </View>
                      <View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#333" />
                      </View>
                    </View>
                    {/* PARTNER */}
                </View>
                {/* -------- EVENT SUMMARY -------- */}

                {/* -------- MORE -------- */}
                <View style={styles.personalInfo}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>More</Text>
                    </View>

                    {/* SWITCH ACCOUNT */}
                    <View style={styles.infoRowContainer}>
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 23 23" fill="none">
                              <Path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M7.29243 2.18131C7.79143 1.6823 7.79143 0.87326 7.29243 0.374249C6.79342 -0.12475 5.98438 -0.12475 5.48537 0.374249L0.374249 5.48537C-0.12475 5.98438 -0.12475 6.79342 0.374249 7.29243L5.48537 12.4035C5.98438 12.9025 6.79342 12.9025 7.29243 12.4035C7.79143 11.9046 7.79143 11.0955 7.29243 10.5965L4.36261 7.66668H16.6111C17.3169 7.66668 17.8889 7.09459 17.8889 6.3889C17.8889 5.68321 17.3169 5.11112 16.6111 5.11112H4.36261L7.29243 2.18131ZM22.6258 15.7076L17.5147 10.5965C17.0157 10.0975 16.2066 10.0975 15.7076 10.5965C15.2086 11.0955 15.2086 11.9046 15.7076 12.4035L18.6374 15.3334H6.3889C5.68321 15.3334 5.11112 15.9054 5.11112 16.6111C5.11112 17.3169 5.68321 17.8889 6.3889 17.8889H18.6374L15.7076 20.8187C15.2086 21.3177 15.2086 22.1268 15.7076 22.6258C16.2066 23.1247 17.0157 23.1247 17.5147 22.6258L22.6258 17.5147C23.1247 17.0157 23.1247 16.2066 22.6258 15.7076Z"
                                  fill="#343131"
                              />
                          </Svg>
                          <Text>Switch Account</Text>
                      </View>
                      <View>
                        <FontAwesomeIcon icon={faChevronRight} size={16} color="#333" />
                      </View>
                    </View>
                    {/* SWITCH ACCOUNT */}

                    {/* LOGOUT */}
                    <TouchableOpacity
                      onPress={handleLogout}
                    >
                      <View style={styles.infoRow}>
                          <Svg width="28" height="26" viewBox="0 0 22 22" fill="none">
                            <Path d="M13.998 5.99995C13.9859 3.82494 13.8895 2.64704 13.1211 1.87867C12.2424 1 10.8282 1 7.99986 1H6.99987C4.1715 1 2.75721 1 1.87862 1.87867C0.999928 2.75734 0.999928 4.17154 0.999928 6.99994V14.9999C0.999928 17.8282 0.999928 19.2424 1.87862 20.1211C2.75721 20.9998 4.1715 20.9998 6.99987 20.9998H7.99986C10.8282 20.9998 12.2424 20.9998 13.1211 20.1211C13.8895 19.3527 13.9859 18.1748 13.998 15.9998" stroke="#343131" stroke-width="2" stroke-linecap="round"/>
                            <Path d="M8.00013 10.9998H21M21 10.9998L17.5 7.99988M21 10.9998L17.5 13.9998" stroke="#343131" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </Svg>
                          <Text>Logout</Text>
                      </View>
                    </TouchableOpacity>
                    {/* LOGOUT */}
                </View>
                {/* -------- MORE -------- */}
            </View>
            {/* ================== END CONTENT ================== */}
          </ScrollView>
        </LinearGradient>
        {/* <View>
          <MenuBar activeScreen={"Account"} />
        </View> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    marginTop: hp('2.5%'),
    marginBottom: hp('2%'),
    width: wp('90%'),
    alignSelf: 'center',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    backgroundColor: colors.checklist,
    paddingVertical: hp('2%'),
  },

  userProfileContainer: {
    position: 'relative',
  },

  editIcon: {
    right: 4,
    bottom: 4,
    borderRadius: 50,
    padding: wp('2%'),
    position: 'absolute',
    backgroundColor: colors.white,

    elevation: 3,
    shadowOpacity: 1,
    shadowRadius: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
  },

  userProfile: {
    width: wp('20%'),
    height: wp('20%'),
    marginTop: hp('0.5%'),
    marginBottom: hp('1.5%'),
  },

  profileName: {
    fontWeight: '600',
    fontSize: wp('4.5%'),
    fontFamily: 'Loviena',
    marginTop: hp('0.5%'),
  },

  profileEmail: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins',
    color: colors.borderv4,
    marginBottom: hp('0.5%'),
  },
  
  editProfileButton: {
    borderRadius: wp('5%'),
    marginVertical: hp('1%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('15%'),
    backgroundColor: colors.white,
  },

  editProfileText: {
    fontFamily: 'Poppins',
    color: colors.black,
  },

  personalInfo: {
    fontFamily: 'Poppins',
    marginHorizontal: wp('6%'),
  },

  sectionHeader: {
    marginTop: hp('1%'),
  },

  sectionHeaderText: {
    fontWeight: '600',
    fontSize: wp('4%'),
    color: colors.borderv5,
    marginBottom: hp('1.5%'),
  },

  infoRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  infoRow: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  infoTitle: {
    color: colors.borderv5,
  },
});

export default Account;