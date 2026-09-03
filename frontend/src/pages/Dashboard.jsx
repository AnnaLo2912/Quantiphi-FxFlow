import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConverterCard from "@/components/ConverterCard";
import Favorites from "@/components/Favorites";
import RateChart from "@/components/RateChart";
import ConversionHistory from "@/components/ConversionHistory";
import TravelBudget from "@/components/TravelBudget";
import Sidebar from "@/components/Sidebar";

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
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Favorites */}
            <Favorites onSelect={handleFavoriteSelect} />

            {/* Main Grid: Converter + Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr,1fr] gap-6">
              <ConverterCard onPairChange={handlePairChange} />
              <RateChart from={fromCurrency} to={toCurrency} />
            </div>

            {/* Travel Budget */}
            <TravelBudget />

            {/* Recent Conversions */}
            <ConversionHistory />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
