import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../../../styles/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('screen');

const ProfileCard = ({
  name,
  age,
  color,
  image,
  interests = [],
  matchScore,
  onLikePress,
  liked,
  onCardPress,
  onSwiped, // NEW
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scaleIn = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleIn, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          if (onCardPress) onCardPress();
          return;
        }

        if (Math.abs(gesture.dx) > 120) {
          Animated.timing(pan, {
            toValue: {
              x: gesture.dx > 0 ? width : -width,
              y: gesture.dy,
            },
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            pan.setValue({x: 0, y: 0});
            if (onSwiped) onSwiped();
          });
        } else {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onLikePress();
  };

  return (
    <Animated.View
      style={[styles.touchableContainer]}
      {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [...pan.getTranslateTransform(), {scale: scaleIn}],
            opacity: fadeIn,
            backgroundColor: color,
          },
        ]}>
        <LinearGradient
          colors={['#00000080', color]}
          style={StyleSheet.absoluteFill}
          start={{x: 0.1, y: 1}}
          end={{x: 1, y: 0.2}}
        />

        <View style={styles.matchScoreContainer}>
          <LinearGradient
            colors={['#FF6FD8', '#3813C2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.matchScoreWrapper}>
            <Text style={styles.matchScoreText}>{Math.floor(matchScore)}%</Text>
          </LinearGradient>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.profileRow}>
            <Image source={image} style={styles.profilePic} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{name}</Text>
              <View style={styles.ageRow}>
                <View style={styles.ageContainer}>
                  <Text style={styles.age}>{age}</Text>
                  <View style={styles.ageDecoration} />
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.likeButton,
                      liked && styles.likeButtonActive,
                    ]}
                    onPress={handlePress}>
                    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
                      <LinearGradient
                        colors={
                          liked
                            ? ['#FF6FD8', '#3813C2']
                            : ['#4AC29A', '#BDFFF3']
                        }
                        style={styles.gradientButton}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}>
                        <FontAwesome
                          name={liked ? 'heart' : 'heart-o'}
                          size={width * 0.06}
                          color={theme.colors.error}
                          style={{
                            textShadowColor: 'rgba(0,0,0,0.3)',
                            textShadowOffset: {width: 1, height: 1},
                            textShadowRadius: 2,
                          }}
                        />
                      </LinearGradient>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {interests?.length > 0 && (
          <View style={styles.interests}>
            {interests.map(item => (
              <View key={item._id} style={styles.interestTag}>
                <Text style={styles.interestText}>{item.interest}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  touchableContainer: {
    width: width * 0.9,
    height: height * 0.64,
    position: 'absolute',
    alignSelf: 'center',
  },

  card: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.large,
    padding: height * 0.02,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 12},
    shadowRadius: 20,
    elevation: 10,
  },

  matchScoreContainer: {
    position: 'absolute',
    top: height * 0.014,
    right: width * 0.04,
    zIndex: 2,
    borderRadius: 50,
    overflow: 'hidden',
  },

  matchScoreWrapper: {
    width: width * 0.2,
    height: height * 0.09,
    borderRadius: theme.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  matchScoreText: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyBold,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  profilePic: {
    width: width * 0.24,
    height: width * 0.24,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: theme.borderRadius.circle,
    marginRight: width * 0.03,
  },

  profileInfo: {
    flex: 1,
  },
  bottomSection: {
    position: 'absolute',
    bottom: height * 0.04,
    left: width * 0.05,
    right: width * 0.05,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  name: {
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyBold,
    letterSpacing: theme.spacing(0.1),
  },

  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.008,
  },

  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  age: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilySemiBold,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    left: width * 0.01,
  },

  ageDecoration: {
    width: width * 0.08,
    height: 2,
    backgroundColor: theme.colors.white,
    marginLeft: width * 0.02,
    opacity: 0.7,
  },

  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },

  likeButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: theme.borderRadius.circle,
    shadowColor: '#4AC29A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  likeButtonActive: {
    backgroundColor: '#BDFFF3',
  },

  gradientButton: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
  },

  interests: {
    position: 'absolute',
    top: height * 0.12,
    right: width * 0.04,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },

  interestTag: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: theme.borderRadius.medium,
    margin: height * 0.005,
  },

  interestText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamilySemiBold,
  },
});
