<template>
  <div class="menu">
    <label v-for="climateZone in climateZones" :key="climateZone">
      <input
        type="radio"
        name="selected"
        v-model="selectedClimateZone"
        :value="climateZone"
      />
      {{ climateZone }}
    </label>

    <div v-for="filter in possibleFilters" :key="filter">
      {{ filter }}
      <label v-for="optFilter in filters[filter]" :key="optFilter">
        <input
          type="checkbox"
          name="selected"
          :value="optFilter"
          v-model="selectedFilters[filter]"
        />
        {{ optFilter }}
      </label>
    </div>
  </div>

  <div
    v-for="(card, i) in cards"
    :key="card.id"
    :id="card.id"
    class="card"
    :class="activeCard.id === card.id && 'active-card'"
    @click="activeCard = card"
    :ref="
      (el) => {
        if (el) divsCards[i] = el;
      }
    "
  >
    Identification {{ card.id }}
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
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { findCards } from "../services/cards";

const Results = defineComponent({
  name: "Results",

  setup() {
    const store = useStore();

    const router = useRouter();

    const route = useRoute();

    const climateZones = store.state.city.climateZone.available;

    const selectedClimateZone = ref(
      store.state.filters.climateZone || route.query.value || climateZones[0]
    );

    const filters = reactive({
      buildings: ["Building1", "Building2"],
      types: ["Type1", "Type2"],
    });

    const possibleFilters = computed(() => Object.keys(filters));

    const selectedFilters = reactive(
      Object.keys(filters).reduce((acc, filter) => {
        acc[filter] = (route.query[filter] as string)?.split(",") || [];
        return acc;
      }, {} as any)
    );

    const activeFromQuery = Number(route.query.active);

    const cards = ref(findCards(activeFromQuery));

    const activeCard = ref(
      activeFromQuery
        ? cards.value.find((e) => e.id === activeFromQuery)
        : cards.value[0]
    );

    const divsCards = ref<Array<HTMLDivElement>>([]);

    function handleFiltersQuery(filters: Array<String>) {
      const joinedFilters = Object.entries(filters).reduce((acc, e) => {
        acc[e[0]] = e[1].length > 0 ? (e[1] as any).join(",") : undefined;
        return acc;
      }, {} as any);

      const query = {
        ...route.query,
        ...joinedFilters,
      };

      router.replace({ query });
    }

    function handlePositionActiveCard() {
      const activeDiv = divsCards.value.find((e) =>
        e.classList.contains("active-card")
      );

      if (activeDiv) {
        setTimeout(
          () =>
            window.scrollTo({
              top: activeDiv.offsetTop - activeDiv.offsetHeight,
              behavior: "smooth",
            }),
          100
        );
      }
    }

    onMounted(() => handlePositionActiveCard());

    watch(
      () => selectedFilters,
      (state) => {
        cards.value = findCards(activeCard.value?.id);

        handleFiltersQuery(state);
        handlePositionActiveCard();
      },
      { deep: true, flush: "post" }
    );

    watchEffect(() => {
      const value = selectedClimateZone.value;

      const query = {
        ...route.query,
        value,
      };

      router.replace({ query });
    });

    watchEffect(() => {
      const query = {
        ...route.query,
        active: activeCard.value?.id,
      };

      router.replace({ query });
    });

    return {
      climateZones,
      selectedClimateZone,
      selectedFilters,
      possibleFilters,
      filters,
      cards,
      activeCard,
      divsCards,
    };
  },
});

export default Results;
</script>

<style scoped>
.menu {
  position: fixed;
  right: 0;
  padding: 15px;
  background: white;
}

.active-card {
  background: #dff9fb;
}
</style>
