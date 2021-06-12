import { sortedUniqBy } from "lodash";

export function findCards(keep? : number) {
  const arr = Array.from({ length: 100 })
    .map((_, i) => {
      return {
        id: i === 0 && keep ? keep : Number((i * Math.random() * 10).toFixed(0)),
        measures: [
          {
            name: "Cool Roof",
            simplePayback: Math.random() * 100,
            incrementalCost: Math.random() * 100,
          },
          {
            name: "Duct Sealing",
            simplePayback: Math.random() * 100,
            incrementalCost: Math.random() * 100,
          },
        ],
      };
    })
    .sort((a, b) => a.id - b.id);
  return sortedUniqBy(arr, (e) => e.id);
}
