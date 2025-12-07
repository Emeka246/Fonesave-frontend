import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, HeadphonesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ContactService from "@/services/contact.service";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await ContactService.submitContactForm(formData);

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Message sent successfully! We'll get back to you soon."
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(
          response.data.message || "Failed to send message. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className=" bg-zinc-100 dark:bg-zinc-950">
        <div className="container py-t lg:pt-40 pb-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="section-badge">Contact Us</Badge>
            <h1 className="page-title">Get in touch with our team</h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              Have questions about IMEI verification? Need support? We're here
              to help. Reach out to us and we'll respond as quickly as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info & Form in One Grid Section */}
      <section className="section-space">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-16">
            {/* Contact Information */}
            <div className="space-y-8 md:col-span-2">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Mail className="w-6 h-6 " />
                  </div>
                  <CardTitle>Email Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4 text-balance">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <a
                    href="mailto:support@foneowner.com"
                    className="text-primary hover:underline font-medium"
                  >
                    support@foneowner.com
                  </a>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <HeadphonesIcon className="w-6 h-6" />
                  </div>
                  <CardTitle>Phone Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Call us for immediate assistance
                  </p>
                  <div className="flex flex-col items-center space-y-2">
                    <a
                      href="https://wa.me/2348104383626"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-medium flex items-center gap-1"
                      aria-label="Chat on WhatsApp"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline w-4 h-4"
                        viewBox="0 0 32 32"
                        fill="currentColor"
                      >
                        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.09L4 29l7.18-2.32C13.08 27.14 14.51 27.5 16 27.5c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.34 0-2.65-.26-3.87-.77l-.28-.12-4.27 1.38 1.4-4.16-.18-.29C7.26 18.01 7 16.52 7 15c0-5.01 4.04-9.08 9-9.08s9 4.07 9 9.08-4.04 9.08-9 9.08zm5.13-6.37c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.28 1.23.45 1.65.58.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                      </svg>
                      WhatsApp: +234 810 438 3626
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Contact Form */}
            <div className="md:col-span-2 flex items-center">
              <Card className="w-full">
                <CardHeader>
                  <h2 className="section-title text-2xl">Send us a message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full py-3"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
