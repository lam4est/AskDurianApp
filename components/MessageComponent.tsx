import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';

interface MessageProps {
  text: string;
  isUser: boolean;
}

export default function MessageComponent({ text, isUser }: MessageProps) {
  const textColor = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');

  return (
    <Animated.View
      entering={FadeInUp.duration(250)}
      style={[
        styles.messageContainer,
        {
          backgroundColor: isUser ? '#E5E5E5' : background,
          alignSelf: isUser ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <ThemedText
        style={[
          styles.messageText,
          { color: isUser ? '#000000' : textColor },
        ]}
      >
        {text}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
