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
  Alert,
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
import {useDispatch} from 'react-redux';
import {sendOTP, verifyOTP} from '../../redux/slices/authSlice';

const {width, height} = Dimensions.get('screen');

const Signup = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(10);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const otpRefs = useRef([]);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);

  const steps = ['Phone', 'OTP', 'Details', 'Finish'];

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
      setIsButtonEnabled();
    }
  }, [currentStep, phone, phoneError, otp]);

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

    if (currentStep === steps.length) {
      console.log('Signup process completed');
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
    const enteredOtp = otp.join('');
    dispatch(verifyOTP({phone, otp: enteredOtp}))
      .unwrap()
      .then(res => {
        setLoading(false);
        if (res.success) {
          alert('OTP Verified Successfully');
          // setCurrentStep(prev => Math.min(prev + 1, steps.length));
        } else {
          alert('Invalid OTP');
        }
      })
      .catch(err => {
        setLoading(false);
        alert('Error verifying OTP');
        console.log('Error verifying OTP:', err);
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
        leftIcon={
          <MaterialCommunityIcons
            name="phone"
            size={width * 0.044}
            color={theme.colors.primary}
          />
        }
      />
      {phoneError && <Text style={globalStyles.textError}>{phoneError}</Text>}
    </Animatable.View>
  );

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
            color: theme.colors.primary,
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
    </Animatable.View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return renderPhoneStep();
      case 2:
        return renderOtpStep();
      case 3:
        return renderDetailsStep();
      case 4:
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

      <View style={styles.formContainer}>
        {renderContent()}

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
            loading={loading}
          />
        </View>
      </View>
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
    height: width * 0.08,
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 1,
  },

  stepText: {
    fontSize: width * 0.04,
    fontFamily: theme.typography.fontFamilySemiBold,
  },

  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },

  stepLabel: {
    width: width * 0.12,
  },

  stepLabelText: {
    fontSize: width * 0.035,
    textAlign: 'center',
  },

  stepContainer: {
    marginBottom: height * 0.02,
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

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.1,
  },
});
