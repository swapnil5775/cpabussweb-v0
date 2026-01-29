"use client"

import type React from "react"
import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, Calendar, ArrowRight, ArrowLeft, Check, Shield, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CALENDLY_URL } from "@/lib/constants"

export default function ContactPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Contact Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    
    // Step 2: Client Type
    clientType: "",
    
    // Step 3: Services
    servicesNeeded: [] as string[],
    
    // Step 4: Business Details (conditional)
    businessName: "",
    businessStructure: "",
    stateOfFormation: "",
    yearEstablished: "",
    estimatedRevenue: "",
    numberOfEmployees: "",
    accountingSoftware: "",
    
    // Step 5: Additional Info
    currentSituation: "",
    hearAboutUs: "",
    additionalNotes: "",
  })

  const totalSteps = formData.clientType === "individual" ? 4 : 5

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.includes(service)
        ? prev.servicesNeeded.filter(s => s !== service)
        : [...prev.servicesNeeded, service]
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email
      case 2:
        return formData.clientType
      case 3:
        return formData.servicesNeeded.length > 0
      case 4:
        if (formData.clientType === "individual") return true
        return formData.businessName && formData.businessStructure
      case 5:
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase.from("leads").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        preferred_contact_method: formData.preferredContact,
        service_type: formData.clientType,
        services_needed: formData.servicesNeeded,
        business_legal_name: formData.businessName || null,
        entity_type: formData.businessStructure || null,
        states_of_operation: formData.stateOfFormation ? [formData.stateOfFormation] : null,
        annual_revenue_bucket: formData.estimatedRevenue || null,
        current_software: formData.accountingSoftware || null,
        current_bookkeeping_management: formData.currentSituation || null,
        pain_points: formData.hearAboutUs || null,
        anything_else: formData.additionalNotes || null,
        status: "new",
      })

      if (error) throw error
      
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your request. Please try again or email us directly at hello@bookkeeping.business")
    } finally {
      setIsSubmitting(false)
    }
  }

  const services = [
    { id: "monthly-bookkeeping", label: "Monthly Bookkeeping", description: "Ongoing monthly reconciliation & reports" },
    { id: "catchup-bookkeeping", label: "Catchup Bookkeeping", description: "Get caught up on past months/years" },
    { id: "tax-prep-personal", label: "Personal Tax Preparation", description: "Individual/married tax filing" },
    { id: "tax-prep-business", label: "Business Tax Preparation", description: "LLC, S-Corp, C-Corp, Partnership" },
    { id: "llc-formation", label: "LLC Formation Assistance", description: "Help setting up your business entity" },
    { id: "ein-application", label: "EIN Application Help", description: "Get your Employer ID Number" },
    { id: "registered-agent", label: "Registered Agent Services", description: "Compliance & document handling" },
    { id: "financial-analysis", label: "Financial Analysis", description: "Business health reviews & insights" },
    { id: "consultation", label: "Business Consultation", description: "Strategic planning & guidance" },
    { id: "other", label: "Other / Not Sure", description: "We'll help you figure it out" },
  ]

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <section className="container py-24">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-12 pb-12 text-center space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                  <Check className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold">Thank You!</h1>
                <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Your intake request has been received. A member of our team will review your information and reach out within 1-2 business days.
                </p>
                <p className="text-sm text-muted-foreground">
                  If we need any documents, we'll send you a secure upload link—no need to attach anything now.
                </p>
                
                <div className="border-t border-border pt-6 mt-6">
                  <h2 className="text-lg font-semibold mb-2">Want to get started faster?</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Schedule a free 15-minute consultation call right now.
                  </p>
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule a Call
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>

                <div className="pt-4">
                  <Button variant="outline" onClick={() => window.location.href = "/"} className="bg-transparent">
                    Return to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Get Started with BookKeeping.business
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Tell us about yourself and your needs. We'll reach out to discuss the best solution for you.
            </p>
          </div>
        </section>

        {/* Progress Indicator */}
        <section className="container pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      i + 1 < step
                        ? "bg-primary text-primary-foreground"
                        : i + 1 === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1 < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`h-1 w-12 sm:w-24 md:w-32 mx-2 rounded ${
                        i + 1 < step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Contact</span>
              <span>Type</span>
              <span>Services</span>
              {formData.clientType !== "individual" && <span>Business</span>}
              <span>Details</span>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="container pb-24">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>
                {step === 1 && "Contact Information"}
                {step === 2 && "What type of client are you?"}
                {step === 3 && "What services are you interested in?"}
                {step === 4 && formData.clientType === "individual" ? "Additional Information" : "Business Details"}
                {step === 5 && "Additional Information"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "How can we reach you?"}
                {step === 2 && "This helps us tailor our services to your needs"}
                {step === 3 && "Select all that apply"}
                {step === 4 && formData.clientType === "individual" ? "Help us understand your situation better" : "Tell us about your business"}
                {step === 5 && "Help us understand your situation better"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Preferred Contact Method</Label>
                    <RadioGroup
                      value={formData.preferredContact}
                      onValueChange={(value) => updateFormData("preferredContact", value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="contact-email" />
                        <Label htmlFor="contact-email" className="font-normal">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="contact-phone" />
                        <Label htmlFor="contact-phone" className="font-normal">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="either" id="contact-either" />
                        <Label htmlFor="contact-either" className="font-normal">Either</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 2: Client Type */}
              {step === 2 && (
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.clientType}
                    onValueChange={(value) => updateFormData("clientType", value)}
                    className="grid gap-4"
                  >
                    <Label
                      htmlFor="type-individual"
                      className={`flex items-start space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                        formData.clientType === "individual" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="individual" id="type-individual" className="mt-1" />
                      <div className="space-y-1">
                        <div className="font-medium">Individual / Personal</div>
                        <div className="text-sm text-muted-foreground">W-2 employee, retiree, or personal tax filing only</div>
                      </div>
                    </Label>
                    <Label
                      htmlFor="type-freelancer"
                      className={`flex items-start space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                        formData.clientType === "freelancer" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="freelancer" id="type-freelancer" className="mt-1" />
                      <div className="space-y-1">
                        <div className="font-medium">Freelancer / Self-Employed</div>
                        <div className="text-sm text-muted-foreground">1099 contractor, gig worker, or sole proprietor</div>
                      </div>
                    </Label>
                    <Label
                      htmlFor="type-small-business"
                      className={`flex items-start space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                        formData.clientType === "small-business" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="small-business" id="type-small-business" className="mt-1" />
                      <div className="space-y-1">
                        <div className="font-medium">Small Business Owner</div>
                        <div className="text-sm text-muted-foreground">LLC, S-Corp, C-Corp, or Partnership</div>
                      </div>
                    </Label>
                    <Label
                      htmlFor="type-startup"
                      className={`flex items-start space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                        formData.clientType === "startup" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="startup" id="type-startup" className="mt-1" />
                      <div className="space-y-1">
                        <div className="font-medium">Starting a New Business</div>
                        <div className="text-sm text-muted-foreground">Planning to form an LLC or need help getting started</div>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              )}

              {/* Step 3: Services */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {services.map((service) => (
                      <Label
                        key={service.id}
                        htmlFor={service.id}
                        className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                          formData.servicesNeeded.includes(service.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          id={service.id}
                          checked={formData.servicesNeeded.includes(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                          className="mt-0.5"
                        />
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{service.label}</div>
                          <div className="text-xs text-muted-foreground">{service.description}</div>
                        </div>
                      </Label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Business Details (or Additional Info for individuals) */}
              {step === 4 && formData.clientType !== "individual" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => updateFormData("businessName", e.target.value)}
                      placeholder="Your Business LLC"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessStructure">Business Structure *</Label>
                      <Select
                        value={formData.businessStructure}
                        onValueChange={(value) => updateFormData("businessStructure", value)}
                      >
                        <SelectTrigger id="businessStructure">
                          <SelectValue placeholder="Select structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sole-proprietor">Sole Proprietorship</SelectItem>
                          <SelectItem value="llc-single">LLC (Single Member)</SelectItem>
                          <SelectItem value="llc-multi">LLC (Multi Member)</SelectItem>
                          <SelectItem value="s-corp">S-Corporation</SelectItem>
                          <SelectItem value="c-corp">C-Corporation</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="not-formed">Not Yet Formed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stateOfFormation">State of Formation</Label>
                      <Input
                        id="stateOfFormation"
                        value={formData.stateOfFormation}
                        onChange={(e) => updateFormData("stateOfFormation", e.target.value)}
                        placeholder="e.g., Delaware, Texas"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="yearEstablished">Year Established</Label>
                      <Input
                        id="yearEstablished"
                        value={formData.yearEstablished}
                        onChange={(e) => updateFormData("yearEstablished", e.target.value)}
                        placeholder="e.g., 2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                      <Select
                        value={formData.numberOfEmployees}
                        onValueChange={(value) => updateFormData("numberOfEmployees", value)}
                      >
                        <SelectTrigger id="numberOfEmployees">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="just-me">Just me</SelectItem>
                          <SelectItem value="2-5">2-5</SelectItem>
                          <SelectItem value="6-10">6-10</SelectItem>
                          <SelectItem value="11-25">11-25</SelectItem>
                          <SelectItem value="26-50">26-50</SelectItem>
                          <SelectItem value="50+">50+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedRevenue">Estimated Annual Revenue</Label>
                      <Select
                        value={formData.estimatedRevenue}
                        onValueChange={(value) => updateFormData("estimatedRevenue", value)}
                      >
                        <SelectTrigger id="estimatedRevenue">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre-revenue">Pre-revenue / Just Starting</SelectItem>
                          <SelectItem value="under-50k">Under $50K</SelectItem>
                          <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                          <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                          <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                          <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                          <SelectItem value="over-1m">Over $1M</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountingSoftware">Current Accounting Software</Label>
                      <Select
                        value={formData.accountingSoftware}
                        onValueChange={(value) => updateFormData("accountingSoftware", value)}
                      >
                        <SelectTrigger id="accountingSoftware">
                          <SelectValue placeholder="Select software" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None / Spreadsheets</SelectItem>
                          <SelectItem value="quickbooks">QuickBooks</SelectItem>
                          <SelectItem value="xero">Xero</SelectItem>
                          <SelectItem value="freshbooks">FreshBooks</SelectItem>
                          <SelectItem value="wave">Wave</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 for Individuals OR Step 5 for Businesses: Additional Info */}
              {((step === 4 && formData.clientType === "individual") || step === 5) && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentSituation">Tell us about your current situation</Label>
                    <Textarea
                      id="currentSituation"
                      value={formData.currentSituation}
                      onChange={(e) => updateFormData("currentSituation", e.target.value)}
                      placeholder="e.g., I'm behind on bookkeeping for 2024, need help catching up before tax season..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hearAboutUs">How did you hear about us?</Label>
                    <Select
                      value={formData.hearAboutUs}
                      onValueChange={(value) => updateFormData("hearAboutUs", value)}
                    >
                      <SelectTrigger id="hearAboutUs">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Search</SelectItem>
                        <SelectItem value="referral">Friend / Colleague Referral</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Anything else we should know?</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => updateFormData("additionalNotes", e.target.value)}
                      placeholder="Any questions, concerns, or specific needs..."
                      rows={3}
                    />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">No documents needed right now.</strong> If we need any files from you, we'll send a secure upload link after reviewing your request.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                
                {step < totalSteps ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Options */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
              <h2 className="text-2xl font-bold tracking-tight">Other Ways to Reach Us</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              <Card>
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="text-sm text-muted-foreground">hello@bookkeeping.business</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">Book a Call</h3>
                    <p className="text-sm text-muted-foreground">15-min consultation</p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="text-left">
                      <p className="text-xs font-medium text-foreground">New Customers</p>
                      <p className="text-xs text-muted-foreground">
                        Please submit the intake form above first. After submission, you'll be able to schedule a call.
                      </p>
                    </div>
                    <div className="text-left border-t border-border pt-3">
                      <p className="text-xs font-medium text-foreground">Existing Clients</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Schedule directly using the link below.
                      </p>
                      <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full bg-transparent gap-2">
                          <Calendar className="h-3 w-3" />
                          Schedule a Call
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
