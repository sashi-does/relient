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
import { redirect } from "next/navigation";

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
      const url = `${process.env.NEXTAUTH_URL}api/onboard/`;
      const response = await axios.post(
        url,
        {
          agencyName: formData.agencyName,
          industry: formData.industry,
          website: formData.agencyWebsite,
          teamSize: formData.teamSize
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Profile completed successfully!");
        setIsSubmitting(false);
        redirect("/dashboard");
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border shadow-md rounded-3xl overflow-hidden">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                <CardHeader>
                  <CardTitle>Agency Profile</CardTitle>
                  <CardDescription>Tell us about your agency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="agencyName">Agency Name</Label>
                    <Input
                      id="agencyName"
                      placeholder="e.g., Pixel & Co."
                      value={formData.agencyName}
                      onChange={(e) =>
                        updateFormData("agencyName", e.target.value)
                      }
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </motion.div>
                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="agencyWebsite">Website (Optional)</Label>
                    <Input
                      id="agencyWebsite"
                      placeholder="https://youragency.com"
                      value={formData.agencyWebsite}
                      onChange={(e) =>
                        updateFormData("agencyWebsite", e.target.value)
                      }
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </motion.div>
                  <motion.div variants={fadeInUp} className="space-y-2">
                    <Label htmlFor="agencyLogo">Logo Upload</Label>
                    <Input
                      id="agencyLogo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateFormData(
                            "agencyLogo",
                            URL.createObjectURL(file)
                          );
                        }
                      }}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </motion.div>
                  <div className="flex justify-between">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="industry">Primary Industry / Focus</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value: string) =>
                          updateFormData("industry", value)
                        }
                      >
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REALESTATE">
                            Real Estate
                          </SelectItem>
                          <SelectItem value="LAWYERS">Lawyers</SelectItem>
                          <SelectItem value="B2B">B2B Services</SelectItem>
                          <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                          <SelectItem value="ECOM">Ecommerce</SelectItem>
                          <SelectItem value="MEDICAL">Medical</SelectItem>
                          <SelectItem value="HOME_SERVICES">
                            Home Services
                          </SelectItem>
                          <SelectItem value="COACHING_CONSULTING">
                            Coaching & Consulting
                          </SelectItem>
                          <SelectItem value="SOLAR">Solar</SelectItem>
                          <SelectItem value="INSURANCE">Insurance</SelectItem>
                          <SelectItem value="FINANCE">Finance</SelectItem>
                          <SelectItem value="STAFFING">
                            Recruiting & Staffing
                          </SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Select
                        value={formData.teamSize}
                        onValueChange={(value: string) =>
                          updateFormData("teamSize", value)
                        }
                      >
                        <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 employees</SelectItem>
                          <SelectItem value="6-10">6-10 employees</SelectItem>
                          <SelectItem value="11-20">11-20 employees</SelectItem>
                          <SelectItem value="21-50">21-50 employees</SelectItem>
                          <SelectItem value="50+">50+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>
                </CardContent>
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-center pt-6 pb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center gap-1 transition-all duration-300 rounded-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="mt-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Step 1 of 1: Agency Profile
      </motion.div>
    </div>
  );
};

export default OnboardingForm;
