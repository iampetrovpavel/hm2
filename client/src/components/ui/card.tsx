"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { cn } from "@/lib/utils"

// Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean
  defaultOpen?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, collapsible = false, defaultOpen = true, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)
    
    if (collapsible) {
      return (
        <Collapsible 
          open={isOpen}
          onOpenChange={setIsOpen}
          className={cn("rounded-lg border border-slate-300 bg-card text-card-foreground shadow-sm", className)}
        >
          {children}
        </Collapsible>
      )
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-slate-300 bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

// CardHeader component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, collapsible = false, children, ...props }, ref) => {
    if (collapsible) {
      return (
        <CollapsibleTrigger asChild>
          <div
            ref={ref}
            className={cn("flex items-center justify-between p-6 cursor-pointer group", className)}
            {...props}
          >
            <div className="flex flex-col space-y-1.5 flex-grow">
              {children}
            </div>
            <ChevronDown className="ml-6 h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
      )
    }
    
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardHeader.displayName = "CardHeader"

// CardTitle component
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// CardDescription component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// CardContent component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, collapsible = false, children, ...props }, ref) => {
    if (collapsible) {
      return (
        <CollapsibleContent>
          <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
            {children}
          </div>
        </CollapsibleContent>
      )
    }
    
    return (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
        {children}
      </div>
    )
  }
)
CardContent.displayName = "CardContent"

// CardFooter component
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
))
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  type CardProps,
  type CardHeaderProps,
  type CardContentProps 
}