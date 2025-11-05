export const demoProducts = [
  {
    id: "1",
    name: "Cà phê sữa đá",
    slug: "ca-phe-sua-da",
    category: "coffee",
    price: 29000,
    image: "/placeholder.jpg",
    description: "Cà phê phin truyền thống pha với sữa đặc, đá mát lạnh",
    rating: 4.8,
    available: true,
    sizes: [
      { name: "M", priceDiff: 0 },
      { name: "L", priceDiff: 5000 }
    ],
    toppings: [
      { name: "Trân châu", price: 5000 },
      { name: "Thạch cà phê", price: 5000 }
    ]
  },
  {
    id: "2",
    name: "Bạc xỉu",
    slug: "bac-xiu",
    category: "coffee",
    price: 32000,
    image: "/placeholder.jpg",
    description: "Sữa tươi pha cà phê, ngọt ngào dịu nhẹ",
    rating: 4.9,
    available: true,
    sizes: [
      { name: "M", priceDiff: 0 },
      { name: "L", priceDiff: 5000 }
    ],
    toppings: [
      { name: "Trân châu", price: 5000 },
      { name: "Thạch cà phê", price: 5000 }
    ]
  },
  {
    id: "3",
    name: "Trà sữa trân châu",
    slug: "tra-sua-tran-chau",
    category: "tea",
    price: 35000,
    image: "/placeholder.jpg",
    description: "Trà sữa Đài Loan với trân châu đen dai ngon",
    rating: 4.7,
    available: true,
    sizes: [
      { name: "M", priceDiff: 0 },
      { name: "L", priceDiff: 5000 }
    ],
    toppings: [
      { name: "Trân châu trắng", price: 5000 },
      { name: "Thạch dừa", price: 5000 },
      { name: "Pudding", price: 8000 }
    ]
  },
  {
    id: "4",
    name: "Cappuccino",
    slug: "cappuccino",
    category: "coffee",
    price: 45000,
    image: "/placeholder.jpg",
    description: "Espresso Ý kết hợp sữa tươi tạo bọt mịn",
    rating: 4.9,
    available: true,
    sizes: [
      { name: "M", priceDiff: 0 },
      { name: "L", priceDiff: 8000 }
    ],
    toppings: []
  },
  {
    id: "5",
    name: "Bánh mì que",
    slug: "banh-mi-que",
    category: "food",
    price: 15000,
    image: "/placeholder.jpg",
    description: "Bánh mì que giòn tan, nhiều vị",
    rating: 4.6,
    available: true,
    sizes: [],
    toppings: []
  }
]

export const categories = [
  { id: "all", name: "Tất cả", icon: "☕" },
  { id: "coffee", name: "Cà phê", icon: "☕" },
  { id: "tea", name: "Trà sữa", icon: "🧋" },
  { id: "food", name: "Đồ ăn", icon: "🍰" }
]
