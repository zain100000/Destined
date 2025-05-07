import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../../styles/theme';
import Header from '../../../utils/customComponents/customHeader/Header';
import InterestCard from '../../../utils/customComponents/customCards/customInterestCard/InterestCard';
import {useRoute, useNavigation} from '@react-navigation/native';
import {getInterests} from '../../../redux/slices/interestSlice';
import {updateUser} from '../../../redux/slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../utils/customComponents/customButton/Button';
import CustomModal from '../../../utils/customModals/CustomModal';

const {width, height} = Dimensions.get('screen');

const UpdateInterest = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const {user} = route.params;
  const {interest} = useSelector(state => state.interest);

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    dispatch(getInterests());
  }, [dispatch]);

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  useEffect(() => {
    const userInterests = user.interests.map(item => item.interest.trim());
    setSelectedInterests(userInterests);
  }, [user]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const toggleSelect = item => {
    const trimmedItem = item.trim();
    let updated;
    if (selectedInterests.includes(trimmedItem)) {
      updated = selectedInterests.filter(i => i !== trimmedItem);
    } else {
      updated = [...selectedInterests, trimmedItem];
    }
    setSelectedInterests(updated);

    const initialInterests = user.interests.map(item => item.interest.trim());
    const isSame =
      updated.length === initialInterests.length &&
      updated.every(i => initialInterests.includes(i));
    setIsChanged(!isSame);
  };

  const handleUpdateInterests = async () => {
    setLoading(true);
    setShowAuthModal(true);

    const formData = new FormData();
    selectedInterests.forEach((interest, index) => {
      formData.append(`interests[${index}][interest]`, interest);
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
          navigation.goBack();
        }, 2000);
      } else {
        setShowAuthModal(false);
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setShowAuthModal(false);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
      setShowAuthModal(false);
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.primaryContainer}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.headerContainer}>
          <Header
            logo={require('../../../assets/icons/heart.png')}
            title="Update Interest"
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={200}
            style={styles.interestContainer}>
            <FlatList
              data={interest}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => toggleSelect(item)}>
                  <View
                    style={[
                      styles.cardContainer,
                      selectedInterests.includes(item) && styles.selectedCard,
                    ]}>
                    <InterestCard
                      interestName={item.replace(/_/g, ' ')}
                      isSelected={selectedInterests.includes(item)}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={900}
            style={styles.btnContainer}>
            <Button
              title="Update Interest"
              width={width * 0.95}
              loading={loading}
              onPress={handleUpdateInterests}
              disabled={!isChanged || loading}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </Animatable.View>
        </ScrollView>

        <CustomModal
          visible={showAuthModal}
          title="Working!"
          description="Please wait while we update your interests."
          animationSource={require('../../../assets/animations/loading.json')}
          onClose={() => setShowAuthModal(false)}
        />

        <CustomModal
          visible={showSuccessModal}
          title="Success!"
          description="Interest Updated Successfully."
          animationSource={require('../../../assets/animations/success.json')}
          onClose={() => setShowSuccessModal(false)}
        />

        <CustomModal
          visible={showErrorModal}
          title="Error!"
          description="Erro Updating Interests!"
          animationSource={require('../../../assets/animations/error.json')}
          onClose={() => setShowErrorModal(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default UpdateInterest;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  safeAreaContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: width * 0.02,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.05,
  },

  interestContainer: {
    marginTop: height * 0.03,
  },

  columnWrapper: {
    marginVertical: height * 0.012,
    gap: theme.gap(2),
  },

  btnContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
});
