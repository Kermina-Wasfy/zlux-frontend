import Tabs from "@/components/general/Tabs";
import MainCheckout from "@/components/pages/Reserve/Checkout/MainCheckout";

export default function CheckoutPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-[#0D0D0D] flex flex-col">
      <Tabs
        currentStep={3}
        backHref="/reserve/vehicle"
        backLabel="Previous Step"
      />

      <div className="flex-1">
        <MainCheckout />
      </div>
    </main>
  );
}
