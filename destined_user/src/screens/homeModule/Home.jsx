import React, {useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
  View,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../../redux/slices/userSlice';
import {getProfileMatch} from '../../redux/slices/profileMatchSlice';
import {
  dislikeUser,
  getLikedUsers,
  likeUser,
} from '../../redux/slices/likingSlice';
import ProfileCard from '../../utils/customComponents/customCards/customProfileCard/ProfileCard';
import Loader from '../../utils/customComponents/customLoader/Loader';
import {useNavigation} from '@react-navigation/native';
import {
  getPendingFriendRequests,
  listenToPendingFriendRequestList,
  listenToFriendRequestAccepted,
  listenToFriendRequestRejected,
  removePendingFriendRequestListListener,
  sendFriendRequest,
  removeFriendRequestAcceptedListener,
  removeFriendRequestRejectedListener,
} from '../../utils/customSocket/socketActions/SocketActions';

const {height} = Dimensions.get('screen');

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
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const user = useSelector(state => state.auth.user);
  const userProfile = useSelector(state => state.user.user);
  const profileMatchUser = useSelector(
    state => state.profileMatch.profileMatch,
  );
  const loading = useSelector(state => state.profileMatch.loading);
  const likedUsers = useSelector(state => state.liking.likedUsers);

  const [refreshing, setRefreshing] = useState(false);
  const [shuffledProfiles, setShuffledProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

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
      dispatch(getLikedUsers());
      // Fetch pending friend requests
      getPendingFriendRequests({userId: user.id});
    }
  }, [dispatch, user]);

  useEffect(() => {
    const pendingRequestsListener = data => {
      if (data.success && data.data?.outgoing) {
        setOutgoingRequests(data.data.outgoing);
      }
    };

    listenToPendingFriendRequestList(pendingRequestsListener);

    return () => {
      removePendingFriendRequestListListener();
    };
  }, []);

  useEffect(() => {
    const requestAcceptedListener = data => {
      if (data.success) {
        setOutgoingRequests(prev =>
          prev.map(req =>
            req.requestId === data.data.requestId
              ? {...req, status: 'ACCEPTED'}
              : req,
          ),
        );
      }
    };

    const requestRejectedListener = data => {
      if (data.success) {
        setOutgoingRequests(prev =>
          prev.filter(req => req.requestId !== data.data.requestId),
        );
      }
    };

    listenToFriendRequestAccepted(requestAcceptedListener);
    listenToFriendRequestRejected(requestRejectedListener);

    return () => {
      removeFriendRequestAcceptedListener();
      removeFriendRequestRejectedListener();
    };
  }, []);

  useEffect(() => {
    if (profileMatchUser?.length) {
      const shuffled = shuffleArray(profileMatchUser);
      setShuffledProfiles(shuffled);
      setCurrentIndex(0);
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
    const isLiked = likedUsers.some(
      like =>
        like.targetUserId === targetUserId ||
        (typeof like.targetUserId === 'object' &&
          like.targetUserId._id === targetUserId),
    );

    const action = isLiked ? dislikeUser : likeUser;

    dispatch(action({userId: user?.id, targetUserId}))
      .unwrap()
      .catch(error => {
        console.log(`${isLiked ? 'Dislike' : 'Like'} failed:`, error);
      });
  };

  const handleFriendRequest = targetUserId => {
    // Optimistically add to state
    setOutgoingRequests(prev => [
      ...prev,
      {
        receiver: {_id: targetUserId},
        requestId: `${targetUserId}`,
        status: 'PENDING',
      },
    ]);

    sendFriendRequest({
      senderId: user?.id,
      receiverId: targetUserId,
    });
  };

  const handleSwipe = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleUserDetailNavigation = person => {
    navigation.navigate('User_Detail', {userDetails: person});
  };

  const gradientColors = isDark
    ? [theme.darkMode.gradientPrimary, theme.darkMode.gradientSecondary]
    : [theme.lightMode.gradientPrimary, theme.lightMode.gradientSecondary];

  const cardColors = ['#5E2EFF', '#E91E63', '#9C27B0', '#2196F3', '#4CAF50'];

  const currentProfile = shuffledProfiles[currentIndex];

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
            userProfile?.profilePicture
              ? {uri: userProfile.profilePicture}
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
        ) : currentProfile ? (
          <ProfileCard
            key={currentProfile._id}
            name={`${currentProfile.name}`}
            age={currentProfile.age}
            color={cardColors[currentIndex % cardColors.length]}
            image={
              currentProfile.profilePicture
                ? {uri: currentProfile.profilePicture}
                : require('../../assets/placeholders/default-avatar.png')
            }
            interests={currentProfile.sharedInterests}
            matchScore={currentProfile.matchScore}
            liked={likedUsers.some(
              like =>
                like.targetUserId === currentProfile._id ||
                (typeof like.targetUserId === 'object' &&
                  like.targetUserId._id === currentProfile._id),
            )}
            onLikePress={() => handleLike(currentProfile._id)}
            onCardPress={() => handleUserDetailNavigation(currentProfile)}
            onSwiped={handleSwipe}
            onFriendRequestPress={() => handleFriendRequest(currentProfile._id)}
            requestStatus={
              outgoingRequests.find(
                req => req.receiver._id === currentProfile?._id,
              )?.status
            }
          />
        ) : (
          <Text
            style={[
              styles.emptyText,
              {
                color: isDark ? theme.colors.white : theme.colors.primary,
              },
            ]}>
            No More Profiles!
          </Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  swiperCardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.08,
  },

  emptyText: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
  },
});
