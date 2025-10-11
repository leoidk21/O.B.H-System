import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, Image, TextInput , TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Alert } from 'react-native';
import { login } from '../auth/user-auth';

// import * as Linking from 'expo-linking';
// import * as AuthSession from 'expo-auth-session';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { GOOGLE_WEB_CLIENT_ID } from '@env';
// WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  // const [googleLoading, setGoogleLoading] = useState(false);

  // const handleGoogleSignIn = async () => {
  //   try {
  //     setGoogleLoading(true);
  //     console.log('🚀 Starting manual Google OAuth...');

  //     const redirectUri = 'https://auth.expo.io/@leochavez2002/Mobile';
  //     const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  //       `client_id=${GOOGLE_WEB_CLIENT_ID}` +
  //       `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  //       `&response_type=id_token` +
  //       `&scope=${encodeURIComponent('openid profile email')}` +
  //       `&nonce=${Math.random().toString(36)}`;

  //     console.log('🔗 Auth URL:', authUrl);

  //     const result = await WebBrowser.openAuthSessionAsync(
  //       authUrl,
  //       redirectUri
  //     );

  //     console.log('📥 Result:', result);

  //     if (result.type === 'success') {
  //       const url = result.url;
  //       console.log('✅ Success URL:', url);
        
  //       // Extract id_token from URL fragment
  //       const idToken = extractIdToken(url);
        
  //       if (idToken) {
  //         console.log('✅ ID token extracted');
  //         await sendToBackend({ idToken });
  //       } else {
  //         console.error('❌ No ID token in URL');
  //         Alert.alert('Error', 'No authentication token received');
  //         setGoogleLoading(false);
  //       }
  //     } else {
  //       console.log('❌ Auth cancelled or failed');
  //       setGoogleLoading(false);
  //     }
  //   } catch (error) {
  //     console.error('❌ Auth error:', error);
  //     Alert.alert('Error', 'Failed to sign in with Google');
  //     setGoogleLoading(false);
  //   }
  // };

  // const extractIdToken = (url: string): string | null => {
  //   try {
  //     // Extract fragment (everything after #)
  //     const fragment = url.split('#')[1];
  //     if (!fragment) return null;

  //     // Parse fragment parameters
  //     const params = new URLSearchParams(fragment);
  //     return params.get('id_token');
  //   } catch (error) {
  //     console.error('Error extracting token:', error);
  //     return null;
  //   }
  // };

  // const sendToBackend = async (authData: any) => {
  //   try {
  //     console.log('🔄 Sending to backend...');
      
  //     const response = await fetch('http://192.168.1.7:3000/api/auth/google', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(authData),
  //     });

  //     const data = await response.json();
  //     console.log('✅ Backend response:', data);

  //     if (data.ok) {
  //       Alert.alert('Success! 🎉', `Welcome ${data.user?.first_name || data.user?.email}!`);
  //       // TODO: Store token and navigate
  //     } else {
  //       Alert.alert('Login Failed', data.error || 'Unknown server error');
  //     }
  //   } catch (error) {
  //     console.error('❌ Backend error:', error);
  //     Alert.alert('Connection Error', 'Could not connect to server');
  //   } finally {
  //     setGoogleLoading(false);
  //   }
  // };

  // ======= HANDLE SIGN IN SECTION =======//
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Add this to dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const dismissKeyboardAndBlur = () => {
    emailRef.current?.blur();
    passwordRef.current?.blur();
    Keyboard.dismiss();
  };

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
      // console.log('Attempting login...');
      const data = await login(email, password);
      const { token, user } = data;

      // console.log('Login successful:', user);
      
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
      <TouchableWithoutFeedback onPress={dismissKeyboardAndBlur}>
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
          </View>

          <View style={styles.formContainer}>
            <TextInput
              ref={emailRef}
              placeholder='Email' 
              value={email}
              onChangeText={setEmail}           
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
              style={[
                styles.textInput,
                isEmailFocused && styles.textInputFocused
              ]}
              onFocus={() => {
                setIsEmailFocused(true);
              }}
              onBlur={() => {
                setIsEmailFocused(false);
              }}
            />

            <TextInput
              ref={passwordRef}
              placeholder='Password' 
              value={password}
              onChangeText={setPassword} 
              secureTextEntry={true}
              autoComplete="password"
              editable={!loading}
              style={[
                styles.textInput,
                isPasswordFocused && styles.textInputFocused
              ]}
              onFocus={() => {
                setIsPasswordFocused(true);
              }}
              onBlur={() => {
                setIsPasswordFocused(false);
              }}
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

          {/* <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

           <View style={styles.continueContainer}>
            <TouchableOpacity 
              style={styles.googleBtn}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <Image
                source={require('../../assets/google.png')}
                style={{
                  width: wp('6%'),
                  height: wp('6%'),
                }}
                resizeMode='contain'
              />
              <Text style={styles.googleText}>
                {googleLoading ? 'Signing in...' : 'Sign in with Google'}
              </Text>
            </TouchableOpacity>
          </View> */}

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
       </TouchableWithoutFeedback>
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
    fontSize: wp('4%'),
    borderRadius: wp('10%'),
    borderColor: colors.border,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: colors.white,
  },

  textInputFocused: {
    elevation: 5,
    borderWidth: 2,
    shadowRadius: 4,
    shadowOpacity: 0.3,
    shadowColor: colors.indicator,
    borderColor: colors.facebookBtn,
    shadowOffset: { width: 0, height: 2 },
  },

  submitBtn: {
    width: wp('80%'),
    fontSize: wp('4%'),
    marginTop: hp('0.7%'),
    borderRadius: wp('50%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: colors.button,
  },

  submitText: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    color: colors.white,
  },

  topText: {},

  loginContainer: {
    bottom: hp('3%'),
    width: wp('100%'),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginText: {},
  
  loginLink: {
    fontWeight: 'bold',
  },
});

export default SignIn;