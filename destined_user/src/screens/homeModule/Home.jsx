import React, {useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../../redux/slices/userSlice';
import {getProfileMatch} from '../../redux/slices/profileMatchSlice';
import {likeUser, dislikeUser} from '../../redux/slices/likingSlice';
import ProfileCard from '../../utils/customComponents/customCards/customProfileCard/ProfileCard';
import Loader from '../../utils/customComponents/customLoader/Loader';

const {width, height} = Dimensions.get('screen');

const shuffleArray = array => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Home = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const user = useSelector(state => state.auth.user);
  const profileMatchUser = useSelector(
    state => state.profileMatch.profileMatch,
  );
  const loading = useSelector(state => state.profileMatch.loading);

  console.log('PRofile MAtch', profileMatchUser);

  const [refreshing, setRefreshing] = useState(false);
  const [shuffledProfiles, setShuffledProfiles] = useState([]);

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
      dispatch(getProfileMatch(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profileMatchUser?.length) {
      setShuffledProfiles(shuffleArray(profileMatchUser));
    }
  }, [profileMatchUser]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (user?.id) {
      dispatch(getProfileMatch(user.id)).finally(() => {
        setRefreshing(false);
      });
    }
  }, [dispatch, user]);

  const handleLike = targetUserId => {
    if (targetUserId === user?.id) {
      console.warn("You can't like yourself!");
      return;
    }
    dispatch(likeUser({userId: user?.id, targetUserId}))
      .unwrap()
      .then(response => console.log('✅ Like successful:', response))
      .catch(error => console.log('❌ Like failed:', error));
  };

  const handleDislike = targetUserId => {
    if (targetUserId === user?.id) {
      console.warn("You can't dislike yourself!");
      return;
    }
    dispatch(dislikeUser({userId: user?.id, targetUserId}))
      .unwrap()
      .then(response => console.log('✅ Dislike successful:', response))
      .catch(error => console.log('❌ Dislike failed:', error));
  };

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const cardColors = ['#5E2EFF', '#E91E63', '#9C27B0', '#2196F3', '#4CAF50'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[globalStyles.container, styles.primaryContainer]}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../assets/icons/heart.png')}
          title="Destined"
          profile={
            user?.profilePicture
              ? {uri: user.profilePicture}
              : require('../../assets/placeholders/default-avatar.png')
          }
          isOnline={user?.isOnline}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.swiperCardContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        ) : (
          shuffledProfiles.map((person, index) => (
            <ProfileCard
              key={person._id}
              name={`${person.firstName} ${person.lastName}`}
              color={cardColors[index % cardColors.length]}
              image={
                person?.profilePicture
                  ? {uri: person.profilePicture}
                  : require('../../assets/placeholders/default-avatar.png')
              }
              age={person.age}
              interests={person.sharedInterests}
              matchScore={person.matchScore}
              onLikePress={() => handleLike(person._id)}
              onDislikePress={() => handleDislike(person._id)}
            />
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  swiperCardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.08,
  },
});
