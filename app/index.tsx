import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import MessageComponent from '@/components/MessageComponent';
import ChatInput from '@/components/ChatInput';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/Sidebar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const background = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'text');

  // Sidebar animation offset
  const sidebarOffset = useSharedValue(0);

  // Toggle sidebar
  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    sidebarOffset.value = withTiming(open ? SIDEBAR_WIDTH : 0, {
      duration: 250,
    });
  };

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin chào! Tôi là Sầu Riêng AI 🍈',
        isUser: false,
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  // Main content animation
  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarOffset.value }],
  }));

  // Overlay mờ animation
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: (sidebarOffset.value / SIDEBAR_WIDTH) * 0.3,
    display: sidebarOffset.value > 0 ? 'flex' : 'none',
  }));

  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={['top', 'left', 'right', 'bottom']}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
        offset={sidebarOffset}
      />

      {/* Main content */}
      <Animated.View style={[{ flex: 1 }, mainAnimatedStyle]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoidView}
          >
            {/* Header */}
            <ThemedView style={styles.header}>
              <TouchableOpacity onPress={() => toggleSidebar(true)}>
                <Ionicons name="menu" size={28} color={iconColor} />
              </TouchableOpacity>
              <ThemedText style={styles.headerTitle}>
                Hỏi Sầu Riêng Đi
              </ThemedText>
            </ThemedView>

            {/* Chat body */}
            <View style={styles.chatContainer}>
              {messages.length === 0 ? (
                <View style={styles.welcomeContainer}>
                  <ThemedText style={styles.welcomeText}>
                    Hãy hỏi tôi bất cứ điều gì về sầu riêng 🍈
                  </ThemedText>
                </View>
              ) : (
                <FlatList
                  data={messages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <MessageComponent text={item.text} isUser={item.isUser} />
                  )}
                  contentContainerStyle={styles.messagesList}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>

            {/* Chat input */}
            <ChatInput
              message={inputMessage}
              setMessage={setInputMessage}
              sendMessage={handleSend}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Overlay (click outside to close sidebar) */}
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <TouchableWithoutFeedback onPress={() => toggleSidebar(false)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>
    </SafeAreaView>
  </GestureHandlerRootView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,1)',
    zIndex: 150,
  },
});
