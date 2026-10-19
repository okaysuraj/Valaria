/** Provide native search, account access, and watchlist shortcuts. */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bookmark, Search, Sparkles, UserRound } from './icons';

interface HeaderProps {
  watchlistCount: number | null;
  onOpenWatchlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  signedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  watchlistCount,
  onOpenWatchlist,
  onOpenSearch,
  onOpenAccount,
  signedIn,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Sparkles size={13} color="#E5A93C" />
        </View>
        <View>
          <Text style={styles.brandTitle}>VALARIA</Text>
          <Text style={styles.brandSubtitle}>CINEMA ARCHIVE</Text>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={onOpenAccount}
          style={styles.actionIconButton}
          accessibilityRole="button"
          accessibilityLabel={signedIn ? 'Open account' : 'Sign in'}
        >
          <UserRound size={18} color="#C4C4CD" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onOpenSearch}
          activeOpacity={0.7}
          style={styles.actionIconButton}
          accessibilityLabel="Search Catalog"
          accessibilityRole="button"
        >
          <Search size={18} color="#C4C4CD" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenWatchlist}
          activeOpacity={0.8}
          style={styles.watchlistButton}
          accessibilityLabel="Open Watchlist"
          accessibilityRole="button"
        >
          <Bookmark size={15} color="#08080A" fill="#08080A" />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{watchlistCount ?? '…'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#08080A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 169, 60, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2.2,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E5A93C',
    letterSpacing: 1.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconButton: {
    width: 44,
    height: 44,
    borderRadius: 19,
    backgroundColor: '#14141B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 7,
    borderRadius: 20,
  },
  watchlistText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#08080A',
    letterSpacing: 0.8,
  },
  badgeContainer: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5A93C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#08080A',
  },
});
