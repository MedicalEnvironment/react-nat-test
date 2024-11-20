import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BALL_SIZE = 50;
const MAX_BALLS = 20; // Maximum number of balls allowed
const BALL_LIFETIME = 5000; // Ball lifetime in milliseconds

interface Particle {
  id: number;
  position: Animated.ValueXY;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
}

interface Ball {
  id: number;
  position: Animated.ValueXY;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  velocity: { x: number; y: number };
  createdAt: number;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export default function GameScreen() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isReady, setIsReady] = useState(false);
  const animationRef = useRef<number>();

  const createDestroyAnimation = useCallback((ball: Ball) => {
    // Create explosion particles
    const particleCount = 8;
    const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / particleCount;
      const position = new Animated.ValueXY({
        x: ball.position.x.__getValue(),
        y: ball.position.y.__getValue(),
      });
      
      return {
        id: Date.now() + i,
        position,
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
        color: ball.color,
      };
    });

    setParticles(prev => [...prev, ...newParticles]);

    // Animate particles
    newParticles.forEach((particle, i) => {
      const angle = (i * 2 * Math.PI) / particleCount;
      const distance = 100;

      Animated.parallel([
        Animated.timing(particle.position, {
          toValue: {
            x: particle.position.x.__getValue() + Math.cos(angle) * distance,
            y: particle.position.y.__getValue() + Math.sin(angle) * distance,
          },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle.scale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setParticles(prev => prev.filter(p => p.id !== particle.id));
      });
    });

    // Fade out the ball
    Animated.parallel([
      Animated.timing(ball.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(ball.scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setBalls(prev => prev.filter(b => b.id !== ball.id));
    });
  }, []);

  const handlePress = useCallback((x: number, y: number) => {
    if (!isReady) return;
    
    const newBall: Ball = {
      id: Date.now(),
      position: new Animated.ValueXY({ x, y }),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      velocity: {
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
      },
      createdAt: Date.now(),
    };

    // Remove oldest ball if we exceed MAX_BALLS
    setBalls(prev => {
      if (prev.length >= MAX_BALLS) {
        createDestroyAnimation(prev[0]);
        return [...prev.slice(1), newBall];
      }
      return [...prev, newBall];
    });
  }, [isReady, createDestroyAnimation]);

  const animate = useCallback(() => {
    if (!isReady) return;

    const now = Date.now();

    setBalls(prevBalls => {
      return prevBalls.map(ball => {
        // Check if ball should be destroyed
        if (now - ball.createdAt > BALL_LIFETIME) {
          createDestroyAnimation(ball);
          return ball;
        }

        const currentX = ball.position.x.__getValue();
        const currentY = ball.position.y.__getValue();

        let newX = currentX + ball.velocity.x;
        let newY = currentY + ball.velocity.y;

        if (newX <= 0 || newX >= SCREEN_WIDTH - BALL_SIZE) {
          ball.velocity.x *= -0.97;
          newX = Math.max(0, Math.min(newX, SCREEN_WIDTH - BALL_SIZE));
        }
        if (newY <= 0 || newY >= SCREEN_HEIGHT - BALL_SIZE) {
          ball.velocity.y *= -0.97;
          newY = Math.max(0, Math.min(newY, SCREEN_HEIGHT - BALL_SIZE));
        }

        ball.velocity.y += 0.5;
        ball.velocity.x *= 0.99;
        ball.velocity.y *= 0.99;

        ball.position.setValue({ x: newX, y: newY });
        return ball;
      }).filter(ball => now - ball.createdAt <= BALL_LIFETIME);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [isReady, createDestroyAnimation]);

  useEffect(() => {
    setIsReady(true);
    return () => setIsReady(false);
  }, []);

  useEffect(() => {
    if (isReady) {
      animate();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isReady]);

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

  if (!isReady) return null;

  return (
    <ThemedView style={styles.container} {...panResponder.panHandlers}>
      {particles.map(particle => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: [
                ...particle.position.getTranslateTransform(),
                { scale: particle.scale }
              ],
            },
          ]}
        />
      ))}
      {balls.map(ball => (
        <Animated.View
          key={ball.id}
          style={[
            styles.ball,
            {
              backgroundColor: ball.color,
              opacity: ball.opacity,
              transform: [
                ...ball.position.getTranslateTransform(),
                { scale: ball.scale }
              ],
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
  particle: {
    position: 'absolute',
    width: BALL_SIZE / 4,
    height: BALL_SIZE / 4,
    borderRadius: BALL_SIZE / 8,
  },
});