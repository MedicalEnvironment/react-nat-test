import { useCallback, useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BALL_SIZE = 50;

interface Ball {
  id: number;
  position: Animated.ValueXY;
  color: string;
  velocity: { x: number; y: number };
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export default function GameScreen() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const animationRef = useRef<number>();
  
  // Create a new ball on press
  const handlePress = useCallback((x: number, y: number) => {
    const newBall: Ball = {
      id: Date.now(),
      position: new Animated.ValueXY({ x, y }),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      velocity: {
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
      },
    };
    setBalls(prev => [...prev, newBall]);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    setBalls(prevBalls => {
      return prevBalls.map(ball => {
        // Get current position using getLayout
        const currentPosition = ball.position.getLayout();
        const currentX = currentPosition.left?.__getValue() || 0;
        const currentY = currentPosition.top?.__getValue() || 0;

        // Update position based on velocity
        let newX = currentX + ball.velocity.x;
        let newY = currentY + ball.velocity.y;

        // Bounce off walls
        if (newX <= 0 || newX >= SCREEN_WIDTH - BALL_SIZE) {
          ball.velocity.x *= -0.97;
          newX = Math.max(0, Math.min(newX, SCREEN_WIDTH - BALL_SIZE));
        }
        if (newY <= 0 || newY >= SCREEN_HEIGHT - BALL_SIZE) {
          ball.velocity.y *= -0.97;
          newY = Math.max(0, Math.min(newY, SCREEN_HEIGHT - BALL_SIZE));
        }

        // Apply gravity
        ball.velocity.y += 0.5;

        // Apply friction
        ball.velocity.x *= 0.99;
        ball.velocity.y *= 0.99;

        ball.position.setValue({ x: newX, y: newY });
        return ball;
      });
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Start animation on mount
  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      handlePress(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
    },
    onPanResponderMove: (evt) => {
      handlePress(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
    },
  });

  return (
    <ThemedView style={styles.container} {...panResponder.panHandlers}>
      {balls.map(ball => (
        <Animated.View
          key={ball.id}
          style={[
            styles.ball,
            {
              backgroundColor: ball.color,
              transform: ball.position.getTranslateTransform(),
            },
          ]}
        />
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});