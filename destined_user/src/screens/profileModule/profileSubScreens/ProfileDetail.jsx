import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
  useColorScheme,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../../utils/customComponents/customHeader/Header';
import ImageUploadModal from '../../../utils/customModals/ImageUploadModal';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '../../../utils/customModals/CustomModal';
import {updateUser} from '../../../redux/slices/userSlice';
import TabBar from '../../../utils/customComponents/customTabBar/TabBar';
import Pictures from '../../homeModule/mediaModule/Pictures';
import Videos from '../../homeModule/mediaModule/Videos';
import InputField from '../../../utils/customComponents/customInputField/InputField';
import DateTimePicker from '@react-native-community/datetimepicker';

const {width, height} = Dimensions.get('screen');

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();
  const user = route.params.user;
  const isDark = colorScheme === 'dark';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const [newImageURL, setNewImageURL] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeTab, setActiveTab] = useState('Pictures');
  const [editName, setEditName] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editDob, setEditDob] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState(
    `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  );
  const [bio, setBio] = useState(user.bio || 'Bio');
  const [city, setCity] = useState(user.city || 'City');
  const [dob, setDob] = useState(user.dob || 'Date of Birth');
  const [age, setAge] = useState(user.age);
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);
  const [tempCity, setTempCity] = useState(city);
  const [tempDob, setTempDob] = useState(new Date());

  const tabs = [
    {value: 'Pictures', label: 'Pictures', icon: 'photo-library'},
    {value: 'Videos', label: 'Videos', icon: 'video-library'},
  ];

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [colorScheme, fadeAnim, slideAnim, scaleAnim, borderAnim]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = async images => {
    setShowImageUploadModal(false);
    const imagePaths = images.map(image => ({uri: image.path}));
    setSelectedImages(imagePaths);
    setNewImageURL(imagePaths[0]?.uri || '');
    await handleUploadPicture(imagePaths);
  };

  const handleUploadPicture = async (images = selectedImages) => {
    if (images.length === 0) {
      return;
    }

    setLoading(true);
    setShowAuthModal(true);

    const formData = new FormData();
    formData.append('profilePicture', {
      uri: images[0].uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    try {
      const resultAction = await dispatch(
        updateUser({userId: user._id, formData}),
      );

      if (updateUser.fulfilled.match(resultAction)) {
        setShowAuthModal(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
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

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      const [firstName, ...lastNameArr] = tempName.trim().split(' ');
      const lastName = lastNameArr.join(' ');
      const resultAction = await dispatch(
        updateUser({
          userId: user._id,
          formData: {firstName, lastName},
        }),
      );
      if (updateUser.fulfilled.match(resultAction)) {
        setName(tempName);
        setEditName(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(
        updateUser({
          userId: user._id,
          formData: {bio: tempBio},
        }),
      );
      if (updateUser.fulfilled.match(resultAction)) {
        setBio(tempBio);
        setEditBio(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCity = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(
        updateUser({
          userId: user._id,
          formData: {city: tempCity},
        }),
      );
      if (updateUser.fulfilled.match(resultAction)) {
        setCity(tempCity);
        setEditCity(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDob = async () => {
    setLoading(true);
    try {
      setDob(tempDob);

      const resultAction = await dispatch(
        updateUser({
          userId: user._id,
          formData: {dob: tempDob},
        }),
      );

      if (updateUser.fulfilled.match(resultAction)) {
        const updatedUser = resultAction.payload;
        setAge(updatedUser.age);

        setEditDob(false);
      }
    } catch (error) {
      console.error('Error updating DOB:', error);

      setDob(dob);
      setAge(calculateAge(dob));
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Pictures':
        return <Pictures user={user} />;
      case 'Videos':
        return <Videos user={user} />;
      default:
        return null;
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
        <View style={styles.profileContainer}>
          <View style={styles.profilePictureContainer}>
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}, {scale: scaleAnim}],
                },
              ]}>
              <TouchableOpacity activeOpacity={1}>
                {(user.profilePicture || newImageURL) && (
                  <View style={styles.imageBorder}>
                    <Image
                      source={{uri: newImageURL || user.profilePicture}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.cameraIconContainer}
                  onPress={handleImagePress}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={width * 0.06}
                    color={isDark ? theme.colors.white : theme.colors.white}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <View style={styles.metric}>
                <View style={styles.metricRow}>
                  <View style={styles.metricIcon}>
                    <MaterialCommunityIcons
                      name="heart"
                      size={width * 0.06}
                      color={isDark ? theme.colors.error : theme.colors.error}
                    />
                  </View>
                  <Text
                    style={[
                      styles.metricValue,
                      {
                        color: isDark ? theme.colors.white : theme.colors.error,
                      },
                    ]}>
                    {user.totalLikesReceived}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.metricLabel,
                    {
                      color: isDark ? theme.colors.white : theme.colors.error,
                    },
                  ]}>
                  Likes
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.personalInfoContainer}>
          <View style={styles.nameContainer}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              }}>
              <View style={styles.nameRow}>
                {editName ? (
                  <View style={styles.editContainer}>
                    <InputField
                      style={[
                        styles.editInput,
                        {
                          color: isDark
                            ? theme.colors.white
                            : theme.darkMode.primaryDark,
                        },
                      ]}
                      value={tempName}
                      onChangeText={setTempName}
                    />
                    <View style={styles.editIcons}>
                      <TouchableOpacity
                        onPress={() => {
                          setEditName(false);
                          setTempName(name);
                        }}>
                        <MaterialCommunityIcons
                          name="close"
                          size={width * 0.06}
                          color={
                            isDark ? theme.colors.white : theme.colors.primary
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleUpdateName}>
                        <MaterialCommunityIcons
                          name="check"
                          size={width * 0.06}
                          color={
                            isDark ? theme.colors.white : theme.colors.primary
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.name,
                        {
                          color: isDark
                            ? theme.colors.white
                            : theme.darkMode.primaryDark,
                        },
                      ]}>
                      {name}
                    </Text>
                    <TouchableOpacity onPress={() => setEditName(true)}>
                      <MaterialCommunityIcons
                        name="pencil"
                        size={width * 0.06}
                        color={
                          isDark ? theme.colors.white : theme.colors.primary
                        }
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Animated.View>
          </View>

          <View style={styles.additionalInfoContainer}>
            <Animated.View
              style={[
                styles.editableFieldsContainer,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.fieldRow}>
                <View style={styles.fieldContainer}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={width * 0.06}
                    color={isDark ? theme.colors.white : theme.colors.primary}
                    style={styles.contactIcon}
                  />
                  {editDob ? (
                    <View style={styles.editContainer}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{flex: 1}}>
                        <InputField
                          editable={false}
                          pointerEvents="none"
                          style={[
                            styles.editInput,
                            {
                              color: isDark
                                ? theme.colors.white
                                : theme.colors.text,
                            },
                          ]}
                          value={tempDob.toISOString().split('T')[0]}
                        />
                      </TouchableOpacity>
                      <View style={styles.editIcons}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditDob(false);
                            setTempDob(new Date(dob));
                          }}>
                          <MaterialCommunityIcons
                            name="close"
                            size={width * 0.06}
                            color={
                              isDark ? theme.colors.white : theme.colors.primary
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUpdateDob}>
                          <MaterialCommunityIcons
                            name="check"
                            size={width * 0.06}
                            color={
                              isDark ? theme.colors.white : theme.colors.primary
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.contactText,
                        {
                          color: isDark
                            ? theme.colors.white
                            : theme.colors.text,
                        },
                      ]}>
                      {new Date(dob).toISOString().split('T')[0]}
                    </Text>
                  )}
                </View>
                {!editDob && (
                  <TouchableOpacity onPress={() => setEditDob(true)}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={width * 0.06}
                      color={isDark ? theme.colors.white : theme.colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldContainer}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={width * 0.06}
                    color={isDark ? theme.colors.white : theme.colors.primary}
                    style={styles.contactIcon}
                  />
                  {editCity ? (
                    <View style={styles.editContainer}>
                      <InputField
                        style={[
                          styles.editInput,
                          {
                            color: isDark
                              ? theme.colors.white
                              : theme.colors.text,
                          },
                        ]}
                        value={tempCity}
                        onChangeText={setTempCity}
                      />
                      <View style={styles.editIcons}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditCity(false);
                            setTempCity(city);
                          }}>
                          <MaterialCommunityIcons
                            name="close"
                            size={width * 0.06}
                            color={
                              isDark ? theme.colors.white : theme.colors.primary
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUpdateCity}>
                          <MaterialCommunityIcons
                            name="check"
                            size={width * 0.06}
                            color={
                              isDark ? theme.colors.white : theme.colors.primary
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.contactText,
                        {
                          color: isDark
                            ? theme.colors.white
                            : theme.colors.text,
                        },
                      ]}>
                      {city}
                    </Text>
                  )}
                </View>
                {!editCity && (
                  <TouchableOpacity onPress={() => setEditCity(true)}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={width * 0.06}
                      color={isDark ? theme.colors.white : theme.colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.contactInfoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="phone"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.contactIcon}
                />
                <Text
                  style={[
                    styles.contactText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {user.phone || 'Contact Number'}
                </Text>
              </View>

              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="email"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.contactIcon}
                />
                <Text
                  style={[
                    styles.contactText,
                    {
                      color: isDark ? theme.colors.white : theme.colors.dark,
                    },
                  ]}>
                  {user.email || 'Email'}
                </Text>
              </View>

              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.contactIcon}
                />
                <Text
                  style={[
                    styles.contactText,
                    {
                      color: isDark ? theme.colors.white : theme.colors.dark,
                    },
                  ]}>
                  {age || 'Age'}
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.contactInfoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              <View style={styles.contactRow}>
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.contactIcon}
                />
                <Text
                  style={[
                    styles.contactText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {user.gender || 'Gender'}
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Animated.View
            style={[
              styles.bioContainer,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark
                    ? theme.colors.white
                    : theme.darkMode.primaryDark,
                },
              ]}>
              Bio
            </Text>
            <View style={styles.bioEditContainer}>
              {editBio ? (
                <View style={styles.editContainer}>
                  <InputField
                    style={[
                      styles.editInput,
                      styles.bioInput,
                      {
                        color: isDark ? theme.colors.white : theme.colors.text,
                      },
                    ]}
                    value={tempBio}
                    onChangeText={setTempBio}
                    multiline
                  />
                  <View style={styles.editIcons}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditBio(false);
                        setTempBio(bio);
                      }}>
                      <MaterialCommunityIcons
                        name="close"
                        size={width * 0.06}
                        color={
                          isDark ? theme.colors.white : theme.colors.primary
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdateBio}>
                      <MaterialCommunityIcons
                        name="check"
                        size={width * 0.06}
                        color={
                          isDark ? theme.colors.white : theme.colors.primary
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text
                  style={[
                    styles.bioText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {bio}
                </Text>
              )}
              {!editBio && (
                <TouchableOpacity onPress={() => setEditBio(true)}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={width * 0.06}
                    color={isDark ? theme.colors.white : theme.colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>

        <View style={styles.interestContainer}>
          <View style={styles.section}>
            <Text
              style={[
                styles.heading,
                {color: isDark ? theme.colors.white : theme.colors.primary},
              ]}>
              Interests
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.interestScroll}>
              <View style={styles.interestRow}>
                {user.interests?.map((item, index) => (
                  <Animated.View
                    key={item._id}
                    style={[
                      styles.interestChip,
                      {
                        backgroundColor: isDark
                          ? theme.colors.white
                          : theme.darkMode.primaryDark,
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20 * (index + 1), 0],
                            }),
                          },
                        ],
                        opacity: fadeAnim,
                      },
                    ]}>
                    <Text
                      style={{
                        color: isDark
                          ? theme.darkMode.primaryDark
                          : theme.colors.white,
                        fontSize: theme.typography.fontSize.sm,
                        fontFamily: theme.typography.fontFamilyMedium,
                      }}>
                      {item.interest}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={styles.tabWrapper}>
          <Text
            style={[
              styles.heading,
              {color: isDark ? theme.colors.white : theme.colors.primary},
            ]}>
            Media
          </Text>
          <View style={styles.tabsContainer}>
            <TabBar
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onTabChange={tab => setActiveTab(tab)}
              tabWidth={width * 0.24}
            />
          </View>
        </View>

        <Animated.View
          style={[
            styles.tabContentContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}>
          {renderTabContent()}
        </Animated.View>
      </ScrollView>

      <CustomModal
        visible={showAuthModal}
        title="Uploading"
        description="Please wait while we upload your profile picture"
        animationSource={require('../../../assets/animations/loading.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Profile picture uploaded successfully"
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

      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={tempDob}
              onChange={(event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                  setTempDob(selectedDate);
                  setShowDatePicker(false);
                }
              }}
              mode="date"
              maximumDate={new Date()}
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  scrollContent: {
    justifyContent: 'center',
  },

  imageContainer: {
    width: width * 0.74,
    height: height * 0.3,
  },

  imageBorder: {
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  image: {
    width: width * 0.74,
    height: height * 0.3,
  },

  cameraIconContainer: {
    position: 'absolute',
    bottom: height * 0.02,
    right: width * 0.04,
    backgroundColor: theme.colors.primary,
    padding: height * 0.02,
    borderRadius: theme.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileContainer: {
    flexDirection: 'row',
  },

  metricsContainer: {
    flexDirection: 'column',
    marginTop: height * 0.02,
    width: '100%',
    gap: theme.gap(4),
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.gray,
  },

  metric: {
    left: width * 0.06,
  },

  metricItem: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.gray,
  },

  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(0.2),
  },

  metricIcon: {
    top: height * 0.002,
  },

  metricValue: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
  },

  metricLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
    marginTop: height * 0.005,
    marginBottom: height * 0.005,
  },

  nameRow: {
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
  },

  contactInfoContainer: {
    width: '100%',
    paddingHorizontal: width * 0.04,
    gap: theme.gap(2),
  },

  editableFieldsContainer: {
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: width * 0.04,
    gap: theme.gap(2),
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(1),
  },

  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(0.4),
  },

  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.gap(0.4),
  },

  contactText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  additionalInfoContainer: {
    gap: theme.gap(2),
  },

  bioContainer: {
    width: width * 0.9,
    paddingHorizontal: width * 0.028,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },

  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
    marginBottom: height * 0.01,
  },

  bioText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: height * 0.025,
  },

  heading: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
    left: width * 0.06,
  },

  bodyText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: height * 0.03,
  },

  interestRow: {
    flexDirection: 'row',
    gap: theme.gap(1),
  },

  interestScroll: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.014,
  },

  interestChip: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.014,
    borderRadius: width * 0.04,
  },

  tabWrapper: {
    marginTop: height * 0.03,
    marginLeft: width * 0.02,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.lightGray,
    paddingVertical: height * 0.015,
  },

  tabsContainer: {
    marginLeft: width * 0.04,
  },

  tabContentContainer: {
    marginTop: height * 0.02,
  },

  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(1),
    flex: 1,
  },

  editInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.gray,
    paddingVertical: height * 0.005,
  },

  bioInput: {
    textAlignVertical: 'top',
  },

  editIcons: {
    flexDirection: 'row',
    gap: theme.gap(1),
  },

  bioEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.86,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  datePickerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: width * 0.04,
    alignItems: 'center',
  },

  closeButton: {
    marginTop: height * 0.02,
    padding: width * 0.02,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },

  closeButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyMedium,
  },
});
