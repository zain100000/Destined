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
import {validatePhone} from '../../utils/customValidations/Validations';
import InputField from '../../utils/customComponents/customInputField/InputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../utils/customComponents/customButton/Button';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {sendOTP, verifyOTP} from '../../redux/slices/authSlice';
import {getInterests} from '../../redux/slices/interestSlice';
import CustomModal from '../../utils/customModals/CustomModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ImageUploadModal from '../../utils/customModals/ImageUploadModal';
import InterestCard from '../../utils/customComponents/customCards/customInterestCard/InterestCard';

const {width, height} = Dimensions.get('screen');

const Signup = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const {interest} = useSelector(state => state.interest);

  useEffect(() => {
    dispatch(getInterests());
  }, [dispatch]);

  const isDark = colorScheme === 'dark';
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [newImageURL, setNewImageURL] = useState('');
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDOB] = useState('');
  const [password, setPassword] = useState('');

  const [selectedInterests, setSelectedInterests] = useState([]);

  const otpRefs = useRef([]);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);

  const steps = ['Phone', 'OTP', 'Details', 'Interest', 'Finish'];

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
    if (currentStep === 1) {
      setIsButtonEnabled(!phoneError && phone.length > 0);
    } else if (currentStep === 2) {
      setIsButtonEnabled(otp.every(digit => digit !== ''));
    } else if (currentStep === 3) {
      const allFieldsFilled =
        firstName !== '' &&
        lastName !== '' &&
        email !== '' &&
        gender !== '' &&
        dob !== '' &&
        password.length >= 6;
      setIsButtonEnabled(allFieldsFilled);
    }
  }, [
    currentStep,
    phone,
    phoneError,
    otp,
    firstName,
    lastName,
    email,
    gender,
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
      value: 'male',
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
      value: 'female',
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

  const handleGenderChange = selectedValue => {
    setGender(selectedValue);
  };

  const handlePhoneChange = value => {
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (phoneError) return;
      dispatch(sendOTP({phone}))
        .unwrap()
        .then(res => {
          setGeneratedOtp(res.otp);
        });
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      return;
    }

    if (currentStep === 2) {
      handleVerifyOtp();
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length));
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
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
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
                {color: isDark ? theme.colors.lightGray : theme.colors.gray},
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
                onChangeText={handlePhoneChange}
                leftIcon={
                  <MaterialCommunityIcons
                    name="phone"
                    size={width * 0.05}
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
              delay={600}
              style={styles.inputContainer}>
              <InputField
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                leftIcon={
                  <MaterialCommunityIcons
                    name="account"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={700}
              style={styles.inputContainer}>
              <InputField
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                leftIcon={
                  <MaterialCommunityIcons
                    name="account"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={800}
              style={styles.inputContainer}>
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon={
                  <MaterialCommunityIcons
                    name="email"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
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
            </Animatable.View>

            <Animatable.View
              animation="fadeInRight"
              duration={800}
              delay={1100}
              style={styles.inputContainer}>
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                leftIcon={
                  <MaterialCommunityIcons
                    name="lock"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
                rightIcon={
                  <MaterialCommunityIcons
                    name="eye-off"
                    size={width * 0.05}
                    color={theme.colors.primary}
                  />
                }
              />
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
              {color: isDark ? theme.colors.lightGray : theme.colors.gray},
            ]}>
            Share your interests with others
          </Text>

          <FlatList
            data={interest}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingBottom: 100}}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => toggleSelect(item)}>
                <InterestCard
                  interestName={item.replace(/_/g, ' ')}
                  // iconSource={require('../../assets/icons/placeholder-icon.png')} // Replace with actual icon
                  isSelected={selectedInterests.includes(item)}
                />
              </TouchableOpacity>
            )}
          />
        </Animatable.View>
      </SafeAreaView>
    );
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
      case 5:
        return renderCompleteStep();
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

  interestItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  interestText: {
    fontSize: 18,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: width * 1.1,
  },

  stepProgress: {
    height: height * 0.002,
  },

  stepCircle: {
    width: width * 0.08,
    height: height * 0.04,
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
