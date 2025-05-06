export type MaterialType = "concrete" | "cement" | "sand" | "gravel" | "other"
export type TruckType = "mixer" | "dump" | "flatbed" | "other"
export type UnitOfMeasure = "cubic-yard" | "ton" | "pound" | "each"
export type QuoteStatus = "draft" | "sent" | "in-approval" | "approved" | "rejected" | "lost" | "won" | "cancelled"

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface ContactInformation {
  name: string
  email: string
  phone: string
  company?: string
}

export interface Product {
  id: string
  name: string
  materialType: MaterialType
  quantity: number
}

export interface ProductWithPrice extends Product {
  unitOfMeasure: UnitOfMeasure
  price: number
}

export interface Truck {
  id: string
  type: TruckType
  capacity: number
  licensePlate?: string
}

export interface Plant {
  id: string
  name: string
  address: Address
}

export interface Tax {
  name: string
  rate: number
  amount: number
}

export interface DeliveryLocation {
  id: string
  address: Address
  products: Product[]
  deliveryDay: string // ISO date string
  truckType: TruckType
}

export interface Request {
  id: string
  deliveryLocations: DeliveryLocation[]
  contactInformation: ContactInformation
  taxExempt: boolean
  createdAt: string // ISO date string
}

export interface PlantProductQuote {
  id: string
  product: ProductWithPrice
  plantId: string
  estimatedPreparationTime: number // in minutes
}

export interface PlantQuote {
  id: string
  plant: Plant
  products: PlantProductQuote[]
  subtotal: number
  taxes: Tax[]
  distance: number // in miles
  estimatedLoadingTime: number // in minutes
}

export interface LocationEstimation {
  id: string
  preparationStartTime: string // ISO date string
  estimatedArrivalTime: string // ISO date string
  estimatedCompletionTime: string // ISO date string
  transportCost: number
  deliveryTaxes: Tax[]
  totalDistance: number // in miles
  weatherForecast?: Weather
}

export interface QuoteLocation {
  id: string
  address: Address
  plants: PlantQuote[]
  truck: Truck
  deliveryDay: string // ISO date string
  estimation: LocationEstimation
  requestLocationId: string // Reference to the original request location
  subtotal: number
  total: number
}

export interface Quote {
  id: string
  requestId: string
  status: QuoteStatus
  locations: QuoteLocation[]
  contactInformation: ContactInformation
  name: string
  description: string
  marketSegment: string
  expirationDate: string // ISO date string
  subtotal: number
  taxes: number
  total: number
  taxable: boolean
  delivered: boolean
  customerTermsAndConditions: string
  createdAt: string // ISO date string
}

export interface Order extends Quote {
  invoiceData: {
    invoiceNumber: string
    invoiceDate: string // ISO date string
    dueDate: string // ISO date string
    totalAmount: number
  }
  paymentData: {
    paymentMethod: string
    paymentStatus: "pending" | "partial" | "paid"
    amountPaid: number
  }
  cancellationReason?: string
  orderNotes: string
}

export interface Weather {
  temperature: number
  condition: string
  icon: string
}
