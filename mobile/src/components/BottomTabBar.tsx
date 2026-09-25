import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, Compass, Film, Clapperboard, Bookmark } from 'lucide-react-native';
import { AppTab } from '../types/movie';

interface BottomTabBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  watchlistCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  watchlistCount,
}) => {
  const tabs = [
    { key: 'spotlight' as AppTab, label: 'Premiere', Icon: Sparkles },
    { key: 'taste' as AppTab, label: 'Taste', Icon: Compass },
    { key: 'vault' as AppTab, label: 'Vault', Icon: Film },
    { key: 'catalog' as AppTab, label: 'Archive', Icon: Clapperboard },
    { key: 'watchlist' as AppTab, label: 'Watchlist', Icon: Bookmark },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onSelectTab(key)}
              activeOpacity={0.7}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  size={19}
                  color={isActive ? '#E5A93C' : '#8E8E98'}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {key === 'watchlist' && watchlistCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{watchlistCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#08080A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 22,
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 58,
  },
  tabItemActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.08)',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5A93C',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#08080A',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E98',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#E5A93C',
    fontWeight: '800',
  },
});
