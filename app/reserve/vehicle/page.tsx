import Tabs from "@/components/general/Tabs";
import SelectVehicle from "@/components/pages/Reserve/SelectVehicle/SelectVehicle";

export default function SelectVehiclePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-[#0D0D0D] flex flex-col">
      <Tabs
        currentStep={2}
        backHref="/reserve"
        backLabel="Previous Step"
      />

      <div className="flex-1">
        <SelectVehicle />
      </div>
    </main>
  );
}
