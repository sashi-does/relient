'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faqs() {
  return (
    <div className="max-w-2xl py-10 my-[100px] mx-auto p-6">
      <h1 className="text-4xl text-center py-1 font-medium md:text-5xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">FAQs</h1>
      <Accordion type="single" collapsible className="w-full space-y-2">

        <AccordionItem value="who-is-relient-for">
          <AccordionTrigger>Who is Relient for?</AccordionTrigger>
          <AccordionContent>
            Relient is for lead generation agencies that want a simple, branded way to share project updates, collect payments, and keep clients in the loop.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="does-client-need-account">
          <AccordionTrigger>Do clients need an account to view their portal?</AccordionTrigger>
          <AccordionContent>
            Nope! Clients can view their portal via a secure link—no signup or login needed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customize-modules">
          <AccordionTrigger>Can I customize what modules appear in a portal?</AccordionTrigger>
          <AccordionContent>
            Yes, you can choose which modules (Tasks, Leads, Appointments, etc.) are visible in each client portal.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="secure-portals">
          <AccordionTrigger>Are portals secure?</AccordionTrigger>
          <AccordionContent>
            Yes. Each portal has a unique, private URL. Password protection is coming soon.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="is-relient-free">
          <AccordionTrigger>Is Relient free?</AccordionTrigger>
          <AccordionContent>
            Yes, we offer a generous free plan. Paid plans unlock branding and advanced modules.
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
