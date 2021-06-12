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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const BuildingStock = defineComponent({
  name: "BuildingStock",

  setup() {
    const store = useStore();

    const route = useRoute();

    const router = useRouter();

    const climateZones = store.state.city.climateZone.available;

    const prevValue = store.state.climateZoneBuildingStock;

    const selectedClimateZones = ref([] as Array<string>);

    if (prevValue.length > 0) {
      selectedClimateZones.value = prevValue;
    } else if (route.query.value) {
      selectedClimateZones.value = (route.query.value as string).split(",");
    } else {
      selectedClimateZones.value = [climateZones[0]];
    }

    watchEffect(() => {
      const value = selectedClimateZones.value;

      const query = value.length > 0 ? { value: value.join(",") } : {};

      router.replace({ query });

      store.commit("setClimateZoneBuildingStock", value);
    });

    return { climateZones, selectedClimateZones };
  },
});

export default BuildingStock;
</script>
