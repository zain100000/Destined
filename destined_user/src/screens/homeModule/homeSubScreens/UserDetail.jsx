import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import {useRoute, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TabBar from '../../../utils/customComponents/customTabBar/TabBar';
import Pictures from '../mediaModule/Pictures';
import Videos from '../mediaModule/Videos';

const {width, height} = Dimensions.get('screen');

const UserDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState('Pictures');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const {userDetails} = route.params;

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [colorScheme]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const tabs = [
    {value: 'Pictures', label: 'Pictures', icon: 'photo-library'},
    {value: 'Videos', label: 'Videos', icon: 'video-library'},
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Pictures':
        return <Pictures userDetails={userDetails} />;
      case 'Videos':
        return <Videos userDetails={userDetails} />;
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.leftIconContainer}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={width * 0.08}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          ...styles.imageContainer,
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}, {scale: scaleAnim}],
        }}>
        <Animated.View
          style={[
            styles.imageBorder,
            {
              borderWidth,
              borderColor: isDark ? '#E91E63' : '#3F51B5',
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            },
          ]}>
          <Image
            source={{uri: userDetails?.profilePicture}}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          }}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                {
                  color: isDark
                    ? theme.colors.white
                    : theme.darkMode.primaryDark,
                  textShadowColor: isDark ? '#E91E63' : '#3F51B5',
                },
              ]}>
              {`${userDetails?.name || 'User'}`}
            </Text>

            <View style={styles.likesContainer}>
              <MaterialCommunityIcons
                name="heart"
                size={width * 0.06}
                color={isDark ? '#E91E63' : '#3F51B5'}
              />
              <Text
                style={[
                  styles.likes,
                  {
                    color: isDark ? '#E91E63' : '#3F51B5',
                  },
                ]}>
                {userDetails?.totalLikesReceived || '0'}
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            {/* Row 1 */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text
                  style={[
                    styles.infoText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {new Date(userDetails?.dob).toISOString().split('T')[0]}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="email"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text
                  style={[
                    styles.infoText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {userDetails?.email || 'Email'}
                </Text>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text
                  style={[
                    styles.infoText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {userDetails?.city || 'City'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text
                  style={[
                    styles.infoText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {userDetails?.age || 'Age'}
                </Text>
              </View>
            </View>

            {/* Row 3 */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="phone"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text
                  style={[
                    styles.infoText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {userDetails?.phone || 'Phone'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={width * 0.06}
                  color={isDark ? theme.colors.white : theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text
                  style={[
                    styles.infoText,
                    {color: isDark ? theme.colors.white : theme.colors.text},
                  ]}>
                  {userDetails?.gender || 'Gender'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.heading,
                {color: isDark ? theme.colors.white : theme.colors.primary},
              ]}>
              Bio
            </Text>
            <Text style={[styles.bodyText, {color: isDark ? '#ddd' : '#444'}]}>
              {userDetails?.bio || 'Not Available.'}
            </Text>
          </View>

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
              {userDetails?.interests?.map((item, index) => (
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
            </ScrollView>
          </View>

          <View style={styles.tabWrapper}>
            <Text
              style={[
                styles.heading,
                {color: isDark ? theme.colors.white : theme.colors.primary},
              ]}>
              Media
            </Text>
            <TabBar
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onTabChange={tab => setActiveTab(tab)}
              tabWidth={width * 0.24}
            />
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
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default UserDetail;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerContainer: {
    height: height * 0.08,
    justifyContent: 'center',
    paddingHorizontal: width * 0.04,
    backgroundColor: theme.colors.primary,
  },

  leftIconContainer: {
    width: width * 0.1,
  },

  imageContainer: {
    width: '100%',
    height: height * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: width * 1,
    height: height * 0.3,
  },

  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.06,
  },

  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },

  name: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilyBold,
  },

  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
  },

  likes: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilyBold,
    marginLeft: width * 0.01,
  },

  section: {
    marginVertical: height * 0.015,
  },

  heading: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilyBold,
    marginBottom: height * 0.005,
  },

  bodyText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    lineHeight: height * 0.03,
  },

  interestScroll: {
    gap: width * 0.02,
  },

  interestChip: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.014,
    borderRadius: width * 0.04,
  },

  tabWrapper: {
    marginTop: height * 0.03,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.lightGray,
    paddingVertical: height * 0.015,
  },

  tabContentContainer: {
    marginTop: height * 0.02,
  },

  infoContainer: {
    marginVertical: height * 0.01,
    gap: theme.gap(1)
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.014,
  },

  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    marginRight: width * 0.014,
  },

  infoText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamilyRegular,
  },
});
