import type { Restaurant } from "@/lib/types";

export const restaurant: Restaurant = {
  id: "rest-001",
  name: "Burger House",
  language: "es",
  rating: 4.6,
  reviewsCount: 1247,
  defectRate: 2.3,
  products: [
    {
      id: "p1",
      name: "Hamburguesa Doble Queso",
      price: 12.5,
      imageUrl: "/products/burger.jpg",
    },
    {
      id: "p2",
      name: "Papas Grandes",
      price: 4.0,
      imageUrl: "/products/fries.jpg",
    },
  ],
};
