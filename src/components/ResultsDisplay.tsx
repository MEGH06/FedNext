import React from 'react';
import { Card } from "@/components/ui/card";
import { Droplets, Leaf, TreePine, Clock, Route as RouteIcon, Cloud } from "lucide-react";
import type { CalculationResults } from './FuelCalculator';

interface ResultsDisplayProps {
  results: CalculationResults;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="p-6 animate-fadeIn bg-gradient-to-br from-eco-light to-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-eco-primary/10 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-eco-primary" />
          </div>
          <h3 className="font-semibold text-eco-primary">Fuel Consumption</h3>
          <p className="text-2xl font-bold text-eco-secondary">
            {results.fuelConsumption.toFixed(2)} L
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-eco-primary/10 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-eco-primary" />
          </div>
          <h3 className="font-semibold text-eco-primary">CO2 Emissions</h3>
          <p className="text-2xl font-bold text-eco-secondary">
            {results.co2Emissions.toFixed(2)} kg
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-eco-primary/10 flex items-center justify-center">
            <TreePine className="w-6 h-6 text-eco-primary" />
          </div>
          <h3 className="font-semibold text-eco-primary">Trees Needed</h3>
          <p className="text-2xl font-bold text-eco-secondary">
            {results.treesNeeded}
          </p>
        </div>

        {results.routeDetails && (
          <>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-eco-primary/10 flex items-center justify-center">
                <RouteIcon className="w-6 h-6 text-eco-primary" />
              </div>
              <h3 className="font-semibold text-eco-primary">Distance</h3>
              <p className="text-2xl font-bold text-eco-secondary">
                {results.routeDetails.distance.toFixed(1)} km
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-eco-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-eco-primary" />
              </div>
              <h3 className="font-semibold text-eco-primary">Duration</h3>
              <p className="text-2xl font-bold text-eco-secondary">
                {formatDuration(results.routeDetails.duration)}
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-eco-primary/10 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-eco-primary" />
              </div>
              <h3 className="font-semibold text-eco-primary">Weather</h3>
              <p className="text-2xl font-bold text-eco-secondary">
                {results.routeDetails.weather.temperature}°C
              </p>
              <p className="text-sm text-eco-secondary">
                {results.routeDetails.weather.condition}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ResultsDisplay;