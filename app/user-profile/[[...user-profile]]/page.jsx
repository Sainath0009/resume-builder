import { UserProfile } from "@clerk/nextjs"

export default function UserProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <UserProfile
        appearance={{
          elements: {
            formButtonPrimary: "bg-teal-600 hover:bg-teal-700 text-white",
            navbarButton: "text-teal-600 hover:text-teal-700",
            card: "shadow-md rounded-lg border border-zinc-200",
          },
        }}
        path="/user-profile"
        routing="path"
      />
    </div>
  )
}
