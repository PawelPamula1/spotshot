import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (reason: string) => void;
};

export function ReportModal({ visible, onClose, onPick }: Props) {
  const [reason, setReason] = useState("");

  const submit = () => {
    if (!reason.trim()) return;
    onPick(reason.trim());
    setReason("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Report spot</Text>

          <TextInput
            placeholder="What's wrong? (required)"
            placeholderTextColor="#999"
            value={reason}
            onChangeText={setReason}
            style={styles.input}
            multiline
          />

          <View style={styles.row}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, styles.btnGhost]}
            >
              <Text style={styles.btnGhostText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submit}
              style={[
                styles.btn,
                reason.trim() ? styles.btnPrimary : styles.btnDisabled,
              ]}
              disabled={!reason.trim()}
            >
              <Text style={styles.btnPrimaryText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#191922",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#262637",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    color: "#fff",
    backgroundColor: "#14141A",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#262637",
    minHeight: 60,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
    gap: 10,
  },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  btnGhost: { backgroundColor: "transparent" },
  btnGhostText: { color: "#A5A7B4", fontWeight: "700" },
  btnPrimary: { backgroundColor: "#6D5FFD" },
  btnDisabled: { backgroundColor: "#333" },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
});
