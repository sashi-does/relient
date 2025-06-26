"use client";

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { Button } from "@repo/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card"
import Input from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { toast } from "sonner"
import { cn } from "@repo/ui/utils"
import axios from "axios"

const steps = [
  { id: "agency", title: "Agency Profile" },
  { id: "founder", title: "Founder Info" }
]


interface FormData {
  // Agency Profile
  agencyName: string;
  agencyWebsite: string;
  agencyLogo: string;
  industry: string;
  teamSize: string;
  
  // Founder Info
  fullName: string;
  position: string;
  workEmail: string;
  phoneNumber: string;
}


const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
}

const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    agencyName: "",
    agencyWebsite: "",
    agencyLogo: "",
    industry: "",
    teamSize: "",
    fullName: "",
    position: "",
    workEmail: "",
    phoneNumber: ""
  })

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const url = `http://localhost:3000/api/onboarding/complete-profile/`
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      toast.success("Profile completed successfully!")

      // await axios.get("/api/auth/refresh-token") add profile settings


      setIsSubmitting(false)
    } catch (error) {
      toast.error("Failed to complete profile")
      setIsSubmitting(false)
    }
  }

  // Check if step is valid for next button
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.agencyName.trim() !== "" && formData.industry !== ""
      case 1:
        return formData.fullName.trim() !== "" && formData.workEmail.trim() !== ""
      default:
        return true
    }
  }


  const preventDefault = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      {/* Progress indicator */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={cn(
                  "w-4 h-4 rounded-full cursor-pointer transition-colors duration-300",
                  index < currentStep
                    ? "bg-primary"
                    : index === currentStep
                      ? "bg-primary ring-4 ring-primary/20"
                      : "bg-muted"
                )}
                onClick={() => {
                  // Only allow going back or to completed steps
                  if (index <= currentStep) {
                    setCurrentStep(index)
                  }
                }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.span 
                className={cn(
                  "text-xs mt-1.5 hidden sm:block",
                  index === currentStep ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {step.title}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
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
                {/* Step 1: Agency Profile */}
                {currentStep === 0 && (
                  <>
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
                          onChange={(e) => updateFormData("agencyName", e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="agencyWebsite">Website (Optional)</Label>
                        <Input
                          id="agencyWebsite"
                          placeholder="https://youragency.com"
                          value={formData.agencyWebsite}
                          onChange={(e) => updateFormData("agencyWebsite", e.target.value)}
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
                            const file = e.target.files?.[0]
                            if (file) {
                              // Handle file upload logic here
                              updateFormData("agencyLogo", URL.createObjectURL(file))
                            }
                          }}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="industry">Primary Industry / Focus</Label>
                        <Select value={formData.industry} onValueChange={(value: string) => updateFormData("industry", value)}>
                          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web-dev">Web Development</SelectItem>
                            <SelectItem value="branding">Branding</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="teamSize">Team Size</Label>
                        <Select value={formData.teamSize} onValueChange={(value: string) => updateFormData("teamSize", value)}>
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
                    </CardContent>
                  </>
                )}

                {/* Step 2: Founder Info */}
                {currentStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>Founder or Account Owner Info</CardTitle>
                      <CardDescription>Set up your account admin details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => updateFormData("fullName", e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Select value={formData.position} onValueChange={(value: string) => updateFormData("position", value)}>
                          <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                            <SelectValue placeholder="Select your position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="founder">Founder</SelectItem>
                            <SelectItem value="pm">Project Manager</SelectItem>
                            <SelectItem value="director">Director</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="workEmail">Work Email</Label>
                        <Input
                          id="workEmail"
                          type="email"
                          placeholder="john@youragency.com"
                          value={formData.workEmail}
                          onChange={(e) => updateFormData("workEmail", e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phoneNumber}
                          onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6 pb-4">
              <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 transition-all duration-300 rounded-md"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                <Button
                  type="button"
                  onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className={cn(
                    "flex items-center gap-1 transition-all duration-300 rounded-md",
                    currentStep === steps.length - 1 ? "" : ""
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? "Submit" : "Next"}
                      {currentStep === steps.length - 1 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
      </motion.div>
    </div>
  )
}

export default OnboardingForm