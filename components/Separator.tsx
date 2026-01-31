import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const Separator = () => <View style={styles.separator} />

const styles = StyleSheet.create((theme) => ({
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginLeft: 50,
    },
}))