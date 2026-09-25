import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {
  Film,
  Maximize2,
  Volume2,
  Award,
  Play,
  Pause,
  ChevronRight,
} from 'lucide-react-native';
import { Movie } from '../types/movie';

interface CuratorBentoProps {
  onSelectMovie: (movie: Movie) => void;
  movies: Movie[];
}

export const CuratorBento: React.FC<CuratorBentoProps> = ({
  onSelectMovie,
  movies,
}) => {
  const [activeAspect, setActiveAspect] = useState<'academy' | 'flat' | 'scope'>('scope');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const villeneuveMovie =
    movies.find((m) => m.id === 'blade-runner-2049') || movies[0];
  const cannesMovie =
    movies.find((m) => m.id === 'in-the-mood-for-love') || movies[3];

  const aspectRatios = {
    academy: {
      ratioWidth: 140,
      ratioHeight: 102,
      label: '1.37:1 Academy',
      desc: 'Pre-1953 classical intimacy. Vertical facial dominance.',
    },
    flat: {
      ratioWidth: 175,
      ratioHeight: 95,
      label: '1.85:1 Flat',
      desc: 'Modern human scale. Natural vertical and horizontal balance.',
    },
    scope: {
      ratioWidth: 215,
      ratioHeight: 90,
      label: '2.39:1 Anamorphic',
      desc: 'Monumental lateral scope. Expansive architectural landscapes.',
    },
  };

  // Equalizer bar heights animation
  const barHeights = useRef(
    Array.from({ length: 14 }, () => new Animated.Value(8))
  ).current;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        barHeights.forEach((anim) => {
          Animated.timing(anim, {
            toValue: Math.floor(Math.random() * 38) + 8,
            duration: 150,
            useNativeDriver: false,
          }).start();
        });
      }, 180);
    } else {
      barHeights.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 8,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingAudio, barHeights]);

  return (
    <View style={styles.sectionContainer}>
      {/* Section Header */}
      <View style={styles.headerArea}>
        <View style={styles.eyebrowRow}>
          <View style={styles.amberDot} />
          <Text style={styles.eyebrowText}>CURATOR DISPATCHES</Text>
        </View>
        <Text style={styles.sectionHeading}>Landmarks & Restorations</Text>
        <Text style={styles.sectionDescription}>
          Archival standards, photochemical transfers, and spatial acoustics
          curated for the uncompromising cinephile.
        </Text>
      </View>

      {/* Bento Grid Cells */}
      <View style={styles.bentoStack}>
        {/* Cell 1: Auteur Retrospective (Blade Runner 2049) */}
        <View style={styles.bentoCard}>
          <View style={styles.cardCoverWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
              }}
              style={styles.cardCoverImage}
              resizeMode="cover"
            />
            <View style={styles.coverDarkGradient} />
            <View style={styles.topBadgeInside}>
              <Film size={12} color="#E5A93C" />
              <Text style={styles.topBadgeText}>AUTEUR ARCHIVE // 4K REMASTER</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              The Architecture of Solitude: Modern Neo-Noir
            </Text>
            <Text style={styles.cardDescription}>
              From Deakins’ copper-dusted dust storms in Blade Runner 2049 to
              hypnotic neon light design, explore how framing sculpts psychological isolation.
            </Text>

            <TouchableOpacity
              onPress={() => onSelectMovie(villeneuveMovie)}
              activeOpacity={0.8}
              style={styles.goldActionButton}
            >
              <Text style={styles.goldActionText}>Launch Spotlight</Text>
              <ChevronRight size={14} color="#08080A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cell 2: Aspect Ratio & Framing Lab */}
        <View style={styles.bentoCard}>
          <View style={styles.labHeader}>
            <View style={styles.labTitleRow}>
              <Maximize2 size={14} color="#E5A93C" />
              <Text style={styles.labEyebrow}>OPTICAL GEOMETRY LAB</Text>
            </View>
            <View style={styles.interactiveTag}>
              <Text style={styles.interactiveTagText}>INTERACTIVE</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Aspect Ratio Comparator</Text>
          <Text style={styles.cardDescription}>
            Toggle optical standards to inspect how aspect ratio alters emotional perception and horizon width.
          </Text>

          {/* Dynamic Framing Box Preview */}
          <View style={styles.framingContainer}>
            <View
              style={[
                styles.framingBox,
                {
                  width: aspectRatios[activeAspect].ratioWidth,
                  height: aspectRatios[activeAspect].ratioHeight,
                },
              ]}
            >
              <Text style={styles.framingLabel}>
                {aspectRatios[activeAspect].label}
              </Text>
            </View>
          </View>

          {/* Ratio Buttons */}
          <View style={styles.ratioButtonsRow}>
            {(['academy', 'flat', 'scope'] as const).map((key) => {
              const isSelected = activeAspect === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setActiveAspect(key)}
                  activeOpacity={0.7}
                  style={[
                    styles.ratioButton,
                    isSelected && styles.ratioButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.ratioButtonText,
                      isSelected && styles.ratioButtonTextActive,
                    ]}
                  >
                    {key.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.ratioDescText}>
            {aspectRatios[activeAspect].desc}
          </Text>
        </View>

        {/* Cell 3: Spatial Audio Visualizer */}
        <View style={styles.bentoCard}>
          <View style={styles.labHeader}>
            <View style={styles.labTitleRow}>
              <Volume2 size={14} color="#E5A93C" />
              <Text style={styles.labEyebrow}>ACOUSTIC PRECISION</Text>
            </View>
            <View style={styles.interactiveTag}>
              <Text style={styles.interactiveTagText}>7.1.4 SURROUND</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Dolby Atmos Spatial Audio</Text>
          <Text style={styles.cardDescription}>
            Reference uncompressed sound placement engineered for cinema headphone acoustics.
          </Text>

          {/* Equalizer Visualization */}
          <View style={styles.equalizerContainer}>
            {barHeights.map((anim, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.eqBar,
                  {
                    height: anim,
                    backgroundColor: isPlayingAudio ? '#E5A93C' : 'rgba(255,255,255,0.2)',
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setIsPlayingAudio(!isPlayingAudio)}
            activeOpacity={0.8}
            style={styles.audioToggleButton}
          >
            {isPlayingAudio ? (
              <>
                <Pause size={13} color="#E5A93C" />
                <Text style={styles.audioToggleText}>MUTE HARMONIC PREVIEW</Text>
              </>
            ) : (
              <>
                <Play size={13} color="#E5A93C" fill="#E5A93C" />
                <Text style={styles.audioToggleText}>TEST SPATIAL FREQUENCY</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Cell 4: Festival Laureates & Cannes Archive */}
        <View style={styles.bentoCard}>
          <View style={styles.cardCoverWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
              }}
              style={styles.cardCoverImage}
              resizeMode="cover"
            />
            <View style={styles.coverDarkGradient} />
            <View style={styles.topBadgeInside}>
              <Award size={12} color="#E5A93C" />
              <Text style={styles.topBadgeText}>PALME D'OR & GOLDEN LION</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Wong Kar-wai: The Restored Hong Kong Canon
            </Text>
            <Text style={styles.cardDescription}>
              Supervised 4K photochemical scans from original 35mm camera negatives.
              Experience In the Mood for Love in pristine color timing.
            </Text>

            <TouchableOpacity
              onPress={() => onSelectMovie(cannesMovie)}
              activeOpacity={0.8}
              style={styles.whiteActionButton}
            >
              <Text style={styles.whiteActionText}>Open 4K Master</Text>
              <ChevronRight size={14} color="#08080A" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#08080A',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerArea: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5A93C',
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.6,
  },
  sectionHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#8E8E98',
  },
  bentoStack: {
    paddingHorizontal: 18,
    gap: 16,
  },
  bentoCard: {
    backgroundColor: '#111116',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    overflow: 'hidden',
    padding: 16,
  },
  cardCoverWrapper: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  cardCoverImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  coverDarkGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 8, 10, 0.5)',
  },
  topBadgeInside: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  topBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EDEDF0',
    letterSpacing: 0.6,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#B0B0BC',
  },
  goldActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E5A93C',
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 6,
  },
  goldActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#08080A',
  },
  whiteActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 6,
  },
  whiteActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#08080A',
  },
  labHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 0.8,
  },
  interactiveTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  interactiveTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E8E98',
  },
  framingContainer: {
    height: 120,
    backgroundColor: '#08080A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  framingBox: {
    borderWidth: 1.5,
    borderColor: '#E5A93C',
    borderRadius: 6,
    backgroundColor: 'rgba(229, 169, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  framingLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E5A93C',
  },
  ratioButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  ratioButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#08080A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  ratioButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  ratioButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E98',
  },
  ratioButtonTextActive: {
    color: '#08080A',
    fontWeight: '900',
  },
  ratioDescText: {
    fontSize: 11,
    color: '#A0A0AB',
    fontStyle: 'italic',
    marginTop: 4,
  },
  equalizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 60,
    backgroundColor: '#08080A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    marginVertical: 14,
    paddingHorizontal: 12,
  },
  eqBar: {
    width: 6,
    borderRadius: 3,
  },
  audioToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#191922',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    borderRadius: 14,
  },
  audioToggleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});
