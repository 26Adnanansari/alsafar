"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Umrah packages mein kya kya shamil hota hai?",
    answer: "Hamare standard packages mein 5-Star ya verified hotels (Makkah & Madinah), approved visa processing, direct flight tickets, aur transport (Jeddah to Makkah/Madinah) mukammal shamil hote hain. Ziyarat tours VIP aur Deluxe packages ka hissa hain.",
  },
  {
    question: "Kya hum payments installments (iqsaat) mein kar sakte hain?",
    answer: "Ji haan! Al-Safar aapko flexible installment plans deta hai. Aap booking ke waqt 50% down payment kar sakte hain aur baqi ki raqam safar ki rawangi se 15 din pehle tak installments mein ada kar sakte hain.",
  },
  {
    question: "Visa processing mein kitna waqt lagta hai?",
    answer: "Umrah visa aam taur par documents submit karne ke 3 se 5 working days mein approve ho jata hai. Hajj visa ki approvals Saudi Ministry ke schedule ke mutabiq hoti hain.",
  },
  {
    question: "Nusuk meal vouchers ka kya rule hai?",
    answer: "Halia Saudi Arab rules ke mutabiq kuch package tiers mein daily meal vouchers (SAR 20/day value) add karna mandatory ho chuka hai. Hamare packages in rules ke sath fully compliant aur updated hote hain.",
  },
  {
    question: "Agar visa reject ho jaye ya hum plan cancel karein to refund policy kya hai?",
    answer: "Visa fee non-refundable hoti hai kyunki wo Saudi Ministry ko chali jati hai. Hotel aur flight cancellation rates hamari terms of service ke mutabiq depend karte hain, jo booking ke waqt wazeh bata diye jate hain.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="group overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:border-gold/40 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-display text-base font-semibold text-foreground md:px-6 md:py-5"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/5 text-primary transition-transform duration-300 group-hover:bg-primary group-hover:text-white">
                  <ChevronDown
                    size={16}
                    className={cn("transition-transform duration-300", isOpen && "rotate-180")}
                  />
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground md:px-6 md:py-5">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
