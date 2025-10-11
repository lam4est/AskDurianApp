import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}

export default function ChatInput({ message, setMessage, sendMessage }: ChatInputProps) {
  const textColor = useThemeColor({}, 'text');

  const handleSubmit = () => {
    if (message.trim()) {
      sendMessage();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input]}
            value={message}
            onChangeText={setMessage}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#666"
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.recordButton}>
            <Ionicons name="mic-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  inputContainer: {
    flex: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: 'transparent',
  },
  recordButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});