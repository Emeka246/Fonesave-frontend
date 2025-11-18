import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ROUTES from "@/routes/ROUTES_CONFIG";
import { useNavigate } from "react-router-dom";

const faqData = [
  {
    id: "faq-1",
    question: "What is FoneOwner?",
    answer:
      "FoneOwner is a digital platform that helps you protect your phone. You can to mark your phone as stolen or safe, making it easier to recover your device or prevent others from buying stolen phones. FoneOwner also gives agents the opportunity to earn money by helping others register their phones.",
  },
  {
    id: "faq-2",
    question: "What is an IMEI number and how do I find it?",
    answer:
      "The IMEI (International Mobile Equipment Identity) is a unique 15-digit number that identifies your phone. To find it, dial *#06# on your device, or check your phone's box or settings.",
  },
  {
    id: "faq-3",
    question: "Why should I register my phone on FoneOwner?",
    answer:
      "To prove ownership of your device. To mark your phone as stolen if it gets lost. To prevent stolen phones from being resold. To give buyers confidence when purchasing used phones.",
  },
  {
    id: "faq-4",
    question: "How much does it cost to register my phone?",
    answer:
      "Registration costs ₦1000 per year (per device) in Nigeria. Agents may charge a little extra as service fees.",
  },
  {
    id: "faq-5",
    question: "Who are FoneOwner Agents?",
    answer:
      "Agents are trusted partners who help users register their devices. They can assist if you don't have internet access or if you prefer in-person support.",
  },
  {
    id: "faq-6",
    question: "Can I verify a phone before buying it?",
    answer:
      "Yes. Simply enter the phone's IMEI number on Foneowner.com to instantly see if it's marked as Safe or Stolen.",
  },
  {
    id: "faq-7",
    question: "What happens if my phone is stolen?",
    answer:
      "Log in to your FoneOwner account and mark your device as Stolen. This status will appear in searches, alerting potential buyers not to purchase it.",
  },
  {
    id: "faq-8",
    question: "How do I transfer ownership of my phone to someone else?",
    answer:
      'You can use the Transfer Ownership option in your dashboard. Click "View Details" of the device you want to transfer ownership. Then click -Transfer Ownership- button. This will remove the device from your account so the new owner can register it under their own account.',
  },
  {
    id: "faq-9",
    question: "How do I delete my FoneOwner account?",
    answer:
      "If you wish to delete your account: Log in to your dashboard. Go to Dashboard > Profile > Delete Account. Confirm the deletion. ⚠️ Warning: Deleting your account will remove all your registered devices and cannot be undone.",
  },
  {
    id: "faq-10",
    question: "Is my data safe with FoneOwner?",
    answer:
      "Yes. We take privacy and security seriously. Your IMEI and personal information are encrypted and protected. We never sell your data to third parties.",
  },
];

export function FAQs() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="section-title">Frequently Asked Questions</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-lg border "
              >
                <AccordionTrigger className="text-left font-semibold cursor-pointer px-6  transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className=" leading-relaxed px-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Still have questions? We're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="blue" onClick={() => navigate(ROUTES.CONTACT)}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
