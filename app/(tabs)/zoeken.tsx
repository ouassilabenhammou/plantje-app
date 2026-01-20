import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getSpeciesDetails, getSpeciesList } from "@/lib/api/perenual";

type SpeciesItem = {
  id: number;
  common_name: string | null;
  scientific_name: string[] | string | null;
  family: string | null;
  cycle: string | null;
  watering: string | null;
  sunlight: string[] | string | null;
  default_image?: {
    thumbnail?: string | null;
    small_url?: string | null;
    regular_url?: string | null;
    original_url?: string | null;
  } | null;
};

type SpeciesListResponse = {
  data: SpeciesItem[];
  to?: number;
  per_page?: number;
  current_page?: number;
  from?: number;
  last_page?: number;
  total?: number;
};

const Zoeken = () => {
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [items, setItems] = useState<SpeciesItem[]>([]);
  const [query, setQuery] = useState("");

  const [lastPage, setLastPage] = useState<number | null>(null);

  async function load(p: number) {
    try {
      if (p === 1) setLoading(true);
      else setPageLoading(true);

      setError(null);

      const res: SpeciesListResponse = await getSpeciesList(p, perPage);

      const baseItems = res?.data ?? [];

      const enriched = await Promise.all(
        baseItems.map(async (plant) => {
          try {
            const details = await getSpeciesDetails(plant.id);

            return {
              ...plant,
              // details overschrijven/aanvullen
              family: details.family ?? plant.family,
              cycle: details.cycle ?? plant.cycle,
              watering: details.watering ?? plant.watering,
              sunlight: details.sunlight ?? plant.sunlight,
            };
          } catch {
            return plant; // als details faalt: toon gewoon wat je al had
          }
        }),
      );

      setItems(enriched);
      setLastPage(typeof res?.last_page === "number" ? res.last_page : null);
    } catch (e: any) {
      setError(e?.message ?? "Er ging iets mis bij het ophalen van planten.");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  }

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((p) => {
      const common = (p.common_name ?? "").toLowerCase();
      const scientific = Array.isArray(p.scientific_name)
        ? p.scientific_name.join(" ").toLowerCase()
        : (p.scientific_name ?? "").toLowerCase();
      const family = (p.family ?? "").toLowerCase();

      return common.includes(q) || scientific.includes(q) || family.includes(q);
    });
  }, [items, query]);

  const canPrev = page > 1;
  const canNext = lastPage ? page < lastPage : true;

  const renderItem = ({ item }: { item: SpeciesItem }) => {
    const img =
      item?.default_image?.small_url ||
      item?.default_image?.thumbnail ||
      item?.default_image?.regular_url ||
      item?.default_image?.original_url ||
      null;

    const scientific = Array.isArray(item.scientific_name)
      ? item.scientific_name.join(", ")
      : (item.scientific_name ?? "—");

    const sunlight = Array.isArray(item.sunlight)
      ? item.sunlight.join(", ")
      : (item.sunlight ?? "—");

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.thumbWrap}>
            {img ? (
              <Image source={{ uri: img }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]}>
                <Text style={styles.thumbPlaceholderText}>Geen foto</Text>
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text style={styles.title}>
              {item.common_name?.trim() ? item.common_name : "Onbekende plant"}
            </Text>

            <Text style={styles.meta}>
              <Text style={styles.label}>Wetenschappelijk: </Text>
              {scientific}
            </Text>

            <Text style={styles.meta}>
              <Text style={styles.label}>Familie: </Text>
              {item.family ?? "—"}
            </Text>

            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>🌱 {item.cycle ?? "—"}</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>💧 {item.watering ?? "—"}</Text>
              </View>
            </View>

            <Text style={styles.meta}>
              <Text style={styles.label}>Zonlicht: </Text>
              {sunlight}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Zoeken</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Zoek op naam, wetenschappelijke naam of familie…"
        style={styles.search}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.centerText}>Planten laden…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Oeps</Text>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable style={styles.retryBtn} onPress={() => load(page)}>
            <Text style={styles.retryBtnText}>Opnieuw proberen</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.centerText}>
                  Geen resultaten voor “{query.trim()}”.
                </Text>
              </View>
            }
          />

          <View style={styles.pagination}>
            <Pressable
              onPress={() => canPrev && setPage((p) => p - 1)}
              style={[styles.pageBtn, !canPrev && styles.pageBtnDisabled]}
            >
              <Text style={styles.pageBtnText}>Vorige</Text>
            </Pressable>

            <Pressable
              onPress={() => canNext && setPage((p) => p + 1)}
              style={[styles.pageBtn, !canNext && styles.pageBtnDisabled]}
            >
              <Text style={styles.pageBtnText}>Volgende</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Zoeken;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },

  listContent: { paddingBottom: 90 },

  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  row: { flexDirection: "row", gap: 12 },
  thumbWrap: { width: 88 },
  thumb: { width: 88, height: 88, borderRadius: 14 },
  thumbPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  thumbPlaceholderText: { fontSize: 12, color: "#666" },

  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  meta: { fontSize: 13, color: "#222", marginTop: 2 },
  label: { fontWeight: "700" },
  chipsRow: { flexDirection: "row", gap: 8, marginTop: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
  },
  chipText: { fontSize: 12 },
  smallId: { marginTop: 6, fontSize: 12, color: "#666" },

  pagination: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
  pageBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { fontWeight: "700" },
  pageInfo: { alignItems: "center", gap: 6 },
  pageInfoText: { fontWeight: "700" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  centerText: { color: "#333" },

  errorTitle: { fontSize: 18, fontWeight: "800" },
  errorText: { textAlign: "center", color: "#333" },
  retryBtn: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  retryBtnText: { color: "#fff", fontWeight: "700" },
});
