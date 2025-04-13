import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import AuthHeader from '../../utils/customComponents/customHeader/AuthHeader';
import InputField from '../../utils/customComponents/customInputField/InputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../utils/customComponents/customButton/Button';
import {useNavigation} from '@react-navigation/native';
import {
  validatePhone,
  validatePassword,
  isValidInput,
} from '../../utils/customValidations/Validations';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../redux/slices/authSlice';
import CustomModal from '../../utils/customModals/CustomModal';

const {width, height} = Dimensions.get('screen');

const Signin = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  useEffect(() => {
    const hasErrors = phoneError || passwordError || !phone || !password;
    setIsButtonEnabled(!hasErrors);
  }, [phoneError, passwordError, phone, password]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const handlePhoneChange = value => {
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleLogin = async () => {
    if (isValidInput(phone, password)) {
      setLoading(true);
      setShowAuthModal(true);
      try {
        const resultAction = await dispatch(loginUser({phone, password}));
        if (loginUser.fulfilled.match(resultAction)) {
          setShowAuthModal(false);
          setShowSuccessModal(true);
          setPhone('');
          setPassword('');
          setTimeout(() => {
            setShowSuccessModal(false);
            navigation.replace('Main');
          }, 3000);
        }
      } catch (err) {
        setShowAuthModal(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.headerContainer}>
        <AuthHeader
          title="SIGN IN"
          description="Login To Continue Your Journey With Us!"
        />
      </View>

      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        delay={300}
        style={styles.formContainer}>
        <Animatable.View
          animation="fadeInRight"
          duration={800}
          delay={500}
          style={styles.phoneContainer}>
          <Text
            style={[
              globalStyles.inputLabel,
              {color: isDark ? theme.colors.white : theme.colors.dark},
            ]}>
            Phone Number
          </Text>
          <InputField
            placeholder="Phone"
            value={phone}
            onChangeText={handlePhoneChange}
            leftIcon={
              <MaterialCommunityIcons
                name={'phone'}
                size={width * 0.044}
                color={theme.colors.primary}
              />
            }
          />
          {phoneError && (
            <Text style={globalStyles.textError}>{phoneError}</Text>
          )}
        </Animatable.View>

        <Animatable.View
          animation="fadeInRight"
          duration={800}
          delay={700}
          style={styles.passwordContainer}>
          <Text
            style={[
              globalStyles.inputLabel,
              {color: isDark ? theme.colors.white : theme.colors.dark},
            ]}>
            Password
          </Text>
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={hidePassword}
            leftIcon={
              <MaterialCommunityIcons
                name={'lock'}
                size={width * 0.044}
                color={theme.colors.primary}
              />
            }
            rightIcon={
              <MaterialCommunityIcons
                name={hidePassword ? 'eye-off' : 'eye'}
                size={width * 0.054}
                color={theme.colors.primary}
              />
            }
            onRightIconPress={() => setHidePassword(!hidePassword)}
          />
          {passwordError && (
            <Text style={globalStyles.textError}>{passwordError}</Text>
          )}
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={900}
          style={styles.btnContainer}>
          <Button
            title="SIGN IN"
            width={width * 0.95}
            loading={loading}
            onPress={handleLogin}
            disabled={!isButtonEnabled}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.white}
          />
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={1100}
          style={styles.signupContainer}>
          <Text
            style={[
              styles.signupText,
              {color: isDark ? theme.colors.white : theme.colors.primary},
            ]}>
            Didn't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.9}>
            <Text
              style={[
                styles.signupLink,
                {color: isDark ? theme.colors.white : theme.colors.primary},
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please wait while log into your account."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Login successfully"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />
    </LinearGradient>
  );
};

export default Signin;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.024,
  },

  headerContainer: {
    marginTop: height * 0.04,
  },

  formContainer: {
    gap: theme.gap(3),
    padding: height * 0.012,
  },

  btnContainer: {
    marginTop: height * 0.04,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.05,
  },

  signupText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  signupLink: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyBold,
  },
});
