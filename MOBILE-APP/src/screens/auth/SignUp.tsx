import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TextInput , Button, TouchableOpacity} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { signup } from '../auth/user-auth';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    console.log('Values:', { firstName, lastName, email });

    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
    }

    try {
      const user = await signup(
        firstName.trim(),
        lastName.trim(), 
        email.trim(), 
        password.trim()
      );
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("ChooseEvent");
    } catch (err: any) {
      Alert.alert("Error", err.error || "Something went wrong");
    }
  };

  const navigation: NavigationProp<ParamListBase> = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
            colors={['#FFFFFF', '#f2e8e2ff']}
            style={styles.container}
        >
          <View style={styles.centeredContent}> 
            <Image 
              source={require('../../assets/Logo.png')}
              style={{
                width: wp('50%'),
                height: wp('50%'),
              }} 
              resizeMode='contain'
            />
            <Text style={[styles.topText, { fontSize: wp('5.5%') }]}>Create an account</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.textInput}
            />

            <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.textInput}
            />

            <TextInput
                placeholder='Email' 
                value={email}
                onChangeText={(text) => setEmail(text)}           
                style={styles.textInput}
            />

            <TextInput
                placeholder='Password' 
                value={password}
                onChangeText={(text) => setPassword(text)} 
                style={styles.textInput}          
            />

            <TouchableOpacity 
              style={styles.submitBtn}
              onPress={handleSignUp}
            >
              <Text style={styles.submitText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.continueContainer}>
            <TouchableOpacity style={styles.googleBtn}>
              <Image
                source={require('../../assets/google.png')}
                style={{
                  width: wp('6%'),
                  height: wp('6%'),
                }}
                resizeMode='contain'
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn')}
            >
            <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text 
                  style={styles.loginLink}>
                  Sign In
                </Text>
            </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centeredContent: {
    alignItems: 'center',
  },  

  formContainer: {
    gap: 14,
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    borderWidth: 1,
    width: wp('80%'),
    borderRadius: wp('50%'),
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
  },

  submitBtn: {
    width: wp('80%'),
    borderRadius: wp('50%'),
    backgroundColor: colors.button,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
  },

  submitText: {
    textAlign: 'center',
    color: colors.white,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    marginHorizontal: wp('12%'), 
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },

  dividerText: {
    fontSize: 12,
    marginHorizontal: wp('4.17%'),
  },

  continueContainer: {
    gap: 14,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },

  googleBtn: {
    gap: 10,
    width: wp('80%'),
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: wp('50%'),
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: colors.white,
  },  

  facebookBtn: {
    gap: 10,
    width: wp('80%'),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: wp('50%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: colors.facebookBtn,
  },

  googleText: {
    textAlign: 'center',
  },

  topText: {
    width: wp('100%'),
    textAlign: 'center',
  },

  facebookText: {
    textAlign: 'center',
    color: colors.white,
  },

  loginContainer: {
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginText: {},
  
  loginLink: {
    fontWeight: 'bold',
  },
});

export default SignUp;

