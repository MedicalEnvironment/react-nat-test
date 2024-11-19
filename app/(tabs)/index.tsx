import { Image, StyleSheet, Platform, Pressable, Linking } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const handlePress = () => {
    Linking.openURL('https://as1.ftcdn.net/v2/jpg/04/83/03/58/1000_F_483035899_9mafUWsv7OOIeXEXlFtJeP7kR6yju9g4.jpg');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1D1D1D', dark: '#0D0D0D' }}
      headerImage={
        <Image
          source={{
            uri: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/03/Kaneki-Cropped.jpg'
          }}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.mainTitle}>
          Do you wanna be 7 or 1000?
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.messageContainer}>
        <ThemedText style={styles.messageText}>
          Do you wanna continue living like this? Or you wanna make change?
        </ThemedText>
        <ThemedText style={styles.messageText}>
          Our society has become a place where we're expected to follow the crowd, to be another face in the masses. 
          We've become comfortable being average, being that 7 out of 10.
        </ThemedText>
        <ThemedText style={styles.messageText}>
          But what if you could be more? What if you could push beyond those limits, break free from societal norms, 
          and become that 1000? The choice is yours.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <Pressable 
          style={({pressed}) => [
            styles.button,
            {opacity: pressed ? 0.8 : 1}
          ]}
          onPress={handlePress}
        >
          <ThemedText style={styles.buttonText}>Be Different</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 20,
    gap: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  headerImage: {
    height: 300,
    width: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    bottom: 0,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});