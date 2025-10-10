"use client"

import React, { useEffect, useState } from 'react'

const Page = () => {
  const [trackId, setTrackId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/')
      const newTrackId = pathSegments[pathSegments.length - 2]
      const newOrderNumber = pathSegments[pathSegments.length - 1]
      setTrackId(newTrackId)
      setOrderNumber(newOrderNumber)

      if (newTrackId && newOrderNumber) {
        fetchTrackingData(newTrackId, newOrderNumber)
      }
    }
  }, [])

  const fetchTrackingData = async (trackId, orderNumber) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/orderProcess/track?trackId=${trackId}&orderNumber=${orderNumber}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data')
      }
      const data = await response.json()
      setTrackingData(data)
      
      // Automatically open URL if it exists in the response
      if (data && typeof data.data === 'string' && data.data.startsWith('http')) {
        const openWindow = window.open(data.data, '_blank')
        if (!openWindow) {
          console.log('Popup blocked. Please allow popups for this site.')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
          {trackingData.data && typeof trackingData.data === 'string' && trackingData.data.startsWith('http') && (
            <p className="mt-2">
             Pathao 
              <a href={trackingData.data} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                click here    </a>
                  </p>
      )}
    </div>
  )
}

export default Page