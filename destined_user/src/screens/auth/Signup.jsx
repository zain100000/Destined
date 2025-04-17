import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  useColorScheme,
  Dimensions,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import AuthHeader from '../../utils/customComponents/customHeader/AuthHeader';
import {
  validatePhone,
  validateFirstName,
  validateLastName,
  validateEmail,
  validateGender,
  validateDob,
  validatePassword,
} from '../../utils/customValidations/Validations';
import InputField from '../../utils/customComponents/customInputField/InputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../utils/customComponents/customButton/Button';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser, sendOTP, verifyOTP} from '../../redux/slices/authSlice';
import {getInterests} from '../../redux/slices/interestSlice';
import CustomModal from '../../utils/customModals/CustomModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ImageUploadModal from '../../utils/customModals/ImageUploadModal';
import InterestCard from '../../utils/customComponents/customCards/customInterestCard/InterestCard';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const Signup = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const {interest} = useSelector(state => state.interest);

  useEffect(() => {
    dispatch(getInterests());
  }, [dispatch]);

  const isDark = colorScheme === 'dark';
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [newImageURL, setNewImageURL] = useState('');
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDOB] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [phoneError, setPhoneError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [dobError, setDobError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showRegisterAuthModal, setShowRegisterAuthModal] = useState(false);
  const [showRegisterSuccessModal, setShowRegisterSuccessModal] =
    useState(false);

  const otpRefs = useRef([]);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);

  const steps = ['Phone', 'OTP', 'Details', 'Interest'];

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / steps.length) * 100,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0 && currentStep === 2) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer, currentStep]);

  useEffect(() => {
    const hasErrors =
      phoneError ||
      firstNameError ||
      lastNameError ||
      emailError ||
      genderError || // This will trigger the button disabling if there's a gender error
      dobError ||
      passwordError ||
      !firstName ||
      !lastName ||
      !email ||
      !gender || // Check for an empty gender as well
      !dob ||
      !password;

    setIsButtonEnabled(!hasErrors);
  }, [
    phoneError,
    firstNameError,
    lastNameError,
    emailError,
    genderError, // Watch for genderError here
    dobError,
    passwordError,
    firstName,
    lastName,
    email,
    gender, // Watch for gender change as well
    dob,
    password,
  ]);

  const toggleSelect = item => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(prev => prev.filter(i => i !== item));
    } else {
      setSelectedInterests(prev => [...prev, item]);
    }
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageURL(url);
    setPhotoURL(url);
  };

  const genderOptions = () => [
    {
      label: 'Select Gender',
      value: '',
      icon: () => (
        <MaterialCommunityIcons
          name="gender-male-female-variant"
          size={20}
          color={theme.colors.primary}
        />
      ),
    },

    {
      label: 'Male',
      value: 'MALE',
      icon: () => (
        <MaterialCommunityIcons
          name="gender-male"
          size={20}
          color={theme.colors.primary}
        />
      ),
    },
    {
      label: 'Female',
      value: 'FEMALE',
      icon: () => (
        <MaterialCommunityIcons
          name="gender-female"
          size={20}
          color={theme.colors.primary}
        />
      ),
    },
  ];

  const formatDate = date => {
    if (!date) return '';
    return moment(date).format('DD/MM/YYYY');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDOB(selectedDate);
    }
  };

  const handlePhoneChange = text => {
    setPhone(text);
    setPhoneError(validatePhone(text));
  };

  const handleFirstNameChange = value => {
    setFirstName(value);
    setFirstNameError(validateFirstName(value));
  };

  const handleLastNameChange = value => {
    setLastName(value);
    setLastNameError(validateLastName(value));
  };

  const handleEmailChange = value => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleGenderChange = value => {
    setGender(value); // Update gender value
    const error = validateGender(value); // Validate gender
    setGenderError(error); // Update gender error state
  };

  const handleDobChange = value => {
    setDOB(value);
    setDobError(validateDob(value));
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  useEffect(() => {
    const isValid = !validatePhone(phone); // If no error, then valid
    setIsButtonEnabled(isValid);
  }, [phone]);

  const handleNext = () => {
    if (currentStep === 1) {
      const phoneValidationError = validatePhone(phone);
      setPhoneError(phoneValidationError);

      if (phoneValidationError) return;

      dispatch(sendOTP({phone}))
        .unwrap()
        .then(res => {
          setGeneratedOtp(res.otp);
        });

      setCurrentStep(prev => Math.min(prev + 1, steps.length + 1));
      return;
    }

    if (currentStep === 2) {
      handleVerifyOtp();
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length + 1));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResendOTP = () => {
    setResendTimer(10);

    const timerInterval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);

          dispatch(sendOTP({phone}))
            .unwrap()
            .then(res => {
              setGeneratedOtp(res.otp);
            });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setShowAuthModal(true);

    const enteredOtp = otp.join('');
    dispatch(verifyOTP({phone, otp: enteredOtp}))
      .unwrap()
      .then(res => {
        setLoading(false);
        setShowAuthModal(false);

        if (res.success) {
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
          }, 2000);
        } else {
          console.error('Invalid OTP');
        }
      })
      .catch(err => {
        setLoading(false);
        setShowAuthModal(false);
        console.error('Error verifying OTP:', err);
      });
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.stepTrack}>
          <Animated.View
            style={[
              styles.stepProgress,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </View>
        {steps.map((step, index) => (
          <Animatable.View
            key={index}
            animation="zoomIn"
            duration={800}
            delay={index * 100}
            style={[
              styles.stepCircle,
              {
                backgroundColor:
                  index + 1 <= currentStep
                    ? theme.colors.primary
                    : isDark
                    ? theme.colors.gray
                    : theme.colors.gray,
                borderColor: theme.colors.primary,
              },
            ]}>
            <Text
              style={[
                styles.stepText,
                {
                  color:
                    index + 1 <= currentStep
                      ? theme.colors.white
                      : isDark
                      ? theme.colors.white
                      : theme.colors.dark,
                },
              ]}>
              {index + 1}
            </Text>
          </Animatable.View>
        ))}
      </View>
    );
  };

  const renderStepLabels = () => {
    return (
      <View style={styles.stepLabelsContainer}>
        {steps.map((step, index) => (
          <Animatable.View
            key={index}
            animation="fadeIn"
            duration={800}
            delay={index * 100}
            style={styles.stepLabel}>
            <Text
              style={[
                styles.stepLabelText,
                {
                  color:
                    index + 1 <= currentStep
                      ? theme.colors.primary
                      : isDark
                      ? theme.colors.primary
                      : theme.colors.gray,
                  fontFamily:
                    index + 1 === currentStep
                      ? theme.typography.fontFamilySemiBold
                      : theme.typography.fontFamilyRegular,
                },
              ]}>
              {step}
            </Text>
          </Animatable.View>
        ))}
      </View>
    );
  };

  // Phone Step 1
  const renderPhoneStep = () => (
    <Animatable.View
      animation="fadeInRight"
      duration={800}
      style={styles.stepContainer}>
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
        keyboardType={'number-pad'}
        leftIcon={
          <MaterialCommunityIcons
            name="phone"
            size={width * 0.044}
            color={theme.colors.primary}
          />
        }
      />
      {phoneError && <Text style={globalStyles.textError}>{phoneError}</Text>}

      <View style={styles.btnContainer}>
        <Button
          title={
            currentStep === 2
              ? 'VERIFY'
              : currentStep === steps.length
              ? 'CONTINUE'
              : 'NEXT'
          }
          width={
            currentStep === 1 || currentStep === steps.length
              ? width * 0.95
              : width * 0.44
          }
          onPress={handleNext}
          disabled={!isButtonEnabled}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </View>
    </Animatable.View>
  );

  // OTP Step 2
  const renderOtpStep = () => (
    <Animatable.View
      animation="fadeInRight"
      duration={800}
      delay={200}
      style={styles.stepContainer}>
      <Text
        style={[
          styles.verifyText,
          {color: isDark ? theme.colors.white : theme.colors.dark},
        ]}>
        Verify
      </Text>
      <Text
        style={[
          styles.otpDescription,
          {color: isDark ? theme.colors.white : theme.colors.gray},
        ]}>
        Please enter the 4-digit code sent ({phone})
      </Text>
      <View style={{marginBottom: height * 0.02}}>
        <Text
          style={{
            color:
              colorScheme === 'dark'
                ? theme.colors.white
                : theme.colors.primary,
            fontSize: theme.typography.fontSize.lg,
            textAlign: 'center',
            fontFamily: theme.typography.fontFamilySemiBold,
          }}>
          {generatedOtp}
        </Text>
      </View>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (otpRefs.current[index] = ref)}
            value={digit}
            onChangeText={value => {
              const newOtp = [...otp];
              newOtp[index] = value;
              setOtp(newOtp);

              if (value && index < otp.length - 1) {
                otpRefs.current[index + 1]?.focus();
              }
            }}
            keyboardType="numeric"
            maxLength={1}
            style={[
              styles.otpInputField,
              {
                backgroundColor: digit
                  ? theme.colors.primary
                  : isDark
                  ? theme.colors.darkGray
                  : theme.colors.white,
                borderColor: digit ? theme.colors.primary : theme.colors.gray,
                color: digit
                  ? theme.colors.white
                  : isDark
                  ? theme.colors.white
                  : theme.colors.dark,
              },
            ]}
            textAlign="center"
          />
        ))}
      </View>
      <TouchableOpacity
        disabled={resendTimer > 0 || loading}
        onPress={handleResendOTP}
        style={[
          styles.resendOtpContainer,
          {
            backgroundColor:
              colorScheme === 'dark'
                ? theme.darkMode.primaryDark
                : theme.lightMode.primaryLight,
          },
        ]}>
        <Text
          style={[
            styles.resendText,
            {color: resendTimer > 0 ? theme.colors.white : theme.colors.white},
          ]}>
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.btnContainer}>
        {currentStep > 1 && currentStep < steps.length && (
          <Button
            title="BACK"
            width={width * 0.44}
            onPress={handleBack}
            backgroundColor={theme.colors.primary}
            textColor={theme.colors.white}
          />
        )}
        <Button
          title={
            currentStep === 2
              ? 'VERIFY'
              : currentStep === steps.length
              ? 'CONTINUE'
              : 'NEXT'
          }
          width={
            currentStep === 1 || currentStep === steps.length
              ? width * 0.95
              : width * 0.44
          }
          onPress={handleNext}
          disabled={!isButtonEnabled}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.white}
        />
      </View>
    </Animatable.View>
  );

  // Detail Step 3
  const renderDetailStep = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent]}>
          <Animatable.View
            animation="fadeInRight"
            duration={800}
            delay={200}
            style={styles.stepContainer}>
            <Text
              style={[
                styles.verifyText,
                {color: isDark ? theme.colors.white : theme.colors.dark},
              ]}>
              Personal Details
            </Text>
            <Text
              style={[
                styles.otpDescription,
                {color: isDark ? theme.colors.white : theme.colors.gray},
              ]}>
              Please Fill Up The Details To Register
            </Text>
          </Animatable.View>

          <View style={styles.formContainer}>
            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={500}
              style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.imgContainer}
                activeOpacity={0.9}
                onPress={handleImagePress}>
                {newImageURL || photoURL ? (
                  <Image
                    source={{uri: newImageURL || photoURL}}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={require('../../assets/placeholders/default-avatar.png')} // Path to your default avatar image
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={500}
              style={styles.inputContainer}>
              <InputField
                placeholder="Phone"
                value={phone}
                editable={false}
                onChangeText={handlePhoneChange}
                leftIcon={
                  <MaterialCommunityIcons
                    name="phone"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={600}
              style={styles.inputContainer}>
              <InputField
                placeholder="First Name"
                value={firstName}
                onChangeText={handleFirstNameChange}
                leftIcon={
                  <MaterialCommunityIcons
                    name="account"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
              {firstNameError && (
                <Text style={globalStyles.textError}>{firstNameError}</Text>
              )}
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={700}
              style={styles.inputContainer}>
              <InputField
                placeholder="Last Name"
                value={lastName}
                onChangeText={handleLastNameChange}
                leftIcon={
                  <MaterialCommunityIcons
                    name="account"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
              {lastNameError && (
                <Text style={globalStyles.textError}>{lastNameError}</Text>
              )}
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={800}
              style={styles.inputContainer}>
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                leftIcon={
                  <MaterialCommunityIcons
                    name="email"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
              {emailError && (
                <Text style={globalStyles.textError}>{emailError}</Text>
              )}
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={900}
              style={styles.inputContainer}>
              <InputField
                selectedValue={gender}
                onValueChange={handleGenderChange}
                dropdownOptions={genderOptions()}
              />
              {genderError && (
                <Text style={globalStyles.textError}>{genderError}</Text>
              )}
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={1000}
              style={styles.inputContainer}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Field clicked');
                  setShowDatePicker(true);
                }}
                activeOpacity={0.8}>
                <InputField
                  placeholder="Date of Birth (DD/MM/YYYY)"
                  value={formatDate(dob)}
                  editable={false}
                  pointerEvents="none"
                  leftIcon={
                    <MaterialCommunityIcons
                      name="calendar"
                      size={width * 0.05}
                      color={theme.colors.primary}
                    />
                  }
                />
              </TouchableOpacity>
              {dobError && (
                <Text style={globalStyles.textError}>{dobError}</Text>
              )}
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={1100}
              style={styles.inputContainer}>
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={hidePassword}
                leftIcon={
                  <MaterialCommunityIcons
                    name="lock"
                    size={width * 0.05}
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
          </View>

          <View style={styles.btnContainer}>
            {currentStep > 1 && currentStep < steps.length && (
              <Button
                title="BACK"
                width={width * 0.44}
                onPress={handleBack}
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.white}
              />
            )}
            <Button
              title={
                currentStep === 2
                  ? 'VERIFY'
                  : currentStep === steps.length
                  ? 'CONTINUE'
                  : 'NEXT'
              }
              width={
                currentStep === 1 || currentStep === steps.length
                  ? width * 0.95
                  : width * 0.44
              }
              onPress={handleNext}
              disabled={!isButtonEnabled}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );

  // Interests Step 4
  const renderInterestStep = () => {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent]}>
          <Animatable.View
            animation="fadeInRight"
            duration={800}
            delay={200}
            style={styles.stepContainer}>
            <Text
              style={[
                styles.verifyText,
                {color: isDark ? theme.colors.white : theme.colors.dark},
              ]}>
              Interests
            </Text>
            <Text
              style={[
                styles.otpDescription,
                {color: isDark ? theme.colors.white : theme.colors.gray},
              ]}>
              Share your interests with others
            </Text>

            <FlatList
              data={interest}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => toggleSelect(item)}>
                  <InterestCard
                    interestName={item.replace(/_/g, ' ')}
                    isSelected={selectedInterests.includes(item)}
                  />
                </TouchableOpacity>
              )}
            />
          </Animatable.View>

          <View style={styles.btnContainer}>
            {currentStep > 1 && currentStep <= steps.length && (
              <Button
                title="BACK"
                width={width * 0.44}
                onPress={handleBack}
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.white}
              />
            )}
            <Button
              title="SIGNUP"
              width={width * 0.44}
              onPress={handleRegister}
              disabled={!isButtonEnabled}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const handleRegister = async () => {
    // Validate all fields
    const validationErrors = {
      phone: validatePhone(phone),
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      email: validateEmail(email),
      gender: validateGender(gender),
      dob: validateDob(dob),
      password: validatePassword(password),
    };

    // Check if any validation errors exist
    const hasErrors = Object.values(validationErrors).some(
      error => error !== '',
    );

    // Validate interests
    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }

    if (hasErrors) {
      // Show first error found
      const firstError = Object.values(validationErrors).find(
        error => error !== '',
      );
      if (firstError) {
        Alert.alert('Validation Error', firstError);
      }
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('gender', gender);
    formData.append('dob', moment(dob).format('YYYY-MM-DD'));
    formData.append('email', email);
    formData.append('password', password);

    // Add interests
    selectedInterests.forEach((item, index) => {
      const interestValue = item.replace(/_/g, ' ');
      formData.append(`interests[${index}][interest]`, interestValue);
      formData.append(`interests[${index}][selectedOption]`, interestValue);
    });

    // Add profile picture if exists
    if (newImageURL) {
      const uriParts = newImageURL.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split('.').pop();
      formData.append('profilePicture', {
        uri: newImageURL,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      setLoading(true);
      setShowRegisterAuthModal(true);

      const resultAction = await dispatch(registerUser(formData));

      if (registerUser.fulfilled.match(resultAction)) {
        setShowRegisterAuthModal(false);
        setShowRegisterSuccessModal(true);

        setTimeout(() => {
          setShowRegisterSuccessModal(false);
          navigation.replace('Signin');
        }, 3000);
      } else {
        setShowRegisterAuthModal(false);
        Alert.alert(
          'Error',
          resultAction.error?.message ||
            'Registration failed. Please try again.',
        );
      }
    } catch (error) {
      setShowRegisterAuthModal(false);
      Alert.alert(
        'Registration Failed',
        error.message ||
          'Could not connect to server. Please check your internet connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return renderPhoneStep();
      case 2:
        return renderOtpStep();
      case 3:
        return renderDetailStep();
      case 4:
        return renderInterestStep();
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.primaryContainer}>
      <View style={styles.headerContainer}>
        <AuthHeader title="SIGN UP" description="Join Now & Start Matching!" />
      </View>

      <View style={styles.stepProgressContainer}>
        {renderStepIndicator()}
        {renderStepLabels()}
      </View>

      <View style={styles.formContainer}>{renderContent()}</View>

      <CustomModal
        visible={showAuthModal}
        title="Verifying"
        description="Please wait while we verify your OTP"
        animationSource={require('../../assets/animations/loading.json')}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="OTP Verified Successfully"
        animationSource={require('../../assets/animations/success.json')}
      />

      <CustomModal
        visible={showRegisterAuthModal}
        title="Working!"
        description="Please wait while we creating your account"
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowRegisterAuthModal(false)}
      />

      <CustomModal
        visible={showRegisterSuccessModal}
        title="Success!"
        description="Account Created Successfully! Wait for the admin approval!"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowRegisterSuccessModal(false)}
      />

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUpload={handleImageUpload}
        title="Upload Image!"
        description="Please Choose Your Profile Picture To Upload."
      />

      {showDatePicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </LinearGradient>
  );
};

export default Signup;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    paddingHorizontal: width * 0.024,
  },

  headerContainer: {
    marginTop: height * 0.04,
  },

  scrollContent: {
    paddingBottom: height * 0.3,
  },

  stepProgressContainer: {
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.024,
  },

  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },

  stepTrack: {
    position: 'absolute',
    height: height * 0,
    width: width * 0.9,
  },

  stepProgress: {
    height: height * 0.002,
  },

  stepCircle: {
    width: width * 0.08,
    height: height * 0.034,
    borderRadius: theme.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 1,
  },

  stepText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilySemiBold,
  },

  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },

  stepLabel: {
    width: width * 0.14,
  },

  stepLabelText: {
    fontSize: width * 0.034,
    textAlign: 'center',
  },

  stepContainer: {
    marginBottom: height * 0.02,
    paddingTop: height * 0.02,
  },

  verifyText: {
    fontSize: width * 0.06,
    fontFamily: theme.typography.fontFamilyBold,
    textAlign: 'center',
    marginBottom: height * 0.01,
  },

  otpDescription: {
    fontSize: width * 0.04,
    fontFamily: theme.typography.fontFamilyRegular,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.04,
  },

  otpInputField: {
    width: width * 0.18,
    height: width * 0.18,
    borderWidth: 2,
    borderRadius: 1000,
    fontSize: width * 0.06,
    marginHorizontal: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resendOtpContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignSelf: 'center',
    width: width * 0.48,
    padding: height * 0.014,
    borderRadius: theme.borderRadius.circle,
  },

  resendText: {
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: theme.typography.fontSize.md,
  },

  imgContainer: {
    marginBottom: height * 0.04,
    alignSelf: 'center',
  },

  image: {
    width: width * 0.24,
    height: width * 0.24,
    borderRadius: (width * 0.4) / 2,
    resizeMode: 'cover',
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.04,
    marginBottom: height * 0.04,
  },
});
