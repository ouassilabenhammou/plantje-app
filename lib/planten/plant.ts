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

// (optioneel maar handig) types voor verzorgen
export type CareFrequencyDB = "daily" | "weekly" | "monthly";

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
export async function createPlants(formData: FormData): Promise<Plant> {
  const name = (formData.get("name") ?? "").toString().trim();
  const slug = (formData.get("slug") ?? "").toString().trim();
  const species = (formData.get("species") ?? "").toString().trim();
  const location = (formData.get("location") ?? "").toString().trim();

  if (!name) throw new Error("Name is required");
  if (!slug) throw new Error("Slug is required");

  const { data, error } = await supabase
    .from("plants")
    .insert({
      name,
      slug,
      species,
      location,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Create error:", error);
    throw new Error(`Failed to create plant: ${error.message}`);
  }

  return data as Plant;
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

// DELETE
export async function deletePlant(id: string) {
  const { error } = await supabase.from("plants").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Failed to delete plant: ${error.message}`);
  }
}

// Planten verzorgen

export async function createUserPlant(params: {
  userId: string;
  plantId: string;
  frequency: CareFrequencyDB;
}) {
  const { data, error } = await supabase
    .from("user_plants")
    .insert({
      user_id: params.userId,
      plant_id: params.plantId,
      frequency: params.frequency,
      timezone: "Europe/Amsterdam",
      start_date: new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) throw error;
  return data; // bevat o.a. id (user_plant_id)
}

function firstDueAtIso() {
  const d = new Date();
  d.setHours(9, 0, 0, 0); // vandaag 09:00
  return d.toISOString();
}

export async function createFirstCareTask(userPlantId: string) {
  const { error } = await supabase.from("care_tasks").insert({
    user_plant_id: userPlantId,
    due_at: firstDueAtIso(),
    status: "pending",
  });
  if (error) throw error;
}

// GET PLANTS WITH TODAY TASK INFO
export async function getPlantsWithTodayTask() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return [];

  const startOfToday = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  })();

  const endOfToday = (() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  })();

  // Haal user_plants op met bijbehorende plants
  const { data: userPlants, error: userPlantsError } = await supabase
    .from("user_plants")
    .select(
      `
      id,
      plant_id,
      plants!inner (
        id,
        slug,
        name,
        species,
        location,
        image_url,
        is_hidden,
        created_at
      )
    `
    )
    .eq("user_id", user.id)
    .eq("plants.is_hidden", false)
    .order("plants.created_at", { ascending: false });

  if (userPlantsError) {
    console.error("User plants fetch error:", userPlantsError);
    throw userPlantsError;
  }

  if (!userPlants || userPlants.length === 0) return [];

  // Haal alle user_plant_ids op
  const userPlantIds = userPlants.map((up) => up.id);

  // Haal alle taken van vandaag op voor deze user_plants
  const { data: tasks, error: tasksError } = await supabase
    .from("care_tasks")
    .select("id, user_plant_id, due_at")
    .eq("status", "pending")
    .gte("due_at", startOfToday)
    .lte("due_at", endOfToday)
    .in("user_plant_id", userPlantIds);

  if (tasksError) {
    console.error("Tasks fetch error:", tasksError);
    throw tasksError;
  }

  // Maak een map van user_plant_id -> task info
  const taskMap = new Map<
    string,
    { taskId: string; dueAt: string }
  >();
  tasks?.forEach((task) => {
    taskMap.set(task.user_plant_id, {
      taskId: task.id,
      dueAt: task.due_at,
    });
  });

  // Map de data naar het gewenste formaat
  return userPlants.map((up) => {
    const plant = up.plants as any;
    const taskInfo = taskMap.get(up.id);
    const hasTaskToday = !!taskInfo;

    return {
      id: plant.id,
      slug: plant.slug,
      name: plant.name,
      species: plant.species,
      location: plant.location,
      image_url: plant.image_url,
      created_at: plant.created_at,
      is_hidden: plant.is_hidden,
      hasTaskToday,
      taskId: taskInfo?.taskId,
      userPlantId: up.id,
      dueAt: taskInfo?.dueAt,
    };
  });
}
