import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConverterCard from "@/components/ConverterCard";
import Favorites from "@/components/Favorites";
import RateChart from "@/components/RateChart";
import ConversionHistory from "@/components/ConversionHistory";
import TravelBudget from "@/components/TravelBudget";

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
      <div className="min-h-[calc(100vh-3.5rem)]">
        <main className="p-4 lg:p-5">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-12 gap-4 auto-rows-min">
              {/* Row 1: Converter + Chart */}
              <div className="col-span-12 xl:col-span-5">
                <ConverterCard onPairChange={handlePairChange} />
              </div>
              <div className="col-span-12 xl:col-span-7">
                <RateChart from={fromCurrency} to={toCurrency} />
              </div>

              {/* Row 2: Favorites + Travel Budget */}
              <div className="col-span-12 xl:col-span-5">
                <Favorites onSelect={handleFavoriteSelect} />
              </div>
              <div className="col-span-12 xl:col-span-7">
                <TravelBudget />
              </div>

              {/* Row 3: History (full width) */}
              <div className="col-span-12">
                <ConversionHistory />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
