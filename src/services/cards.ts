export function findCards() {
  return Array.from({ length: 100 }).map((_, i) => {
    return {
      id: i,
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
  });
}
