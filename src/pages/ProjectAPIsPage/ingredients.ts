export const allIngredients = [
    { icon: "🍃", label: "Spring Boot", swagger: "https://www.meetyuwen.com/springapp/v3/api-docs" },
    { icon: "⚡️", label: "FastAPI", swagger: "https://www.meetyuwen.com/api/openapi.json"},
    { icon: "🏠", label: "Spring Boot - Complex Management",swagger: "https://www.meetyuwen.com/complex/v2/api-docs?group=Standard%20interface"}
];

const [tomato, lettuce, potato] = allIngredients;
export const initialTabs = [tomato, lettuce, potato];

export function getNextIngredient(ingredients) {
    const existing = new Set(ingredients);
    return allIngredients.find((ingredient) => !existing.has(ingredient));
}
