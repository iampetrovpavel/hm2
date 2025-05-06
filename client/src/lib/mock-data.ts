import type { Request, Quote, Order } from "@/lib/types"

// Helper function to generate random IDs
let i = 0
const generateId = () => (i++).toString()

// Generate mock requests
export const mockRequests: Request[] = [
  {
    id: generateId(),
    deliveryLocations: [
      {
        id: generateId(),
        address: {
          street: "123 Main St",
          city: "Austin",
          state: "TX",
          zipCode: "78701",
          country: "USA",
        },
        products: [
          {
            id: generateId(),
            name: "Ready-mix Concrete",
            materialType: "concrete",
            quantity: 10,
          },
          {
            id: generateId(),
            name: "Construction Gravel",
            materialType: "gravel",
            quantity: 5,
          },
        ],
        truckType: "mixer",
        deliveryDay: "2025-05-01T10:00:00Z",
      }
    ],
    contactInformation: {
      name: "John Doe",
      email: "john@example.com",
      phone: "512-555-1234",
      company: "ABC Construction",
    },
    taxExempt: false,
    createdAt: "2025-04-10T14:30:00Z",
  },
  {
    id: generateId(),
    deliveryLocations: [
      {
        id: generateId(),
        address: {
          street: "456 Oak Ave",
          city: "Austin",
          state: "TX",
          zipCode: "78704",
          country: "USA",
        },
        products: [
          {
            id: generateId(),
            name: "Portland Cement",
            materialType: "cement",
            quantity: 5,
          },
          {
            id: generateId(),
            name: "Fine Sand",
            materialType: "sand",
            quantity: 3,
          },
        ],
        truckType: "flatbed",
        deliveryDay: "2025-05-05T09:00:00Z",
      },
      {
        id: generateId(),
        address: {
          street: "789 Pine Blvd",
          city: "Austin",
          state: "TX",
          zipCode: "78745",
          country: "USA",
        },
        products: [
          {
            id: generateId(),
            name: "Gravel Mix",
            materialType: "gravel",
            quantity: 8,
          },
          {
            id: generateId(),
            name: "Construction Sand",
            materialType: "sand",
            quantity: 10,
          },
        ],
        truckType: "dump",
        deliveryDay: "2025-05-07T13:00:00Z",
      }
    ],
    contactInformation: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "512-555-5678",
      company: "XYZ Builders",
    },
    taxExempt: true,
    createdAt: "2025-04-12T10:15:00Z",
  },
  {
    id: generateId(),
    deliveryLocations: [
      {
        id: generateId(),
        address: {
          street: "321 Elm Street",
          city: "Austin",
          state: "TX",
          zipCode: "78732",
          country: "USA",
        },
        products: [
          {
            id: generateId(),
            name: "Premium Concrete Mix",
            materialType: "concrete",
            quantity: 15,
          },
          {
            id: generateId(),
            name: "Coarse Aggregate",
            materialType: "gravel",
            quantity: 20,
          },
        ],
        truckType: "mixer",
        deliveryDay: "2025-05-10T08:00:00Z",
      },
      {
        id: generateId(),
        address: {
          street: "654 Maple Drive",
          city: "Austin",
          state: "TX",
          zipCode: "78733",
          country: "USA",
        },
        products: [
          {
            id: generateId(),
            name: "Reinforcement Steel",
            materialType: "other",
            quantity: 12,
          },
          {
            id: generateId(),
            name: "Construction Sand",
            materialType: "sand",
            quantity: 10,
          },
        ],
        truckType: "flatbed",
        deliveryDay: "2025-05-10T14:00:00Z",
      },
      {
        id: generateId(),
        address: {
          street: "987 Cedar Lane",
          city: "Austin",
          state: "TX",
          zipCode: "78734",
          country: "USA",
        },
        products: [
          {
            id: generateId(),
            name: "Building Sand",
            materialType: "sand",
            quantity: 7,
          },
          {
            id: generateId(),
            name: "Crushed Stone",
            materialType: "gravel",
            quantity: 5,
          },
        ],
        truckType: "dump",
        deliveryDay: "2025-05-11T10:00:00Z",
      }
    ],
    contactInformation: {
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "512-555-9012",
      company: "Johnson Contracting",
    },
    taxExempt: false,
    createdAt: "2025-04-15T16:45:00Z",
  },
]

// Create plants for use in quotes
const plants = [
  {
    id: generateId(),
    name: "Austin Central Plant",
    address: {
      street: "100 Industrial Way",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA",
    }
  },
  {
    id: generateId(),
    name: "South Austin Supply Center",
    address: {
      street: "200 Materials Rd",
      city: "Austin",
      state: "TX",
      zipCode: "78704",
      country: "USA",
    }
  },
  {
    id: generateId(),
    name: "North Austin Distribution Facility",
    address: {
      street: "300 Resource Blvd",
      city: "Austin",
      state: "TX",
      zipCode: "78758",
      country: "USA",
    }
  },
  {
    id: generateId(),
    name: "Riverside Materials Yard",
    address: {
      street: "450 Riverside Drive",
      city: "Austin",
      state: "TX",
      zipCode: "78741",
      country: "USA",
    }
  }
]

// Generate mock quotes
export const mockQuotes: Quote[] = [
  {
    id: generateId(),
    requestId: mockRequests[0].id,
    status: "sent",
    locations: [
      {
        id: generateId(),
        address: mockRequests[0].deliveryLocations[0].address,
        requestLocationId: mockRequests[0].deliveryLocations[0].id,
        deliveryDay: mockRequests[0].deliveryLocations[0].deliveryDay,
        truck: {
          id: generateId(),
          type: "mixer",
          capacity: 10,
          licensePlate: "TX12345",
        },
        plants: [
          {
            id: generateId(),
            plant: plants[0],
            products: [
              {
                id: generateId(),
                plantId: plants[0].id,
                product: {
                  id: generateId(),
                  name: "Ready-mix Concrete",
                  materialType: "concrete",
                  quantity: 10,
                  unitOfMeasure: "cubic-yard",
                  price: 125.0,
                },
                estimatedPreparationTime: 45,
              }
            ],
            subtotal: 1250.0,
            taxes: [
              {
                name: "State Tax",
                rate: 0.0625,
                amount: 78.13,
              }
            ],
            distance: 8.5,
            estimatedLoadingTime: 30,
          }
        ],
        estimation: {
          id: generateId(),
          preparationStartTime: "2025-05-01T08:00:00Z",
          estimatedArrivalTime: "2025-05-01T09:30:00Z",
          estimatedCompletionTime: "2025-05-01T11:00:00Z",
          transportCost: 150.0,
          deliveryTaxes: [
            {
              name: "Delivery Fee",
              rate: 0.05,
              amount: 62.5,
            }
          ],
          totalDistance: 8.5,
          weatherForecast: {
            temperature: 75,
            condition: "Sunny",
            icon: "sun",
          }
        },
        subtotal: 1250.0,
        total: 1540.63, // 1250 + 78.13 (tax) + 150.0 (transport) + 62.5 (delivery fee)
      }
    ],
    contactInformation: mockRequests[0].contactInformation,
    name: "ABC Construction Concrete Supply",
    description: "Ready-mix concrete supply for foundation work",
    marketSegment: "Residential Construction",
    expirationDate: "2025-05-15T23:59:59Z",
    subtotal: 1250.0,
    taxes: 78.13,
    total: 1540.63,
    taxable: true,
    delivered: false,
    customerTermsAndConditions: "Payment due within 30 days of delivery",
    createdAt: "2025-04-11T09:30:00Z",
  },
  {
    id: generateId(),
    requestId: mockRequests[1].id,
    status: "approved",
    locations: [
      {
        id: generateId(),
        address: mockRequests[1].deliveryLocations[0].address,
        requestLocationId: mockRequests[1].deliveryLocations[0].id,
        deliveryDay: mockRequests[1].deliveryLocations[0].deliveryDay,
        truck: {
          id: generateId(),
          type: "flatbed",
          capacity: 15,
          licensePlate: "TX67890",
        },
        plants: [
          {
            id: generateId(),
            plant: plants[1],
            products: [
              {
                id: generateId(),
                plantId: plants[1].id,
                product: {
                  id: generateId(),
                  name: "Portland Cement",
                  materialType: "cement",
                  quantity: 5,
                  unitOfMeasure: "ton",
                  price: 200.0,
                },
                estimatedPreparationTime: 30,
              },
              {
                id: generateId(),
                plantId: plants[1].id,
                product: {
                  id: generateId(),
                  name: "Construction Gravel",
                  materialType: "gravel",
                  quantity: 5,
                  unitOfMeasure: "ton",
                  price: 50.0,
                },
                estimatedPreparationTime: 30,
              }
            ],
            subtotal: 1000.0,
            taxes: [],
            distance: 5.2,
            estimatedLoadingTime: 25,
          },
          {
            id: generateId(),
            plant: plants[3],
            products: [
              {
                id: generateId(),
                plantId: plants[3].id,
                product: {
                  id: generateId(),
                  name: "Fine Sand",
                  materialType: "sand",
                  quantity: 3,
                  unitOfMeasure: "ton",
                  price: 75.0,
                },
                estimatedPreparationTime: 20,
              },
              {
                id: generateId(),
                plantId: plants[3].id,
                product: {
                  id: generateId(),
                  name: "Construction Sand",
                  materialType: "sand",
                  quantity: 2,
                  unitOfMeasure: "ton",
                  price: 50.0,
                },
                estimatedPreparationTime: 20,
              }
            ],
            subtotal: 225.0,
            taxes: [],
            distance: 7.8,
            estimatedLoadingTime: 20,
          }
        ],
        estimation: {
          id: generateId(),
          preparationStartTime: "2025-05-05T07:30:00Z",
          estimatedArrivalTime: "2025-05-05T08:45:00Z",
          estimatedCompletionTime: "2025-05-05T10:15:00Z",
          transportCost: 120.0,
          deliveryTaxes: [
            {
              name: "Delivery Fee",
              rate: 0.05,
              amount: 61.25, // 5% of (1000 + 225)
            }
          ],
          totalDistance: 13.0, // Sum of distances from both plants
          weatherForecast: {
            temperature: 68,
            condition: "Partly Cloudy",
            icon: "cloud-sun",
          }
        },
        subtotal: 1225.0,
        total: 1406.25, // 1225 + 120 (transport) + 61.25 (delivery fee)
      },
      {
        id: generateId(),
        address: mockRequests[1].deliveryLocations[1].address,
        requestLocationId: mockRequests[1].deliveryLocations[1].id,
        deliveryDay: mockRequests[1].deliveryLocations[1].deliveryDay,
        truck: {
          id: generateId(),
          type: "dump",
          capacity: 12,
          licensePlate: "TX54321",
        },
        plants: [
          {
            id: generateId(),
            plant: plants[2],
            products: [
              {
                id: generateId(),
                plantId: plants[2].id,
                product: {
                  id: generateId(),
                  name: "Gravel Mix",
                  materialType: "gravel",
                  quantity: 8,
                  unitOfMeasure: "ton",
                  price: 85.0,
                },
                estimatedPreparationTime: 35,
              },
              {
                id: generateId(),
                plantId: plants[2].id,
                product: {
                  id: generateId(),
                  name: "Construction Sand",
                  materialType: "sand",
                  quantity: 10,
                  unitOfMeasure: "ton",
                  price: 50.0,
                },
                estimatedPreparationTime: 35,
              }
            ],
            subtotal: 680.0,
            taxes: [],
            distance: 9.3,
            estimatedLoadingTime: 25,
          }
        ],
        estimation: {
          id: generateId(),
          preparationStartTime: "2025-05-07T11:00:00Z",
          estimatedArrivalTime: "2025-05-07T12:30:00Z",
          estimatedCompletionTime: "2025-05-07T14:00:00Z",
          transportCost: 95.0,
          deliveryTaxes: [
            {
              name: "Delivery Fee",
              rate: 0.05,
              amount: 34.0, // 5% of 680
            }
          ],
          totalDistance: 9.3,
          weatherForecast: {
            temperature: 72,
            condition: "Sunny",
            icon: "sun",
          }
        },
        subtotal: 680.0,
        total: 809.0, // 680 + 95 (transport) + 34 (delivery fee)
      }
    ],
    contactInformation: mockRequests[1].contactInformation,
    name: "XYZ Builders Materials Supply",
    description: "Building materials for multiple sites",
    marketSegment: "Commercial Construction",
    expirationDate: "2025-05-20T23:59:59Z",
    subtotal: 1905.0, // 1225 + 680
    taxes: 0,
    total: 2215.25, // 1406.25 + 809.0
    taxable: false,
    delivered: false,
    customerTermsAndConditions: "Payment due within 15 days of delivery",
    createdAt: "2025-04-13T11:45:00Z",
  }
]

// Generate mock orders
export const mockOrders: Order[] = [
  {
    ...mockQuotes[1],
    status: "won",
    invoiceData: {
      invoiceNumber: "INV-2025-001",
      invoiceDate: "2025-04-14T10:00:00Z",
      dueDate: "2025-05-14T23:59:59Z",
      totalAmount: 2215.25,
    },
    paymentData: {
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      amountPaid: 2215.25,
    },
    orderNotes: "Customer requested early morning delivery for all locations",
  },
]

// Mock weather data
export const mockWeather = {
  "2025-05-01": {
    temperature: 75,
    condition: "Sunny",
    icon: "sun",
  },
  "2025-05-05": {
    temperature: 68,
    condition: "Partly Cloudy",
    icon: "cloud-sun",
  },
  "2025-05-10": {
    temperature: 82,
    condition: "Clear",
    icon: "sun",
  },
}

// Helper function to get weather for a specific date
export const getWeatherForDate = (dateString: string) => {
  const date = new Date(dateString)
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`

  return (
    mockWeather[dateKey as keyof typeof mockWeather] || {
      temperature: 70,
      condition: "Unknown",
      icon: "cloud",
    }
  )
}
