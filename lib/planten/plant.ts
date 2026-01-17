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

// UPDATE

export async function updatePlant(
  id: string,
  formData: FormData
): Promise<Plant> {
  const name = (formData.get("name") ?? "").toString().trim();
  const slug = (formData.get("slug") ?? "").toString().trim();
  const species = (formData.get("species") ?? "").toString().trim();
  const location = (formData.get("location") ?? "").toString().trim();

  if (!name) throw new Error("Name is required");
  if (!slug) throw new Error("Slug is required");

  const { data, error } = await supabase
    .from("plants")
    .update({
      name,
      slug,
      species: species || null,
      location: location || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Update error:", error);
    throw new Error(`Failed to update plant: ${error.message}`);
  }

  return data as Plant;
}

// GET ONE (needed for edit form)
export async function getPlant(id: string): Promise<Plant | null> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Fetch error:", error);
    return null;
  }

  return data as Plant;
}
// GET ONE BY SLUG
export async function getPlantBySlug(slug: string) {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Fetch by slug error:", error);
    return null;
  }

  return data;
}
