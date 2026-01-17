import { supabase } from "@/lib/supabase/supabase";

export type Plant = {
  id: string;
  slug: string;
  name: string;
  species: string;
  location: string;
  image_url: string | null;
  is_hidden: boolean;
  created_at: string;
};

// GET ALL
export async function getAllPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    throw error;
  }

  return data || [];
}

// CREATE
export async function createPlants(formData: FormData) {
  const name = (formData.get("name") ?? "").toString().trim();
  const slug = (formData.get("slug") ?? "").toString().trim();
  const species = (formData.get("species") ?? "").toString().trim();
  const location = (formData.get("location") ?? "").toString().trim();

  if (!name) {
    throw new Error("Name is required");
  }

  if (!slug) {
    throw new Error("Slug is required");
  }

  const { error } = await supabase.from("plants").insert({
    name,
    slug,
    species,
    location,
  });

  if (error) {
    console.error("Create error:", error);
    throw new Error(`Failed to create plant: ${error.message}`);
  }
}
