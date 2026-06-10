import Navbar from "../components/Navbar";
import { linkifyEmail, getPrivacyLastUpdated } from "../utils/Util";

const sections = [
  {
    title: "1. Information We Collect",
    intro: "We may collect the following information:",
    groups: [
      {
        heading: "Personal Information",
        items: [
          "Name",
          "Email address",
          "Profile picture (if provided)",
          "Account credentials",
        ],
      },
      {
        heading: "Diary Content",
        items: [
          "Notes and diary entries",
          "Images or attachments uploaded by users",
          "Saved memories and personal records",
        ],
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    intro: "We use collected information to:",
    items: [
      "Create and manage accounts",
      "Save and synchronize diary entries",
      "Improve application performance",
      "Provide notifications and reminders",
      "Enhance user experience",
      "Maintain security and prevent misuse",
    ],
  },
  {
    title: "3. Ownership of Content",
    body: "All diary entries, notes, images, and uploaded content remain the property of the user. We do not sell, claim ownership of, or intentionally access personal diary content unless required for security, legal obligations, or user-requested support.",
  },
  {
    title: "4. Data Storage & Security",
    intro:
      "We implement reasonable security measures to protect user information, including:",
    items: [
      "Secure authentication",
      "Encrypted communication",
      "Access controls",
      "Protected storage systems",
    ],
    outro:
      "However, no internet-based service can guarantee complete security.",
  },
  {
    title: "5. Data Sharing",
    body: "We do not sell personal information.",
    intro: "Information may only be shared:",
    items: [
      "When required by law",
      "To protect users and platform security",
      "With trusted service providers supporting application functionality",
      "With user consent",
    ],
  },
  {
    title: "6. Cookies & Analytics",
    intro: "The application may use:",
    items: [
      "Authentication cookies",
      "Session storage",
      "Analytics tools",
      "Performance monitoring services",
    ],
    outro: "These help improve performance and user experience.",
  },
  {
    title: "7. User Rights",
    intro: "Users may request:",
    items: [
      "View personal data",
      "Edit profile information",
      "Export stored content",
      "Delete diary entries",
      "Delete account and associated data",
    ],
    outro: "Requests may be processed according to applicable laws.",
  },
  {
    title: "8. Account Deletion",
    intro: "Users can request permanent deletion of:",
    items: [
      "Account information",
      "Diary entries",
      "Uploaded files",
      "Stored personal data",
    ],
    outro:
      "Some information may remain temporarily for backup, security, or legal purposes.",
  },
  {
    title: "9. Data Retention",
    intro: "Information is stored only as long as necessary for:",
    items: [
      "Account management",
      "Security purposes",
      "Backup and recovery",
      "Legal obligations",
    ],
    outro: "Unused data may be removed according to retention policies.",
  },
  {
    title: "10. Children’s Privacy",
    body: "This application is not intended for users below the minimum age required by applicable laws without parental permission.",
  },
  {
    title: "11. Policy Updates",
    body: "We may update this Privacy Policy periodically. Continued use of the application after updates means acceptance of revised terms.",
  },
  {
    title: "12. Contact Us",
    body: "If you have questions regarding privacy or data handling, reach out at unsentoffical@gmail.com",
  },
];

export default function Privacy() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="w-full max-w-4xl">
        <Navbar />

        <header className="mb-10 sm:mb-14 text-center">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Privacy <span className="italic">Policy</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Last Updated: {getPrivacyLastUpdated()}
          </p>
          <p className="mt-2 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Welcome to Diary App. Your privacy is important to us.
          </p>
        </header>

        <main className="pb-10 space-y-10 sm:space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
                {section.title}
              </h2>

              {section.body && (
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700 max-w-3xl">
                  {linkifyEmail(section.body)}
                </p>
              )}

              {section.intro && (
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700 max-w-3xl">
                  {section.intro}
                </p>
              )}

              {section.groups && (
                <div className="mt-4 space-y-4">
                  {section.groups.map((group) => (
                    <div key={group.heading}>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {group.heading}
                      </p>
                      <ul className="mt-2 space-y-2 text-sm sm:text-base text-gray-700">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {section.items && (
                <ul className="mt-3 space-y-2 text-sm sm:text-base text-gray-700">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.outro && (
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700 max-w-3xl">
                  {section.outro}
                </p>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
