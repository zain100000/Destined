import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
  ScrollView,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../../redux/slices/userSlice';
import ProfileHeaderCard from '../../utils/customComponents/customCards/profileScreenCard/ProfileHeaderCard';
import LogoutModal from '../../utils/customModals/LogoutModal';
import ProfileScreenCard from '../../utils/customComponents/customCards/profileScreenCard/ProfileCard';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);

  const user = useSelector(state => state.auth.user);
  const userProfile = useSelector(state => state.user.user);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const statusBarColor = isDark
      ? theme.darkMode.gradientPrimary
      : theme.lightMode.gradientPrimary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [colorScheme]);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUser(user.id));
    }
  }, [dispatch, user]);

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const handleLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleProfileNavigate = () => {
    navigation.navigate('Profile_Details', {
      user: userProfile,
    });
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/icons/heart.png')}
          title="Profile"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfoContainer}>
          <ProfileHeaderCard
            image={userProfile?.profilePicture}
            name={`${userProfile?.firstName} ${userProfile?.lastName}`}
            phone={user?.phone}
            btnTitle="Logout"
            onPress={handleLogoutModal}
            loading={loading}
          />
        </View>

        <View style={styles.profileCards}>
          <View style={styles.accountContainer}>
            <ProfileScreenCard
              title="Profile Details"
              iconName="person"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={handleProfileNavigate}
              textColor={
                colorScheme === 'dark'
                  ? theme.lightMode.primaryLight
                  : theme.darkMode.primaryDark
              }
            />
          </View>

          <View style={styles.changePasswordContainer}>
            <ProfileScreenCard
              title="Change Password"
              iconName="sync"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Change_Password')}
              textColor={
                colorScheme === 'dark'
                  ? theme.lightMode.primaryLight
                  : theme.darkMode.primaryDark
              }
            />
          </View>

          <View style={styles.privacyPolicyContainer}>
            <ProfileScreenCard
              title="Privacy Policy"
              iconName="shield"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Privacy_Policy')}
              textColor={
                colorScheme === 'dark'
                  ? theme.lightMode.primaryLight
                  : theme.darkMode.primaryDark
              }
            />
          </View>

          <View style={styles.termsConditionContainer}>
            <ProfileScreenCard
              title="Terms & Conditions"
              iconName="briefcase"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() =>
                navigation.navigate('Terms_and_Conditions')
              }
              textColor={
                colorScheme === 'dark'
                  ? theme.lightMode.primaryLight
                  : theme.darkMode.primaryDark
              }
            />
          </View>

          <View style={styles.deleteProfileContainer}>
            <ProfileScreenCard
              title="Delete My Profile"
              iconName="trash"
              iconColor={theme.colors.error}
              rightIcon="chevron-forward"
              textColor={
                colorScheme === 'dark'
                  ? theme.lightMode.primaryLight
                  : theme.darkMode.primaryDark
              }
            />
          </View>
        </View>
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout!"
        description="Are Your Sure You Want To Logout?"
      />
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: height * 0.02,
  },

  profileCards: {
    marginTop: height * 0.034,
    marginHorizontal: width * 0.04,
    gap: theme.gap(2),
  },
});
