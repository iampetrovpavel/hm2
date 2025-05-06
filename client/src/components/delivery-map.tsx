"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Minus, Layers, Navigation } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Address } from "@/lib/types"

interface DeliveryMapProps {
  plantAddress: Address
  deliveryAddress: Address
  className?: string
}

export function DeliveryMap({ plantAddress, deliveryAddress, className = "" }: DeliveryMapProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Format addresses for display
  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
  }

  const plantAddressFormatted = formatAddress(plantAddress)
  const deliveryAddressFormatted = formatAddress(deliveryAddress)

  return (
    <Card className={`overflow-hidden ${className} border-none shadow-none`}>
      {isLoading ? (
        <div className="h-64 bg-muted flex items-center justify-center">
          <div className="animate-pulse">Loading map...</div>
        </div>
      ) : (
        <div className="relative">
          {/* Google Maps image */}
          <div className="h-64 relative">
            {/* Use the actual Google Maps image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/route-map.png')`,
              }}
            ></div>

            {/* Google Maps UI elements */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-white rounded-md shadow-md p-2 flex items-center">
                <Search className="h-4 w-4 text-gray-500 mr-2" />
                <div className="text-sm text-gray-500 truncate">Maricopa, AZ</div>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="absolute top-20 right-4 bg-white rounded-md shadow-md">
              <button className="p-1 hover:bg-gray-100 block w-8 h-8 flex items-center justify-center">
                <Plus className="h-4 w-4 text-gray-700" />
              </button>
              <div className="h-px bg-gray-200"></div>
              <button className="p-1 hover:bg-gray-100 block w-8 h-8 flex items-center justify-center">
                <Minus className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Layer control */}
            <div className="absolute bottom-4 right-4 bg-white rounded-full shadow-md p-2">
              <Layers className="h-5 w-5 text-gray-700" />
            </div>
          </div>

          {/* Google Maps style directions panel */}
          <div className="pt-3 bg-white border-none">
            {/* <div className="flex items-center mb-3">
              <div className="bg-blue-500 text-white rounded-full p-1 mr-2">
                <Navigation size={16} />
              </div>
              <div className="text-sm font-medium">Directions to Delivery Location</div>
            </div> */}

            <div className="flex items-start mb-2">
              <div className="flex-shrink-0 mr-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
                  A
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">Plant Location</p>
                <p className="text-muted-foreground text-xs">{plantAddressFormatted}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">
                  B
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">Delivery Location</p>
                <p className="text-muted-foreground text-xs">{deliveryAddressFormatted}</p>
              </div>
            </div>

            <div className="mt-3 text-xs flex justify-between items-center border-t border-gray-200 pt-2">
              <div>
                <span className="font-medium">12.3 mi</span>
                <span className="text-muted-foreground ml-1">(19.8 km)</span>
              </div>
              <div>
                <span className="font-medium">28 min</span>
                <span className="text-muted-foreground ml-1">normal traffic</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default DeliveryMap
