"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockRequests, mockQuotes, mockOrders } from "@/lib/mock-data"
import type { Request, Quote, Order } from "@/lib/types"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 10)

type StoreContextType = {
  requests: Request[]
  quotes: Quote[]
  orders: Order[]
  addRequest: (request: Omit<Request, "id" | "createdAt">) => Request
  addQuote: (quote: Omit<Quote, "id" | "createdAt">) => Quote
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Order
  getRequestById: (id: string) => Request | undefined
  getQuoteById: (id: string) => Quote | undefined
  getOrderById: (id: string) => Order | undefined
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Initialize with mock data
  useEffect(() => {
    setRequests(mockRequests)
    setQuotes(mockQuotes)
    setOrders(mockOrders)
  }, [])

  const addRequest = (requestData: Omit<Request, "id" | "createdAt">) => {
    const newRequest: Request = {
      ...requestData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setRequests((prev) => [...prev, newRequest])
    return newRequest
  }

  // Modify the addQuote function to ensure it properly saves the quote and returns it
  const addQuote = (quoteData: Omit<Quote, "id" | "createdAt">) => {
    // Generate a unique ID for the new quote
    const id = generateId()

    const newQuote: Quote = {
      ...quoteData,
      id,
      createdAt: new Date().toISOString(),
    }

    // Update the quotes state with the new quote
    setQuotes((prevQuotes) => [...prevQuotes, newQuote])

    // Return the newly created quote
    return newQuote
  }

  const addOrder = (orderData: Omit<Order, "id" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [...prev, newOrder])
    return newOrder
  }

  const getRequestById = (id: string) => requests.find((r) => r.id === id)
  // Modify the getQuoteById function to be more robust
  const getQuoteById = (id: string) => {
    if (!id) return undefined
    return quotes.find((q) => q.id === id)
  }
  const getOrderById = (id: string) => orders.find((o) => o.id === id)

  return (
    <StoreContext.Provider
      value={{
        requests,
        quotes,
        orders,
        addRequest,
        addQuote,
        addOrder,
        getRequestById,
        getQuoteById,
        getOrderById,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
