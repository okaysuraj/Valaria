/** Select a published mood and browse the films that match it. */
import { ScrollView, Text, View } from 'react-native';
import type { TasteMood } from '../types/movie';
import { CatalogGrid, type CollectionProps } from './CatalogGrid';
import { Button, StateView, ui } from './ui';

interface Props extends CollectionProps {
  moods: TasteMood[];
  genres: string[];
  selectedMoodId: string | null;
  onSelectMood: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}
export function TasteEngine({ moods, selectedMoodId, onSelectMood, ...collection }: Props) {
  const mood = moods.find((item) => item.id === selectedMoodId);
  if (!moods.length)
    return (
      <StateView
        title="No moods published yet"
        detail="Mood selections will appear when they are published in the catalog."
      />
    );
  const heading = (
    <View style={{ gap: 12 }}>
      <Text style={ui.eyebrow}>THE TASTE ENGINE</Text>
      <Text style={ui.title}>Find your atmosphere</Text>
      <Text style={ui.body}>
        Browse all films or choose an atmosphere to explore films tagged with that mood.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        <Button label="All moods" selected={!mood} onPress={() => onSelectMood(null)} />
        {moods.map((item) => (
          <Button
            key={item.id}
            label={item.label}
            selected={item.id === mood?.id}
            onPress={() => onSelectMood(item.id)}
          />
        ))}
      </ScrollView>
      {mood && (
        <>
          <Text style={ui.heading}>{mood.label}</Text>
          {mood.tagline && <Text style={ui.body}>{mood.tagline}</Text>}
        </>
      )}
    </View>
  );
  return <CatalogGrid {...collection} mood={mood?.id} heading={heading} />;
}
