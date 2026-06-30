export const TOPIC_STYLE: Record<string, { bg: string; fg: string; icon: string }> = {
  DSA: { bg: "#EDE9FE", fg: "#7C3AED", icon: "ti-binary-tree" },
  OS: { bg: "#FCE7F3", fg: "#DB2777", icon: "ti-cpu" },
  DBMS: { bg: "#DBEAFE", fg: "#2563EB", icon: "ti-table" },
  General: { bg: "#FEF3C7", fg: "#D97706", icon: "ti-bulb" },
};

export function topicStyle(topic: string) {
  return TOPIC_STYLE[topic] || TOPIC_STYLE.General;
}

export function getRetColor(r: number) {
  return r >= 60 ? "#059669" : r >= 40 ? "#D97706" : "#DB2777";
}
export function getRetBg(r: number) {
  return r >= 60 ? "#D1FAE5" : r >= 40 ? "#FEF3C7" : "#FCE7F3";
}