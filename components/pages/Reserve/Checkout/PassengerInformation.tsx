import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { CheckoutFormData } from "./checkoutSchema";

interface PassengerInformationProps {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}

const PASSENGER_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
];

export default function PassengerInformation({
  formData,
  errors,
  onChange,
}: PassengerInformationProps) {
  return (
    <div className="w-full bg-[#151515] p-4 md:p-6">
      <h2 className="text-[20px] font-[700] text-platinum font-montserrat tracking-tight mb-7">
        Passenger Information
      </h2>

      <div className="space-y-6">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Enter Your First Name"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            placeholder="Enter Your Last Name"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            error={errors.lastName}
          />
        </div>

        {/* Row 2: Email Address & Phone Number */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter Your Number"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            error={errors.phone}
          />
        </div>

        {/* Row 3: Passenger Count & Flight Number */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Passenger Count"
            labelClassName="min-h-[48px] sm:min-h-0"
            options={PASSENGER_OPTIONS}
            placeholder="1"
            value={formData.passengerCount}
            onChange={(e) => onChange("passengerCount", e.target.value)}
            error={errors.passengerCount}
          />
          <Input
            label="Flight Number (Optional)"
            labelClassName="min-h-[48px] sm:min-h-0"
            placeholder="AA1485"
            value={formData.flightNumber || ""}
            onChange={(e) => onChange("flightNumber", e.target.value)}
            error={errors.flightNumber}
          />
        </div>

        {/* Row 4: Special Requests */}
        <div className="flex flex-col w-full">
          <label className="text-primary text-[16px] md:text-[20px] font-[500] font-inter mb-2 tracking-wide">
            Special Requests
          </label>
          <textarea
            rows={4}
            placeholder="Any Special Accommodations Or Instructions For Your Chauffeur?"
            value={formData.specialRequests || ""}
            onChange={(e) => onChange("specialRequests", e.target.value)}
            className="w-full placeholder:md:text-[16px] placeholder:text-[12px] min-h-[95px] p-4 rounded-[8px] bg-transparent text-[#E5E4E2] font-inter text-[16px] placeholder:text-[#C7C6C4] border border-primary transition-all duration-200 outline-none hover:border-[#C5A059]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
