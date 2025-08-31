
"use client"

import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Building, Utensils, Wifi, Search, Lightbulb, University, Dumbbell, Loader2 } from 'lucide-react'
import { getLocations } from '@/ai/flows/ai-assistant-campus-info'

type Location = Awaited<ReturnType<typeof getLocations>>[0];

const iconMap: { [key: string]: React.ElementType } = {
  University,
  Utensils,
  Wifi,
  Building,
  Dumbbell,
  Lightbulb
};

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

export default function CampusNavigatorPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchLocations = async (search: string) => {
    // Only show full-page loader on initial load
    if (search.trim() === '' && locations.length === 0) {
      setIsLoading(true);
    } else {
      setIsSearching(true);
    }
    
    try {
      const fetchedLocations = await getLocations({ locationName: search || undefined });
      setLocations(fetchedLocations);
    } catch (error) {
      console.error("Failed to fetch locations", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchLocations = useCallback(debounce(fetchLocations, 300), []);

  useEffect(() => {
    // Initial fetch for all locations
    fetchLocations('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    debouncedFetchLocations(searchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Campus Navigator</h1>
        <p className="text-muted-foreground">Your real-time guide to campus places.</p>
      </header>

      {/* Map Section */}
      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-64 md:h-96 w-full">
            <Image
              src="https://placehold.co/1200x400.png"
              alt="Campus Map"
              layout="fill"
              objectFit="cover"
              data-ai-hint="university campus map"
            />
             <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white font-headline drop-shadow-lg">
                    Explore Your Campus
                </h2>
            </div>
        </div>
      </Card>

      {/* Search and Locations Grid */}
      <div className="space-y-6">
        <div>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input
                placeholder="Search for a building, lab, or cafe..."
                className="w-full md:w-1/2 lg:w-1/3 pl-10 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {locations.map((loc, index) => {
                const Icon = iconMap[loc.icon] || Building;
                return (
                  <Card key={index} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg ${loc.bgColor}`}>
                            <Icon className={`w-7 h-7 ${loc.color}`} />
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${loc.status === 'Open' ? 'bg-green-100 text-green-800' : loc.status === 'Closed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{loc.status}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <CardTitle className="font-headline text-xl">{loc.name}</CardTitle>
                        <CardDescription className="mt-1">{loc.details}</CardDescription>
                      </CardContent>
                      <CardFooter>
                        <div className="text-sm text-muted-foreground font-medium">
                          <span className="font-semibold text-foreground">Capacity:</span> {loc.capacity}
                        </div>
                      </CardFooter>
                  </Card>
                )
              })}
            </div>
            {locations.length === 0 && !isSearching && (
                <div className="text-center py-16 text-muted-foreground col-span-full">
                  <p className="font-semibold">No locations found for &quot;{searchTerm}&quot;.</p>
                  <p className="text-sm">Try searching for something else.</p>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
