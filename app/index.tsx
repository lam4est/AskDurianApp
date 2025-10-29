import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import MessageComponent from "@/components/MessageComponent";
import ChatInput from "@/components/ChatInput";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Sidebar, { SIDEBAR_WIDTH } from "@/components/Sidebar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay
} from "react-native-reanimated";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const background = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "text");

  const sidebarOffset = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const toggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    sidebarOffset.value = withTiming(open ? SIDEBAR_WIDTH : 0, {
      duration: 250,
    });
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      simulateBotTyping("Xin chào! Tôi là Sầu Riêng AI 🍈");
    }, 800);
  };

  const simulateBotTyping = (fullText: string) => {
    setIsTyping(false);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "",
      isUser: false,
    };
    setMessages((prev) => [...prev, botMessage]);

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText.slice(0, index + 1);
          return updated;
        });
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
  };

  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarOffset.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: (sidebarOffset.value / SIDEBAR_WIDTH) * 0.3,
    display: sidebarOffset.value > 0 ? "flex" : "none",
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: background }}
        edges={["top", "left", "right", "bottom"]}
      >
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => toggleSidebar(false)}
          offset={sidebarOffset}
        />

        {/* Main Content */}
        <Animated.View style={[{ flex: 1 }, mainAnimatedStyle]}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
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
                <ImageBackground
                  source={require("@/assets/images/durian.png")}
                  resizeMode="contain"
                  style={styles.centerImageBackground}
                  imageStyle={styles.centerImageStyle}
                />

                {messages.length === 0 ? (
                  <View style={styles.welcomeContainer}>
                    <ThemedText style={styles.welcomeText}>
                      Hãy hỏi tôi bất cứ điều gì về sầu riêng 🍈
                    </ThemedText>
                  </View>
                ) : (
                  <FlatList
                    ref={flatListRef}
                    data={[
                      ...messages,
                      ...(isTyping
                        ? [{ id: "typing", text: "typing", isUser: false }]
                        : []),
                    ]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) =>
                      item.id === "typing" ? (
                        <TypingIndicator />
                      ) : (
                        <MessageComponent
                          text={item.text}
                          isUser={item.isUser}
                        />
                      )
                    }
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

        {/* Overlay khi mở Sidebar */}
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
          <TouchableWithoutFeedback onPress={() => toggleSidebar(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

function TypingIndicator() {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    dot1.value = withRepeat(withTiming(1, { duration: 400 }), -1, true);
    dot2.value = withDelay(200, withRepeat(withTiming(1, { duration: 400 }), -1, true));
    dot3.value = withDelay(400, withRepeat(withTiming(1, { duration: 400 }), -1, true));
  }, []);

  const dotStyle = (dot: any) =>
    useAnimatedStyle(() => ({
      opacity: dot.value,
      transform: [
        { scale: withTiming(dot.value === 1 ? 1.4 : 1, { duration: 400 }) },
      ],
    }));

  const animatedDot1 = dotStyle(dot1);
  const animatedDot2 = dotStyle(dot2);
  const animatedDot3 = dotStyle(dot3);

  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "flex-start",
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "#f1f1f1",
        borderRadius: 16,
        padding: 10,
      }}
    >
      <Animated.View style={[styles.dot, animatedDot1]} />
      <Animated.View style={[styles.dot, animatedDot2]} />
      <Animated.View style={[styles.dot, animatedDot3]} />
    </View>
  );
}


const styles = StyleSheet.create({
  keyboardAvoidView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  chatContainer: {
    flex: 1,
    justifyContent: "center",
  },
  messagesList: {
    padding: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,1)",
    zIndex: 150,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 2,
  },

  centerImageBackground: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
    height: 300,
    opacity: 0.2,
    zIndex: 0,
  },
  centerImageStyle: {
    width: "100%",
    height: "100%",
  },
});
