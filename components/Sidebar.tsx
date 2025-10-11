import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const { width } = Dimensions.get('window');
export const SIDEBAR_WIDTH = width * 0.7;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  offset: SharedValue<number>;
}

export default function Sidebar({ isOpen, onClose, offset }: SidebarProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    offset.value = withTiming(isOpen ? SIDEBAR_WIDTH : 0, { duration: 300 });
  }, [isOpen]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < -50) runOnJS(onClose)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value - SIDEBAR_WIDTH }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          { backgroundColor, borderRightColor: borderColor },
        ]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header ngắn gọn */}
          <ThemedView style={styles.header}>
            <Ionicons name="person-circle-outline" size={36} color={textColor} />
            <ThemedText style={styles.userName}>Sầu Riêng AI</ThemedText>
          </ThemedView>

          {/* Cuộc trò chuyện mẫu */}
          <ScrollView style={styles.chatSamples}>
            <SectionTitle title="Cuộc trò chuyện mẫu" />
            <ChatSample text="Tác dụng của sầu riêng với sức khỏe 🍈" />
            <ChatSample text="Sầu riêng nên bảo quản như thế nào?" />
            <ChatSample text="Mẹo chọn sầu riêng ngon?" />
            <ChatSample text="Phân biệt sầu riêng Ri6 và Monthong" />
          </ScrollView>

          {/* Menu phía dưới */}
          <ThemedView style={styles.footer}>
            <MenuItem icon="book-outline" label="Hướng dẫn" />
            <MenuItem icon="settings-outline" label="Cài đặt" />
            <MenuItem icon="help-circle-outline" label="Trợ giúp" />
            <MenuItem icon="log-out-outline" label="Đăng xuất" />
          </ThemedView>
        </SafeAreaView>
      </Animated.View>
    </GestureDetector>
  );
}

// --- Các component nhỏ gọn gàng ---
function SectionTitle({ title }: { title: string }) {
  const color = useThemeColor({}, 'text');
  return <ThemedText style={[styles.sectionTitle, { color }]}>{title}</ThemedText>;
}

function ChatSample({ text }: { text: string }) {
  const color = useThemeColor({}, 'text');
  return (
    <TouchableOpacity style={styles.chatSampleButton}>
      <Ionicons name="chatbubble-ellipses-outline" size={20} color={color} />
      <ThemedText style={styles.chatSampleText}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

function MenuItem({ icon, label }: { icon: any; label: string }) {
  const color = useThemeColor({}, 'text');
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={22} color={color} />
      <ThemedText style={styles.menuLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    zIndex: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,200,200,0.2)',
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 8,
  },
  chatSamples: {
    flex: 1,
    marginTop: 8,
  },
  chatSampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  chatSampleText: {
    marginLeft: 12,
    fontSize: 15,
    flexShrink: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,200,200,0.2)',
    paddingTop: 10,
    paddingBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 14,
    fontWeight: '500',
  },
});
