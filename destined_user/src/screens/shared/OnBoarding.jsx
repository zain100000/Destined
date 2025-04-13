import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  useColorScheme,
  StatusBar,
  Text,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Button from '../../utils/customComponents/customButton/Button';
import {LinearGradient} from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('screen');

const images = {
  image1: require('../../assets/onBoardingScreen/onBoard-1.jpg'),
  image2: require('../../assets/onBoardingScreen/onBoard-2.jpg'),
  image3: require('../../assets/onBoardingScreen/onBoard-3.jpg'),
};

const slides = [
  {
    key: '1',
    image: images.image1,
    title: 'Love is Just a Swipe Away',
    description:
      'Connect with genuine people, spark real conversations. Your love story starts here.',
  },
  {
    key: '2',
    image: images.image2,
    title: 'Find Your Perfect Match',
    description:
      'We get to know you, so we can show you matches that truly click. Discover connection like never before.',
  },
  {
    key: '3',
    image: images.image3,
    title: 'Start Your Journey to Love',
    description:
      "Whether it's sparks or soulmates, your next chapter begins now. Dive in and see who’s waiting.",
  },
];

const OnBoarding = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonSlideAnim = useRef(new Animated.Value(100)).current;
  const isDark = colorScheme === 'dark';

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  useEffect(() => {
    StatusBar.setBackgroundColor(
      isDark ? theme.darkMode.gradientPrimary : theme.lightMode.gradientPrimary,
    );
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(buttonSlideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeIndex]);

  const handleSlideChange = index => {
    setActiveIndex(index);
    fadeAnim.setValue(0);
    imageScale.setValue(0.8);
    textSlideAnim.setValue(50);
    buttonSlideAnim.setValue(100);
  };

  const goToNextSlide = () => {
    if (sliderRef.current && activeIndex < slides.length - 1) {
      sliderRef.current.goToSlide(activeIndex + 1);
    }
  };

  const handleOnComplete = () => {
    navigation.replace('Signin');
  };

  const renderItem = ({item, index}) => (
    <LinearGradient
      colors={gradientColors}
      style={[globalStyles.container, styles.primaryContainer]}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [
                {scale: imageScale},
                {
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      index === activeIndex
                        ? 0
                        : index < activeIndex
                        ? -width * 0.2
                        : width * 0.2,
                      0,
                    ],
                  }),
                },
              ],
            },
          ]}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={[
              'transparent',
              isDark
                ? theme.darkMode.gradientPrimary
                : theme.lightMode.gradientPrimary,
            ]}
            style={styles.imageOverlay}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{translateY: textSlideAnim}],
              opacity: fadeAnim,
            },
          ]}>
          <Text
            style={[
              styles.title,
              {
                color: isDark
                  ? theme.colors.white
                  : theme.lightMode.primaryLight,
              },
            ]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: isDark
                  ? theme.colors.white
                  : theme.lightMode.primaryLight,
              },
            ]}>
            {item.description}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.btnContainer,
            {
              transform: [{translateY: buttonSlideAnim}],
              opacity: fadeAnim,
            },
          ]}>
          {index === slides.length - 1 ? (
            <Button
              title="GET STARTED"
              width={width * 0.9}
              onPress={handleOnComplete}
              backgroundColor={isDark ? '#FF6B6B' : theme.colors.primary}
              textColor={theme.colors.white}
            />
          ) : (
            <>
              <Button
                title="SKIP"
                width={width * 0.44}
                onPress={handleOnComplete}
                backgroundColor="transparent"
                textColor={isDark ? theme.colors.white : theme.colors.primary}
              />
              <Button
                title="NEXT"
                width={width * 0.44}
                onPress={goToNextSlide}
                backgroundColor={isDark ? '#FF6B6B' : theme.colors.primary}
                textColor={theme.colors.white}
              />
            </>
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderPagination = () => (
    <Animated.View style={[styles.paginationContainer, {opacity: fadeAnim}]}>
      {slides.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            activeIndex === index && styles.activeDot,
            {
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
              backgroundColor:
                activeIndex === index
                  ? isDark
                    ? '#FF6B6B'
                    : theme.colors.primary
                  : isDark
                  ? theme.colors.gray
                  : theme.colors.gray,
            },
          ]}
        />
      ))}
    </Animated.View>
  );

  return (
    <AppIntroSlider
      ref={sliderRef}
      renderItem={renderItem}
      data={slides}
      renderPagination={renderPagination}
      onSlideChange={handleSlideChange}
      showSkipButton={false}
      showDoneButton={false}
      showNextButton={false}
    />
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  imageContainer: {
    flex: 1,
    marginHorizontal: width * 0.06,
    marginTop: height * 0.06,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  textContainer: {
    flex: 0.8,
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
  },

  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamilySemiBold,
    textAlign: 'center',
    marginBottom: height * 0.02,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  description: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    textAlign: 'center',
    lineHeight: 24,
  },

  btnContainer: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
    gap: width * 0.02,
  },

  paginationContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  dot: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: width * 0.015,
    marginHorizontal: width * 0.01,
  },

  activeDot: {
    width: width * 0.06,
  },
});
