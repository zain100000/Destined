import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  useColorScheme,
} from 'react-native';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../../utils/customComponents/customHeader/Header';
import ImageUploadModal from '../../../utils/customModals/ImageUploadModal';
import InputField from '../../../utils/customComponents/customInputField/InputField';
import {
  validateFirstName,
  validateLastName,
} from '../../../utils/customValidations/Validations';
import Button from '../../../utils/customComponents/customButton/Button';
import {updateUser} from '../../../redux/slices/userSlice';
import CustomModal from '../../../utils/customModals/CustomModal';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const {width, height} = Dimensions.get('screen');

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const user = route.params.user;
  const isDark = colorScheme === 'dark';

  const [photoURL, setPhotoURL] = useState('');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [newImageURL, setNewImageURL] = useState('');
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const handleFieldChange = () => {
    setIsEdited(true);
  };

  const isUpdateEnabled = () => {
    return isEdited;
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageURL(url);
    setPhotoURL(url);
    setIsEdited(true);
  };

  const handleFirstNameChange = value => {
    setFirstName(value);
    handleFieldChange();
    const error = validateFirstName(value);
    setFirstNameError(error);
  };

  const handleLastNameChange = value => {
    setLastName(value);
    handleFieldChange();
    const error = validateLastName(value);
    setLastNameError(error);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setShowAuthModal(true);

    const formData = new FormData();
    if (firstName) formData.append('firstName', firstName);
    if (lastName) formData.append('lastName', lastName);
    if (newImageURL) {
      formData.append('profilePicture', {
        uri: newImageURL,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const resultAction = await dispatch(
        updateUser({userId: user._id, formData}),
      );

      if (updateUser.fulfilled.match(resultAction)) {
        setShowAuthModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }, 3000);
      } else {
        setShowAuthModal(false);
      }
    } catch (err) {
      setShowAuthModal(false);
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
        <Header
          logo={require('../../../assets/icons/heart.png')}
          title="My Profile"
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.imgContainer}
          activeOpacity={0.9}
          onPress={handleImagePress}>
          {(user.profilePicture || newImageURL || photoURL) && (
            <Image
              source={{uri: newImageURL || photoURL || user.profilePicture}}
              style={styles.img}
            />
          )}
        </TouchableOpacity>

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.formContainer}>
          <View style={styles.firstNameContainer}>
            <InputField
              label="First Name"
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
          </View>

          <View style={styles.lastNameContainer}>
            <InputField
              label="Last Name"
              value={lastName}
              onChangeText={handleLastNameChange}
              leftIcon={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={width * 0.05}
                  color={theme.colors.primary}
                />
              }
            />
            {lastNameError && (
              <Text style={globalStyles.textError}>{lastNameError}</Text>
            )}
          </View>

          <View style={styles.ageContainer}>
            <InputField
              label="Age"
              value={age}
              keyboardType="numeric"
              onChangeText={setAge}
              editable={false}
              leftIcon={
                <MaterialCommunityIcons
                  name="cake"
                  size={width * 0.05}
                  color={theme.colors.primary}
                />
              }
            />
          </View>

          <View style={styles.phoneContainer}>
            <InputField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              editable={false}
              leftIcon={
                <MaterialCommunityIcons
                  name="phone"
                  size={width * 0.05}
                  color={theme.colors.primary}
                />
              }
            />
          </View>

          <View style={styles.emailContainer}>
            <InputField
              label="Email"
              value={user?.email}
              editable={false}
              leftIcon={
                <MaterialCommunityIcons
                  name="email"
                  size={width * 0.05}
                  color={theme.colors.primary}
                />
              }
            />
          </View>

          <View style={styles.genderContainer}>
            <InputField
              label="Gender"
              value={gender}
              onChangeText={setGender}
              editable={false}
              leftIcon={
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={width * 0.05}
                  color={theme.colors.primary}
                />
              }
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Update Profile"
              loading={loading}
              disabled={!isUpdateEnabled()}
              width={width * 0.94}
              onPress={handleUpdate}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </View>
        </Animatable.View>
      </ScrollView>

      <CustomModal
        visible={showAuthModal}
        title="Updating..."
        description="Please wait while we update your profile"
        animationSource={require('../../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Profile updated successfully"
        animationSource={require('../../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUpload={handleImageUpload}
        title="Upload Image"
        description="Choose a new profile picture"
      />
    </LinearGradient>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  scrollContent: {
    marginTop: height * 0.02,
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.02,
    gap: theme.gap(2),
  },

  imgContainer: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: width * 0.18,
    borderWidth: 4,
    borderColor: theme.colors.white,
    overflow: 'hidden',
    marginBottom: height * 0.03,
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    alignSelf: 'center',
  },

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  formContainer: {
    gap: theme.gap(1),
  },

  buttonContainer: {
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
});
