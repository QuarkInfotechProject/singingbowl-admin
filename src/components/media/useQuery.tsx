'use client'

import { QueryClient, useQueryClient as useReactQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import ReactQueryContext from "@/lib/context/ReactQueryContext"

export function useQueryClient() {
  // Try to get the existing QueryClient from context
  const existingClient = useReactQueryClient()

  // If there's no existing client, create a new one
  const [newQueryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        throwOnError: true,
        retry: false,
      },
    },
  }))


  return existingClient || newQueryClient
}

