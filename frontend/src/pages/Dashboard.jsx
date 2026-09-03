import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConverterCard from "@/components/ConverterCard";
import Favorites from "@/components/Favorites";
import RateChart from "@/components/RateChart";
import ConversionHistory from "@/components/ConversionHistory";
import TravelBudget from "@/components/TravelBudget";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  const handlePairChange = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const handleFavoriteSelect = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
    setActiveSection("convert");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
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
        );

      case "convert":
        return (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-5">
              <Favorites onSelect={handleFavoriteSelect} />
              <div className="mt-4">
                <ConverterCard onPairChange={handlePairChange} />
              </div>
            </div>
            <div className="col-span-12 xl:col-span-7">
              <RateChart from={fromCurrency} to={toCurrency} />
            </div>
          </div>
        );

      case "rates":
        return (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <RateChart from={fromCurrency} to={toCurrency} />
            </div>
            <div className="col-span-12">
              <ConverterCard onPairChange={handlePairChange} />
            </div>
          </div>
        );

      case "favorites":
        return (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-5">
              <Favorites onSelect={handleFavoriteSelect} showEmpty />
            </div>
            <div className="col-span-12 xl:col-span-7">
              <ConverterCard onPairChange={handlePairChange} />
            </div>
          </div>
        );

      case "history":
        return (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <ConversionHistory showEmpty />
            </div>
          </div>
        );

      case "travel":
        return (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-7">
              <TravelBudget forceOpen />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <ConverterCard onPairChange={handlePairChange} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
        <main className="flex-1 p-4 lg:p-5 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
