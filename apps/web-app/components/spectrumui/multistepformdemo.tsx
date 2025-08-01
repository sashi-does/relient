"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
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
import { PricingSection } from "../blocks/pricing-section";
import { TIERS } from "@/lib/const";

const steps = [
  { id: "agency", title: "Agency Profile" },
  { id: "subscription", title: "Choose Your Plan" },
];

interface FormData {
  agencyName: string;
  agencyWebsite: string;
  agencyLogo: string;
  industry: string;
  teamSize: string;
  subscriptionPlan: string;
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

const frequencies = ["monthly", "yearly"];

const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    agencyName: "",
    agencyWebsite: "",
    agencyLogo: "",
    industry: "",
    teamSize: "",
    subscriptionPlan: "",
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 0 && isStepValid()) {
      handleSubmit()
      setCurrentStep(1);
    } else if (currentStep === 0) {
      toast("Please fill in all required fields (Agency Name and Industry).");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlanSelect = (planName: string) => {
    updateFormData("subscriptionPlan", planName);
  };

  const handleSubmit = async () => {
    if (currentStep === 1 && !formData.subscriptionPlan) {
      toast("Please select a subscription plan.");
      return;
    }

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
          subscriptionPlan: formData.subscriptionPlan,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast("One more step to go");
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    return formData.agencyName.trim() !== "" && formData.industry !== "";
  };

  return (
    <div className="w-full mx-auto py-8">
      {/* Progress indicator */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center gap-4 mb-2">
          {steps.map((step, index) => (
            <motion.div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`w-4 h-4 rounded-full ${
                  index <= currentStep ? "bg-primary ring-4 ring-primary/20" : "bg-gray-400"
                }`}
              />
              <motion.span
                className={`text-xs mt-1.5 hidden sm:block ${
                  index <= currentStep ? "text-primary font-medium" : "text-gray-400"
                }`}
              >
                {step.title}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Onboarding Form */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="agency"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl mx-auto bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-6"
          >
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
                      <SelectItem value="REALESTATE">Real Estate</SelectItem>
                      <SelectItem value="LAWYERS">Lawyers</SelectItem>
                      <SelectItem value="B2B">B2B Services</SelectItem>
                      <SelectItem value="ECOM">Ecommerce</SelectItem>
                      <SelectItem value="COACHING_CONSULTING">Coaching & Consulting</SelectItem>
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

              <div className="flex justify-end gap-4">
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="py-2 bg-white text-black hover:bg-[#f4f4f4] rounded-md transition-all duration-200"
                >
                  Next
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="subscription"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full mx-auto"
          >
            <PricingSection
              title="Choose Your Plan"
              subtitle="Select the plan that best suits your agency’s needs."
              tiers={TIERS.map((tier) => ({
                ...tier,
                onSelect: () => handlePlanSelect(tier.name),
                redirect: tier.redirect ?? undefined,
              }))}
              frequencies={frequencies}
              at={'onboarding'}
            />
            {/* <div className="flex justify-between gap-4 mt-6">
              <Button
                onClick={handleBack}
                className="py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md transition-all duration-200"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.subscriptionPlan || isSubmitting}
                className="py-2 bg-white text-black hover:bg-[#f4f4f4] rounded-md transition-all duration-200"
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
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingForm;