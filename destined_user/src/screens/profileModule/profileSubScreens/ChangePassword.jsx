import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  useColorScheme,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import AuthHeader from '../../../utils/customComponents/customHeader/AuthHeader';
import InputField from '../../../utils/customComponents/customInputField/InputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../utils/customComponents/customButton/Button';
import CustomModal from '../../../utils/customModals/CustomModal';
import {
  validatePassword,
  isValidInput,
} from '../../../utils/customValidations/Validations';
import {changePassword, getUser} from '../../../redux/slices/userSlice';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('screen');

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  useEffect(() => {
    const hasErrors =
      oldPasswordError || newPasswordError || !oldPassword || !newPassword;
    setIsButtonEnabled(!hasErrors);
  }, [oldPasswordError, newPasswordError, oldPassword, newPassword]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const handleOldPasswordChange = value => {
    setOldPassword(value);
    setOldPasswordError(validatePassword(value));
  };

  const handleNewPasswordChange = value => {
    setNewPassword(value);
    setNewPasswordError(validatePassword(value));
  };

  const handleChangePassword = async () => {
    if (!isValidInput(oldPassword, newPassword)) return;

    setLoading(true);
    setShowAuthModal(true);

    try {
      const formData = {
        oldPassword,
        newPassword,
      };

      const resultAction = await dispatch(changePassword({formData}));

      if (changePassword.fulfilled.match(resultAction)) {
        setOldPassword('');
        setNewPassword('');
        setShowAuthModal(false);
        setShowSuccessModal(true);

        setTimeout(async () => {
          setShowSuccessModal(false);

          try {
            await AsyncStorage.removeItem('authToken');

            navigation.reset({
              index: 0,
              routes: [{name: 'Signin'}],
            });
          } catch (storageErr) {
            console.error('❌ Failed to remove token:', storageErr);
          }
        }, 2500);
      } else {
        setShowAuthModal(false);
        setShowErrorModal(true);

        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      }
    } catch (err) {
      setShowAuthModal(false);
      setShowErrorModal(true);

      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
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
          title="CHANGE PASSWORD"
          description="Update your password securely"
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
          style={styles.inputContainer}>
          <Text
            style={[
              globalStyles.inputLabel,
              {color: isDark ? theme.colors.white : theme.colors.dark},
            ]}>
            Old Password
          </Text>
          <InputField
            placeholder="Old Password"
            value={oldPassword}
            onChangeText={handleOldPasswordChange}
            secureTextEntry={hideOldPassword}
            leftIcon={
              <MaterialCommunityIcons
                name="lock"
                size={width * 0.044}
                color={theme.colors.primary}
              />
            }
            rightIcon={
              <MaterialCommunityIcons
                name={hideOldPassword ? 'eye-off' : 'eye'}
                size={width * 0.054}
                color={theme.colors.primary}
              />
            }
            onRightIconPress={() => setHideOldPassword(!hideOldPassword)}
          />
          {oldPasswordError && (
            <Text style={globalStyles.textError}>{oldPasswordError}</Text>
          )}
        </Animatable.View>

        <Animatable.View
          animation="fadeInRight"
          duration={800}
          delay={700}
          style={styles.inputContainer}>
          <Text
            style={[
              globalStyles.inputLabel,
              {color: isDark ? theme.colors.white : theme.colors.dark},
            ]}>
            New Password
          </Text>
          <InputField
            placeholder="New Password"
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            secureTextEntry={hideNewPassword}
            leftIcon={
              <MaterialCommunityIcons
                name="lock-check"
                size={width * 0.044}
                color={theme.colors.primary}
              />
            }
            rightIcon={
              <MaterialCommunityIcons
                name={hideNewPassword ? 'eye-off' : 'eye'}
                size={width * 0.054}
                color={theme.colors.primary}
              />
            }
            onRightIconPress={() => setHideNewPassword(!hideNewPassword)}
          />
          {newPasswordError && (
            <Text style={globalStyles.textError}>{newPasswordError}</Text>
          )}
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={900}
          style={styles.btnContainer}>
          <Button
            title="UPDATE PASSWORD"
            width={width * 0.95}
            loading={loading}
            onPress={handleChangePassword}
            disabled={!isButtonEnabled}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.white}
          />
        </Animatable.View>
      </Animatable.View>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please wait while we're changing your password."
        animationSource={require('../../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Password changed successfully"
        animationSource={require('../../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <CustomModal
        visible={showErrorModal}
        title="Error!"
        description="Failed to change password. Please try again later."
        animationSource={require('../../../assets/animations/error.json')}
        onClose={() => setShowErrorModal(false)}
      />
    </LinearGradient>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerContainer: {
    marginTop: height * 0.04,
  },

  formContainer: {
    gap: theme.gap(3),
    padding: height * 0.012,
  },

  inputContainer: {
    marginBottom: height * 0.01,
  },

  btnContainer: {
    marginTop: height * 0.04,
  },
});
