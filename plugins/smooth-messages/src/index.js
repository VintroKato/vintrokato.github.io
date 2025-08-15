import { before } from "@vendetta/patcher";
import { findByDisplayName } from "@vendetta/metro";
import { LayoutAnimation, UIManager, Platform } from "react-native";

let patch;

export default {
    onLoad: () => {
        // Включаем LayoutAnimation на Android
        if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        // Ищем компонент списка сообщений
        const MessageList = findByDisplayName("MessageList");
        if (!MessageList) return;

        // Патчим, чтобы анимировать добавление сообщений
        patch = before("componentDidUpdate", MessageList.prototype, function (prevProps) {
            if (prevProps?.messages?.length !== this.props?.messages?.length) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }
        });
    },

    onUnload: () => {
        if (patch) patch();
    },
};
