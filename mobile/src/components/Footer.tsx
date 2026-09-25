import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, Film, Disc } from 'lucide-react-native';

export const Footer: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.badge}>
          <Sparkles size={12} color="#E5A93C" />
        </View>
        <Text style={styles.brandTitle}>VALARIA</Text>
        <Text style={styles.brandSub}>CINEMA ARCHIVE</Text>
      </View>

      <Text style={styles.manifestoText}>
        A curated digital salon dedicated to uncompromising cinematic auteurism,
        photochemical restorations, and uncompressed spatial audio fidelity.
      </Text>

      <View style={styles.specsWrap}>
        {['4K ULTRA HD', 'HDR10+ / DOLBY VISION', '24.000 FPS', 'DOLBY ATMOS 7.1.4', '35MM NITRATE TRANSFERS'].map((spec, i) => (
          <View key={i} style={styles.specBadge}>
            <Text style={styles.specBadgeText}>{spec}</Text>
          </View>
        ))}
      </View>

      <View style={styles.copyrightRow}>
        <Text style={styles.copyrightText}>
          © {new Date().getFullYear()} VALARIA ARCHIVE FOUNDATION. ALL RIGHTS RESERVED.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#08080A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(229, 169, 60, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E5A93C',
    letterSpacing: 1.2,
  },
  manifestoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#8E8E98',
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 20,
  },
  specsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  specBadge: {
    backgroundColor: '#111116',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A0A0AB',
    letterSpacing: 0.5,
  },
  copyrightRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#656570',
    letterSpacing: 0.6,
  },
});
