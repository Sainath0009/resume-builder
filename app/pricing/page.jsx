import Link from "next/link"
import { Check, Star } from "lucide-react"
import { Button }from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: ["3 resume templates", "Basic AI suggestions", "PDF download", "Email support"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "month",
      description: "Best for job seekers",
      features: [
        "All resume templates",
        "Advanced AI suggestions",
        "Unlimited PDF downloads",
        "Cover letter builder",
        "Priority support",
        "ATS optimization",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Premium",
      price: "$19",
      period: "month",
      description: "For professionals",
      features: [
        "Everything in Pro",
        "LinkedIn optimization",
        "Interview preparation",
        "Career coaching",
        "Portfolio builder",
        "White-label resumes",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-teal-100 text-teal-800 border-0">Pricing Plans</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
            Start for free and upgrade when you need more features. All plans include our core resume building tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-teal-500 shadow-lg scale-105" : "border-zinc-200"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-teal-600 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-zinc-600">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-zinc-600">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-teal-600 mr-3 flex-shrink-0" />
                      <span className="text-zinc-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link href="/builder" className="w-full">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. No questions asked.",
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans.",
              },
              {
                question: "Can I change plans later?",
                answer: "You can upgrade or downgrade your plan at any time.",
              },
            ].map((faq, index) => (
              <div key={index} className="text-left">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-zinc-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
