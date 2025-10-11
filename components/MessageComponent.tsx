import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface MessageProps {
  text: string;
  isUser: boolean;
}

export default function MessageComponent({ text, isUser }: MessageProps) {
  const textColor = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  
  return (
    <View style={[
      styles.messageContainer,
      {
        backgroundColor: isUser ? '#E5E5E5' : background,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
      }
    ]}>
      <Text style={[
        styles.messageText,
        { color: isUser ? '#000000' : textColor }
      ]}>
        {text}
      </Text>
    </View>
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
  },
});