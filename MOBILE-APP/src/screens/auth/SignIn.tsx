import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TextInput , Button, TouchableOpacity} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Alert } from 'react-native';
import { login } from '../auth/user-auth';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '60526703767-6akaoq0t7q4revj50u4hpn5ivcborm9d.apps.googleusercontent.com',
    androidClientId: '438266244663-ouhvt3rep9ngk6340rgesshdli6j6red.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true,
    }),
    scopes: ['profile', 'email'],
  });


  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then(res => res.json())
        .then(user => {
          Alert.alert('Login Successful', `Welcome ${user.name}`);
        })
        .catch(err => {
          console.error('Error fetching user info:', err);
        });
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      console.log("🔐 Initiating Google Sign-In...");
      const result = await promptAsync({ useProxy: true });
      console.log("Result:", result);
    } catch (error) {
      console.error("❌ Error during sign in:", error);
    }
  };

  // ======= HANDLE SIGN IN SECTION =======//
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
    }

    setLoading(true); 
    
    try {
      console.log('Attempting login...');
      const data = await login(email, password);
      const { token, user } = data;

      console.log('Login successful:', user);
      
      Alert.alert("Success", `Welcome back, ${user.email}!`);
        navigation.navigate("ChooseEvent"); 
    } catch (err: any) {
        Alert.alert("Error", err.error || "Invalid email or password");
    } finally {
        setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset functionality coming soon!");
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
                width: wp('58%'),
                height: wp('58%'),
              }} 
              resizeMode='contain'
            />
            <Text style={[styles.topText, { fontSize: wp('5.5%') }]}>Login</Text>
            <Text style={[styles.welcomeText, { fontSize: wp('4%'), marginTop: hp('0.8%') }]}>Welcome Back!</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
                placeholder='Email' 
                value={email}
                onChangeText={setEmail}           
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
            />

            <TextInput
                placeholder='Password' 
                value={password}
                onChangeText={setPassword} 
                style={styles.textInput}
                secureTextEntry={true}
                autoComplete="password"
                editable={!loading}
            />

            <TouchableOpacity 
                style={[styles.submitBtn, loading && { opacity: 0.5 }]}
                onPress={handleSignIn}
                disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPass')}
              disabled={loading}
            >
              <Text style={{ color: loading ? '#999' : '#000' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.continueContainer}>
            <TouchableOpacity 
              style={styles.googleBtn}
              disabled={!request}
              onPress={handleGoogleSignIn}
            >
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
              onPress={() => navigation.navigate('SignUp')}
            >
            <Text style={styles.loginText}>
                Don't have an account?{' '}
                <Text 
                  style={styles.loginLink}>
                  Sign Up
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
    justifyContent: 'center',
    borderRadius: wp('50%'),
    backgroundColor: colors.white,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
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

  googleText: {},

  topText: {},

  welcomeText: {
    fontSize: 1,
  },

  facebookText: {
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

export default SignIn;