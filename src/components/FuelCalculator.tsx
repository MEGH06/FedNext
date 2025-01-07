import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Car, Route, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ResultsDisplay from './ResultsDisplay';
import LiveMap from './LiveMap';
import { calculateRoute } from '@/services/api';

export interface CalculationResults {
  fuelConsumption: number;
  co2Emissions: number;
  treesNeeded: number;
  routeDetails?: {
    distance: number;
    duration: number;
    weather: {
      temperature: number;
      condition: string;
    };
  };
}

const FuelCalculator = () => {
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [mileage, setMileage] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("petrol");
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<{
    start?: [number, number];
    end?: [number, number];
    route?: any;
  }>({});
  const { toast } = useToast();

  const geocodeLocation = async (location: string): Promise<[number, number]> => {
    // This would normally call a geocoding API
    // For demo purposes, returning mock coordinates
    return [-74.5 + Math.random(), 40 + Math.random()];
  };

  const calculateResults = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startLocation || !endLocation || !mileage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Geocode locations
      const startCoords = await geocodeLocation(startLocation);
      const endCoords = await geocodeLocation(endLocation);

      const routeData = await calculateRoute(startLocation, endLocation, {
        distance: 100, // This would come from the actual route calculation
        mileage: parseFloat(mileage),
        fuelType: fuelType as 'petrol' | 'diesel',
      });

      const fuelConsumption = routeData.distance / parseFloat(mileage);
      const co2Factor = fuelType === "petrol" ? 2.31 : 2.68;
      const co2Emissions = fuelConsumption * co2Factor;
      const treesNeeded = Math.ceil(co2Emissions / 22);

      setResults({
        fuelConsumption,
        co2Emissions,
        treesNeeded,
        routeDetails: {
          distance: routeData.distance,
          duration: routeData.duration,
          weather: routeData.weather,
        },
      });

      // Update map coordinates
      setMapCoordinates({
        start: startCoords,
        end: endCoords,
        route: {
          geometry: {
            type: "LineString",
            coordinates: [startCoords, endCoords],
          },
        },
      });

      toast({
        title: "Route Calculated",
        description: "Your results are ready!",
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate route. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-light to-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-eco-primary">Eco Route Calculator</h1>
          <p className="text-eco-secondary">Calculate your journey's environmental impact</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 animate-fadeIn">
              <form onSubmit={calculateResults} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startLocation" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Start Location
                    </Label>
                    <Input
                      id="startLocation"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      placeholder="Enter start location"
                      className="border-eco-accent focus:ring-eco-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endLocation" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      End Location
                    </Label>
                    <Input
                      id="endLocation"
                      value={endLocation}
                      onChange={(e) => setEndLocation(e.target.value)}
                      placeholder="Enter end location"
                      className="border-eco-accent focus:ring-eco-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mileage" className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Mileage (km/l)
                    </Label>
                    <Input
                      id="mileage"
                      type="number"
                      min="0"
                      step="0.1"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="Enter mileage"
                      className="border-eco-accent focus:ring-eco-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType" className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Fuel Type
                    </Label>
                    <Select value={fuelType} onValueChange={setFuelType}>
                      <SelectTrigger className="border-eco-accent focus:ring-eco-primary">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-eco-primary hover:bg-eco-secondary transition-colors"
                >
                  Calculate Route Impact
                </Button>
              </form>
            </Card>

            {results && <ResultsDisplay results={results} />}
          </div>

          <div className="space-y-6">
            <LiveMap 
              startLocation={mapCoordinates.start}
              endLocation={mapCoordinates.end}
              route={mapCoordinates.route}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelCalculator;