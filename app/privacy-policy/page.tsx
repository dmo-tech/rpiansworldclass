import Image from "next/image";

import Reveal from "../Reveal";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="inline-flex items-center gap-2">
          <Image
            src="/rpians-logo.png"
            alt="RPIANS logo"
            width={32}
            height={24}
            className="h-7 w-auto"
          />
          <span className="text-[#3b82f6]">← Return to Home</span>
        </a>

        <p className="mt-12 text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
          Legal Information
        </p>

        <h1 className="mt-5 font-serif text-4xl md:text-6xl">
          Privacy Policy
        </h1>

        <p className="mt-5 text-gray-400">
          Last Updated: 22 July 2026
        </p>

        <div className="mt-12 space-y-10 leading-8 text-gray-300">
          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Personally Identifiable Information
            </h2>

            <p className="mt-4">
              Personally Identifiable Information, also called PII, means
              information that can be used to identify, contact, or locate a
              person or business owner.
            </p>

            <p className="mt-4">This may include:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>WhatsApp number</li>
              <li>Business name</li>
              <li>Business category</li>
              <li>City and state</li>
              <li>Turnover range</li>
              <li>Business challenges</li>
              <li>Payment details</li>
              <li>Call booking information</li>
              <li>Application form responses</li>
              <li>Any other information you voluntarily submit to us</li>
            </ul>

            <p className="mt-4">
              We collect this information only when you choose to submit it
              through our website, landing page, VSL registration page,
              payment page, form, WhatsApp, email, phone call, or other
              communication channel.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              2. When Do We Collect Information?
            </h2>

            <p className="mt-4">We may collect your information when you:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Register for our Video Sales Letter</li>
              <li>Watch or access our video training</li>
              <li>Fill out a form</li>
              <li>Book a strategy call</li>
              <li>Make a payment</li>
              <li>Subscribe to updates</li>
              <li>Respond to our ads or marketing communication</li>
              <li>Contact us through WhatsApp, phone, email, or website</li>
              <li>
                Purchase or enquire about our coaching, consulting, training,
                or implementation services
              </li>
            </ul>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              3. How Do We Use Your Information?
            </h2>

            <p className="mt-4">
              We may use your information for the following purposes:
            </p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>To register you for our Video Sales Letter or video training</li>
              <li>To schedule your strategy call</li>
              <li>To review your business application</li>
              <li>To contact you through phone, WhatsApp, SMS, or email</li>
              <li>To send reminders, updates, offers, and follow-up communication</li>
              <li>To process payment or refund requests</li>
              <li>To understand your business challenges</li>
              <li>
                To provide information about our Business Automation and
                Profit Multiplication Strategy
              </li>
              <li>To personalize your experience</li>
              <li>
                To improve our website, landing pages, ads, video training,
                and services
              </li>
              <li>To send periodic emails or messages related to our services</li>
              <li>To maintain business and legal records</li>
              <li>To prevent fraud, misuse, or unauthorized activity</li>
            </ul>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Confidentiality of Your Data
            </h2>

            <p className="mt-4">
              Your personal and business information is confidential to us.
            </p>

            <p className="mt-4">
              We do not sell, rent, trade, or commercially share your
              personal or confidential business data with any third party
              for their independent marketing or selling purpose.
            </p>

            <p className="mt-4">
              Your information may be used only by RPIANS World Class
              Business Coaching LLP, Rajesh Kumar Kare, and our authorized
              team members for application review, call scheduling, business
              communication, payment support, consulting support, service
              delivery, and internal business purposes.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Non-Personal Information
            </h2>

            <p className="mt-4">
              Non-personal information means information that cannot
              directly identify you.
            </p>

            <p className="mt-4">This may include:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Browser type</li>
              <li>Device type</li>
              <li>IP address</li>
              <li>Pages visited</li>
              <li>Time spent on website</li>
              <li>Video watch behaviour</li>
              <li>Ad interaction</li>
              <li>Website traffic data</li>
              <li>Cookie data</li>
              <li>General location data</li>
              <li>
                Source of visit such as Instagram, Facebook, Google,
                WhatsApp, or referral link
              </li>
            </ul>

            <p className="mt-4">
              We may use non-personal information to improve our website,
              landing pages, advertisements, video training, user experience,
              and marketing performance.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              6. Cookies and Tracking Technologies
            </h2>

            <p className="mt-4">
              Yes, we may use cookies and similar technologies such as
              pixels, tags, and web beacons.
            </p>

            <p className="mt-4">
              Cookies are small files that a website or service provider
              transfers to your computer or device through your browser.
              Cookies help us recognize your browser, understand your
              preferences, and improve your experience.
            </p>

            <p className="mt-4">We may use cookies to:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Understand and save user preferences</li>
              <li>Track website and landing page performance</li>
              <li>Measure Video Sales Letter engagement</li>
              <li>Track advertisements</li>
              <li>Analyze visitor behaviour</li>
              <li>Improve user experience</li>
              <li>Retarget interested visitors with relevant ads</li>
              <li>
                Compile aggregate data about site traffic and interaction
              </li>
            </ul>

            <p className="mt-4">
              You can choose to disable cookies through your browser
              settings. If you disable cookies, some features of our
              website, landing page, or funnel may not function properly.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              7. Third-Party Disclosure
            </h2>

            <p className="mt-4">
              We do not sell, trade, or otherwise transfer your personally
              identifiable information to outside parties for independent
              selling or marketing purposes.
            </p>

            <p className="mt-4">
              However, we may share limited necessary information with
              trusted third-party service providers who help us operate our
              website, conduct our business, process payments, communicate
              with users, or serve you better.
            </p>

            <p className="mt-4">These may include:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Website hosting partners</li>
              <li>Payment gateways such as Razorpay, Instamojo, UPI, or other platforms</li>
              <li>Email marketing tools</li>
              <li>WhatsApp communication tools</li>
              <li>CRM tools</li>
              <li>Analytics tools</li>
              <li>
                Advertising platforms such as Google, Facebook, Instagram,
                and Meta
              </li>
              <li>Technology and automation service providers</li>
            </ul>

            <p className="mt-4">
              These third parties are expected to keep your information
              confidential and use it only for the purpose of providing
              services to us.
            </p>

            <p className="mt-4">
              We may also release your information when required to comply
              with the law, enforce our policies, protect our rights,
              prevent fraud, or ensure the safety of our users and business.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              8. Payment Information
            </h2>

            <p className="mt-4">
              When you make payment through Razorpay, Instamojo, UPI, bank
              transfer, or any other payment platform, your payment
              information is processed by the respective payment gateway.
            </p>

            <p className="mt-4">
              We do not store your complete card details, CVV, UPI PIN,
              banking password, or sensitive payment credentials.
            </p>

            <p className="mt-4">
              Payment gateways may collect and process your data according
              to their own privacy policies and terms of service.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              9. Video Sales Letter and Lead Registration
            </h2>

            <p className="mt-4">
              When a candidate or business owner registers for our Video
              Sales Letter, video training, or strategy call, we may collect
              name, phone number, email ID, business details, and other
              submitted information.
            </p>

            <p className="mt-4">This information may be used to:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Send video training access</li>
              <li>Share strategy call details</li>
              <li>Send reminders and follow-ups</li>
              <li>Understand your business suitability</li>
              <li>Provide business education content</li>
              <li>
                Offer coaching, consulting, implementation, or related
                services
              </li>
            </ul>

            <p className="mt-4">
              By registering, you consent to receive communication from us
              through phone, WhatsApp, SMS, email, or other business
              communication channels.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              10. Google, Meta, and Advertising Platforms
            </h2>

            <p className="mt-4">
              We may use advertising and analytics services from platforms
              such as Google, Facebook, Instagram, Meta, or other
              third-party advertising platforms.
            </p>

            <p className="mt-4">
              These platforms may use cookies, pixels, tags, or similar
              technologies to show relevant ads, track conversions, measure
              campaign performance, and understand user behaviour.
            </p>

            <p className="mt-4">We may use features such as:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Remarketing</li>
              <li>Retargeting</li>
              <li>Conversion tracking</li>
              <li>Demographics and interest reporting</li>
              <li>Ad performance tracking</li>
              <li>Website analytics</li>
            </ul>

            <p className="mt-4">
              You may manage or opt out of personalized advertising through
              the settings provided by Google, Meta, or your browser.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              11. Third-Party Links
            </h2>

            <p className="mt-4">
              Our website, emails, ads, video training pages, or landing
              pages may include links to third-party websites, payment
              gateways, tools, videos, or platforms.
            </p>

            <p className="mt-4">
              These third-party websites have separate and independent
              privacy policies.
            </p>

            <p className="mt-4">
              We are not responsible for the content, privacy practices,
              security, or activities of those third-party websites. We
              encourage you to read their privacy policies before submitting
              your information.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              12. How Do We Protect Your Information?
            </h2>

            <p className="mt-4">
              We take reasonable steps to protect your personal information
              from unauthorized access, misuse, loss, alteration, or
              disclosure.
            </p>

            <p className="mt-4">
              We may use malware scanning, website monitoring, access
              control, secure tools, and internal data protection practices.
            </p>

            <p className="mt-4">
              However, no website, payment gateway, email system, or digital
              communication platform can be guaranteed to be 100% secure. You
              are responsible for submitting accurate information and
              keeping your own devices, email accounts, and communication
              channels secure.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              13. Data Retention
            </h2>

            <p className="mt-4">
              We may retain your information for as long as necessary to:
            </p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Provide our services</li>
              <li>Follow up with you</li>
              <li>Maintain business records</li>
              <li>Comply with legal requirements</li>
              <li>Resolve disputes</li>
              <li>Process refunds or payments</li>
              <li>Improve our services and marketing systems</li>
            </ul>

            <p className="mt-4">
              When your information is no longer required, we may delete,
              archive, or anonymize it as per our internal process.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              14. Children&rsquo;s Privacy
            </h2>

            <p className="mt-4">
              Our services are intended for business owners, entrepreneurs,
              professionals, and adult users.
            </p>

            <p className="mt-4">
              We do not knowingly market to or collect personal information
              from children under 13 years of age. If we become aware that a
              minor has submitted information without proper consent, we may
              delete such information.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              15. Your Rights
            </h2>

            <p className="mt-4">You may contact us to:</p>

            <ul className="mt-4 list-disc space-y-1 list-inside">
              <li>Correct your personal information</li>
              <li>Update your contact details</li>
              <li>Request removal from marketing communication</li>
              <li>
                Request deletion of certain personal data, subject to legal
                and business requirements
              </li>
              <li>Ask how your information is being used</li>
            </ul>

            <p className="mt-4">To make such a request, email us at:</p>

            <p className="mt-2 text-[#3b82f6]">info@worldclassbusinesscoaching.in</p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              16. Email Communication and Unsubscribe
            </h2>

            <p className="mt-4">
              We may collect your email address to send business updates,
              video training access, strategy call reminders, service
              information, offers, and educational content.
            </p>

            <p className="mt-4">
              If at any time you would like to unsubscribe from future
              emails or communication, you may email us at:
            </p>

            <p className="mt-2 text-[#3b82f6]">info@worldclassbc.com</p>

            <p className="mt-4">
              We will make reasonable efforts to remove you from our
              marketing communication list.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              17. Data Breach Notification
            </h2>

            <p className="mt-4">
              In case of a data breach that affects your personally
              identifiable information, we will take reasonable steps to
              investigate the issue and notify affected users through email
              or other suitable communication channels within a reasonable
              period, wherever required by applicable law.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              18. Testimonials and Case Studies
            </h2>

            <p className="mt-4">
              If you voluntarily provide a testimonial, review, success
              story, photo, video, or feedback, we may use it for
              educational, promotional, marketing, or credibility-building
              purposes.
            </p>

            <p className="mt-4">
              We do not disclose sensitive confidential business data
              without consent.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              19. Changes to This Privacy Policy
            </h2>

            <p className="mt-4">
              We may update, modify, or change this Privacy Policy at any
              time.
            </p>

            <p className="mt-4">
              The updated version will be posted on our website, landing
              page, or privacy policy page. Your continued use of our
              website, Video Sales Letter, payment page, or services after
              changes are posted means you accept the updated Privacy
              Policy.
            </p>
          </section>
          </Reveal>

          <Reveal direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white">
              20. Contact Information
            </h2>

            <p className="mt-4">
              For any privacy-related questions, corrections, communication
              removal, or data requests, please contact us:
            </p>

            <p className="mt-4">RPIANS World Class Business Coaching LLP</p>
            <p>Founder: Rajesh Kumar Kare</p>
            <p>
              Website:{" "}
              <a href="https://www.worldclassbc.com" className="text-[#3b82f6]">
                www.worldclassbc.com
              </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:info@worldclassbc.com" className="text-[#3b82f6]">
                info@worldclassbc.com
              </a>
            </p>
            <p>Contact Number: 7049561975</p>
          </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
