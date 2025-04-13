import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import uploadAnimation from '../../assets/animations/image.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {theme} from '../../styles/theme';
import CustomModal from './CustomModal';

const {width, height} = Dimensions.get('screen');

const ImageUploadModal = ({
  visible,
  title,
  description,
  onClose,
  onImageUpload,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelection = image => {
    setSelectedImage(image);
    onImageUpload(image.path);
  };

  const handlePickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });

      handleImageSelection(image);
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  const handleOpenCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      });

      handleImageSelection(image);
    } catch (error) {
      console.error(error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <LottieView
            source={uploadAnimation}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.modalText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={handleOpenCamera}>
              <View style={styles.cameraContainer}>
                <View style={styles.icon}>
                  <Ionicons
                    name="camera"
                    size={25}
                    color={theme.colors.white}
                  />
                </View>
                <Text style={styles.cameraText}>Camera</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePickImage}>
              <View style={styles.galleryContainer}>
                <View style={styles.iconContainer}>
                  {loading ? (
                    <ActivityIndicator size={25} color={theme.colors.white} />
                  ) : (
                    <>
                      <View style={styles.icon}>
                        <Ionicons
                          name="image"
                          size={25}
                          color={theme.colors.white}
                        />
                      </View>
                      <Text style={styles.galleryText}>Gallery</Text>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        animationSource={require('../../assets/animations/success.json')}
        title="Success!"
        description="Image selected successfully!"
      />

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        animationSource={require('../../assets/animations/error.json')}
        title="Upload Failed"
        description="There was an error during the image selection!"
      />
    </Modal>
  );
};

export default ImageUploadModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalView: {
    margin: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.92,
    height: height * 0.48,
  },

  animation: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 15,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: width * 0.05,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  descriptionText: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: width * 0.04,
    marginBottom: 20,
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 30,
    width: '100%',
  },

  cameraContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.dark,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  galleryContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    gap: 10,
    paddingVertical: height * 0.022,
    paddingHorizontal: height * 0.02,
    marginHorizontal: width * 0.003,
    width: width * 0.35,
  },

  cameraText: {
    fontSize: width * 0.04,
    top: height * 0.0036,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  galleryText: {
    fontSize: width * 0.04,
    top: height * 0.0036,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  icon: {
    top: height * 0.002,
  },

  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
