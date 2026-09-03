import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConverterCard from "@/components/ConverterCard";
import Favorites from "@/components/Favorites";
import RateChart from "@/components/RateChart";
import ConversionHistory from "@/components/ConversionHistory";
import TravelBudget from "@/components/TravelBudget";
import BackgroundEffect from "@/components/BackgroundEffect";
import SpotlightCard from "@/components/SpotlightCard";

export default function Dashboard() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  const handlePairChange = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const handleFavoriteSelect = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  return (
    <TooltipProvider>
      <BackgroundEffect />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SpotlightCard>
          <div className="max-w-3xl mx-auto">
            <ConverterCard onPairChange={handlePairChange} />
          </div>
        </SpotlightCard>

        <div className="max-w-3xl mx-auto">
          <Favorites onSelect={handleFavoriteSelect} />
        </div>

        <div className="max-w-3xl mx-auto">
          <RateChart from={fromCurrency} to={toCurrency} />
        </div>

        <div className="max-w-3xl mx-auto">
          <TravelBudget />
        </div>

        <div className="max-w-3xl mx-auto">
          <ConversionHistory />
        </div>
      </div>
    </TooltipProvider>
  );
}
