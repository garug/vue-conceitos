<template>
  <label v-for="climateZone in climateZones" :key="climateZone">
    <input
      type="radio"
      name="selected"
      v-model="selectedClimateZone"
      :value="climateZone"
    />
    {{ climateZone }}
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";

const Results = defineComponent({
  name: "Results",

  setup() {
    const store = useStore();

    const climateZones = store.state.city.climateZone.available;

    const selectedClimateZone =
      store.state.filters.climateZone || climateZones[0];

    return { climateZones, selectedClimateZone };
  },
});

export default Results;
</script>
