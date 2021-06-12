import { createStore } from "vuex";

export default createStore({
  state: {
    city: {
      name: "Brasília",
      climateZone: {
        available: [7, 10],
      },
    },
    filters: {
      climateZone: 0,
    },
    climateZoneBuildingStock: [],
  },
  mutations: {
    setClimateZoneBuildingStock(state, climateZones) {
      const selected = climateZones.length === 1 ? climateZones[0] : 0;
      state.filters.climateZone = selected;
      state.climateZoneBuildingStock = climateZones;
    },
  },
  actions: {},
  modules: {},
});
