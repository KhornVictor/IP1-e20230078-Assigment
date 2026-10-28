<script setup lang="ts">
import { computed, ref, watch } from "vue";
import EventList from "./components/EventList.vue";
import { initialEvents } from "./data/events";
import type { CampusEvent } from "./types";

const STORAGE_KEY = "campus-events:myBookings";

function loadSavedBookings(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === "number")) {
      return parsed;
    }
  } catch {
    // Stored text might not be valid JSON
  }
  return [];
}

const saved = loadSavedBookings();

// TODO 1: a ref `myBookings` holding the ids of the events I booked (one entry per seat)
const myBookings = ref<number[]>(saved);

// A reactive copy of the hard-coded events, augmented with any persisted bookings
const events = ref<CampusEvent[]>(
  initialEvents.map((e) => {
    const bookedCount = saved.filter((id) => id === e.id).length;
    return { ...e, booked: e.booked + bookedCount };
  })
);

// TODO 2: a computed `bookingCount`
const bookingCount = computed(() => myBookings.value.length);

// TODO 3: onBook(id): find the event; if it still has a seat,
//         increase its `booked` and add the id to myBookings
function onBook(id: number) {
  const event = events.value.find((e) => e.id === id);
  if (event && event.booked < event.capacity) {
    event.booked++;
    myBookings.value.push(id);
  }
}

// TODO 4 (bonus): keep my bookings after a page reload
//   - watch myBookings and save it to localStorage (JSON.stringify)
//   - read it back when the app starts, and add those seats to `booked`
watch(
  myBookings,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch {
      // Ignore storage errors
    }
  },
  { deep: true }
);
</script>

<template>
  <main>
    <header>
      <h1>Campus Events</h1>
      <!-- TODO 5: show the real count ("1 seat" / "N seats") -->
      <p class="mine">
        You have booked {{ bookingCount }} {{ bookingCount === 1 ? "seat" : "seats" }}.
      </p>
    </header>
    <EventList :events="events" @book="onBook" />
  </main>
</template>

<style scoped>
header { margin-bottom: 16px; }
.mine { color: #6b7280; margin: 0; }
</style>
