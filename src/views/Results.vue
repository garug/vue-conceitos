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

  <div v-for="filter in usedFilters" :key="filter">
    {{ filter }}
    <label v-for="optFilter in filters[filter]" :key="optFilter">
      <input type="checkbox" name="selected" :value="optFilter" />
      {{ optFilter }}
    </label>
  </div>

  <div v-for="card in cards" :id="`card-${card.id}`" :key="card.id">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Payback</th>
          <th>Incremental Cost</th>
        </tr>
      </thead>
      <tr v-for="measure in card.measures" :key="measure.name">
        <td>{{ measure.name }}</td>
        <td>{{ measure.simplePayback }}</td>
        <td>{{ measure.incrementalCost }}</td>
      </tr>
    </table>

    <hr />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import { findCards } from "../services/cards";

const Results = defineComponent({
  name: "Results",

  setup() {
    const store = useStore();

    const climateZones = store.state.city.climateZone.available;

    const selectedClimateZone =
      store.state.filters.climateZone || climateZones[0];

    const filters = reactive({
      buildings: ["Building1", "Building2"],
      types: ["Type1", "Type2"],
    });

    const cards = ref(findCards());

    const usedFilters = computed(() => Object.keys(filters));

    return {
      climateZones,
      selectedClimateZone,
      usedFilters,
      filters,
      cards,
    };
  },
});

export default Results;
</script>
