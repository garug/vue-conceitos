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
      <tr>
        <td><button @click="toggle = !toggle">Toggle Details</button></td>
      </tr>
    </table>

    <p class="toggle" :class="activeCard.id === card.id && toggle && 'toggle-on'">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat,
      erat vel molestie porta, eros neque dapibus leo, eget sagittis tellus
      massa elementum urna. Etiam nibh nulla, tincidunt ut est iaculis, molestie
      faucibus augue. Aenean mattis est dictum sollicitudin aliquam. Vestibulum
      viverra orci quis tellus facilisis, in semper nibh ornare. Proin posuere
      ipsum a mauris consectetur tempus sit amet ac quam. Nam in turpis rhoncus,
      varius lectus a, dapibus lectus. Sed lacus leo, semper nec consequat nec,
      condimentum sed lacus. Nunc ornare aliquet mollis. Nam felis lorem,
      accumsan quis urna et, placerat maximus ante. Ut at nibh magna. Phasellus
      ut elementum mi, a viverra leo. Morbi orci tellus, laoreet non lorem a,
      ullamcorper sollicitudin libero. Curabitur tellus leo, dignissim ac metus
      a, sollicitudin viverra orci. Aliquam erat volutpat. Quisque lorem erat,
      laoreet ultricies tristique at, dignissim vitae leo. Aliquam gravida
      pellentesque mauris ut volutpat.
    </p>

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

    const toggle = ref(false);

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
      toggle
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

.toggle {
  max-height: 0;
  transition: all .4s;
  overflow: hidden;
}

.toggle-on {
  max-height: 130px;
}
</style>
