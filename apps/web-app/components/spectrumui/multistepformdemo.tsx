"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import Input from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const steps = [{ id: "agency", title: "Agency Profile" }];

interface FormData {
  // Agency Profile
  agencyName: string;
  agencyWebsite: string;
  agencyLogo: string;
  industry: string;
  teamSize: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const OnboardingForm = () => {
  const [currentStep] = useState(0);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    agencyName: "",
    agencyWebsite: "",
    agencyLogo: "",
    industry: "",
    teamSize: "",
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const url = `/api/onboard/`;
      const response = await axios.post(
        url,
        {
          agencyName: formData.agencyName,
          industry: formData.industry,
          website: formData.agencyWebsite,
          teamSize: formData.teamSize,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast("Redirecting to dashboard");
        setIsSubmitting(false);
        router.push("/dashboard");
      }
    } catch (error) {
      toast(error instanceof Error);
      setIsSubmitting(false);
    }
  };

  // Check if step is valid for submit button
  const isStepValid = () => {
    return formData.agencyName.trim() !== "" && formData.industry !== "";
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      {/* Progress indicator - simplified since there's only one step */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-2">
          <motion.div className="flex flex-col items-center">
            <motion.div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />
            <motion.span className="text-xs mt-1.5 hidden sm:block text-primary font-medium">
              {steps[0]?.title}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>

      {/* Form card */}
      <div className="w-full max-w-2xl mx-auto bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-6">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-3 w-full">
            <span className="text-gray-400">Agency Name</span>
            <Input
              className="text-white py-2"
              placeholder="e.g: Pixel & Co."
              value={formData.agencyName}
              onChange={(e) => updateFormData("agencyName", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-3 w-full">
            <span className="text-gray-400">Agency Website</span>
            <Input
              className="text-white py-2"
              placeholder="https://youragency.com"
              value={formData.agencyWebsite}
              onChange={(e) => updateFormData("agencyWebsite", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-3 w-full">
            <span className="text-gray-400">Upload Logo</span>
            <Input
              type="file"
              className="text-white py-2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  updateFormData("agencyLogo", URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="flex items-center">
            <div className="flex flex-col gap-y-3 w-full">
              <span className="text-gray-400">Primary Industry</span>
              <Select
  value={formData.industry}
  onValueChange={(value) => updateFormData("industry", value)}
>
  <SelectTrigger className="bg-background">
    <SelectValue placeholder="Select industry" />
  </SelectTrigger>
  <SelectContent className="bg-popover">
    <SelectItem
      value="REALESTATE"
      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
    >
      Real Estate
    </SelectItem>
    <SelectItem
      value="LAWYERS"
      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
    >
      Lawyers
    </SelectItem>
    <SelectItem
      value="B2B"
      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
    >
      B2B Services
    </SelectItem>
    <SelectItem
      value="ECOM"
      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
    >
      Ecommerce
    </SelectItem>
    <SelectItem
      value="COACHING_CONSULTING"
      className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
    >
      Coaching & Consulting
    </SelectItem>
  </SelectContent>
</Select>
            </div>

            <div className="flex flex-col gap-y-3 w-full">
              <span className="text-gray-400">Team Size</span>
              <Select
                value={formData.teamSize}
                onValueChange={(value) => updateFormData("teamSize", value)}
              >
                <SelectTrigger className="text-white py-2">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5</SelectItem>
                  <SelectItem value="6-10">6-10</SelectItem>
                  <SelectItem value="11-20">11-20</SelectItem>
                  <SelectItem value="21-50">21-50</SelectItem>
                  <SelectItem value="50+">50+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isStepValid() || isSubmitting}
            className="w-full py-2 bg-white text-black hover:bg-[#f4f4f4] rounded-md transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                Submit <Check className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
