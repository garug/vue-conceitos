<template>
  Showing estimates for climate zones
  <label v-for="climateZone in climateZones" :key="climateZone">
    <input
      type="checkbox"
      name="selected"
      v-model="selectedClimateZones"
      :value="climateZone"
    />
    {{ climateZone }}
  </label>
  <label>
    <input
      type="checkbox"
      name="selected"
      :checked="selectedClimateZones.length === climateZones.length"
      @change="selectedClimateZones = climateZones"
    />
    All
  </label>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";

const BuildingStock = defineComponent({
  name: "BuildingStock",

  setup() {
    const store = useStore();

    const climateZones = store.state.city.climateZone.available;

    const prevValue = store.state.climateZoneBuildingStock;

    const selectedClimateZones = ref(
      prevValue.length === 0 ? [climateZones[0]] : prevValue
    );

    watchEffect(() => {
      store.commit("setClimateZoneBuildingStock", selectedClimateZones.value);
    });

    return { climateZones, selectedClimateZones };
  },
});

export default BuildingStock;
</script>
