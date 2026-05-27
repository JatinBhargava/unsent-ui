import Navbar from "../components/Navbar";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By using this Diary Application, you agree to follow these Terms and Conditions and all applicable laws and regulations.",
  },
  {
    title: "2. User Accounts",
    bullets: [
      "Users are responsible for keeping login credentials secure.",
      "You are responsible for activities performed through your account.",
      "Do not share credentials with others.",
    ],
  },
  {
    title: "3. User Content Ownership",
    bullets: [
      "All diary entries, notes, images, and uploaded content remain the property of the user.",
      "The application does not claim ownership of personal content.",
      "Users are responsible for content they create and store.",
    ],
  },
  {
    title: "4. Privacy & Data Protection",
    bullets: [
      "Personal information is handled according to the Privacy Policy.",
      "Sensitive information should be protected by strong passwords.",
      "The application may store data securely for synchronization and backup purposes.",
    ],
  },
  {
    title: "5. Acceptable Usage",
    intro: "Users must not:",
    bullets: [
      "Upload illegal, harmful, abusive, or offensive content.",
      "Attempt unauthorized access to accounts or systems.",
      "Use the application for fraudulent activities.",
      "Disrupt services or misuse platform resources.",
    ],
  },
  {
    title: "6. Data Backup & Recovery",
    bullets: [
      "Users are encouraged to maintain backups.",
      "The application may provide cloud backup features.",
      "Data recovery cannot always be guaranteed.",
    ],
  },
  {
    title: "7. Security",
    bullets: [
      "Reasonable security measures are implemented.",
      "No online system can guarantee absolute security.",
      "Users should enable available security options.",
    ],
  },
  {
    title: "8. Account Suspension",
    intro: "Accounts may be suspended if users:",
    bullets: [
      "Violate platform rules",
      "Abuse services",
      "Perform malicious activities",
      "Attempt unauthorized access",
    ],
  },
  {
    title: "9. Service Availability",
    bullets: [
      "Features may change, update, or be removed.",
      "Temporary downtime may occur during maintenance.",
      "Continuous availability is not guaranteed.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    intro: "The application is provided \"as is.\" The platform is not liable for:",
    bullets: [
      "Data loss",
      "Service interruption",
      "Unauthorized access caused by user negligence",
      "Third-party service failures",
    ],
  },
  {
    title: "11. Third-Party Services",
    intro: "The application may integrate with:",
    bullets: [
      "Authentication providers",
      "Cloud storage services",
      "Analytics tools",
      "Notification services",
    ],
    outro: "Their policies may apply separately.",
  },
  {
    title: "12. Account Deletion",
    intro: "Users may request deletion of:",
    bullets: [
      "Account information",
      "Diary entries",
      "Uploaded files",
      "Personal data where applicable",
    ],
  },
  {
    title: "13. Changes to Terms",
    body: "Terms may be updated periodically. Continued use means acceptance of updated terms.",
  },
  // {
  //   title: "14. Contact Information",
  //   bullets: [
  //     "For support or legal concerns:",
  //     // "Email: support@yourapp.com",
  //     "Application: Unsent",
  //   ],
  // },
];

export default function Terms() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="w-full max-w-4xl">
        <Navbar />

        <header className="mb-10 sm:mb-14 text-center">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Terms & <span className="italic">Conditions</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Please review these terms carefully before using the Diary
            Application.
          </p>
        </header>

        <main className="pb-10">
          <div className="space-y-10 sm:space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
                  {section.title}
                </h2>
                {section.body && (
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700 max-w-3xl">
                    {section.body}
                  </p>
                )}
                {section.intro && (
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-700 max-w-3xl">
                    {section.intro}
                  </p>
                )}
                {section.bullets && (
                  <ul className="mt-3 space-y-2 text-sm sm:text-base text-gray-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>{bullet}</span>
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
          </div>
        </main>
      </div>
    </div>
  );
}
