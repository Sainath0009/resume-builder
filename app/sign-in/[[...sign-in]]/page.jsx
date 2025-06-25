import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-white py-12">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white",
            footerActionLink: "text-teal-600 hover:text-teal-700",
          },
        }}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
       
      />
    </div>
  )
}
