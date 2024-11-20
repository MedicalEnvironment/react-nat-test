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
          source={require('@/assets/images/relax_image.jpg')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.mainTitle}>
          Find Your Inner Peace
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.messageContainer}>
        <ThemedText style={styles.messageText}>
          Welcome to your personal sanctuary of tranquility. In today's fast-paced world, 
          finding moments of peace can feel impossible. That's why we created this space - just for you.
        </ThemedText>
        <ThemedText style={styles.messageText}>
          Our interactive relaxation tools are designed to help you disconnect from daily stress 
          and find your center. Whether you have 5 minutes or an hour, these simple yet effective 
          exercises can help calm your mind and restore your energy.
        </ThemedText>
        <ThemedText style={styles.messageText}>
          Try our mesmerizing particle game in the Relax tab - where each touch creates a 
          beautiful display of floating orbs. Watch as they dance across your screen, 
          their gentle movements helping to wash away the tension of your day.
        </ThemedText>
        <ThemedText style={[styles.messageText, styles.highlightText]}>
          Remember: Taking time for yourself isn't selfish - it's essential. 
          Your peace of mind matters, and we're here to help you find it.
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
          <ThemedText style={styles.buttonText}>Begin Your Journey</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 28,
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
  highlightText: {
    fontWeight: '500',
    fontSize: 17,
    fontStyle: 'italic',
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