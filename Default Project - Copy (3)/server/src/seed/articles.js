export const articles = [
  {
    slug: 'phishing-101-spot-fake-login-pages',
    title: 'Phishing 101: How to Spot a Fake Login Page',
    excerpt:
      'Phishing pages look almost identical to the real thing. Learn the URL checks and behavioural clues that expose them in seconds.',
    category: 'Phishing',
    level: 'Beginner',
    readTimeMinutes: 6,
    emoji: '🎣',
    accent: '#22d3ee',
    featured: true,
    publishedAt: new Date('2026-10-22T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'You click a link, a familiar login page appears, and nothing seems wrong. That is exactly the design goal of a phishing page: to borrow the trust of a brand you already use so you type your password without thinking.',
      },
      { type: 'h2', text: 'How the trap is built' },
      {
        type: 'p',
        text: 'Attackers copy a real login screen, host it on a look-alike domain, and deliver the link through email, SMS, social media, or a sponsored search result. The page captures whatever you type and forwards it to the attacker. Some pages even relay your one-time code to the real service in real time.',
      },
      { type: 'h2', text: 'Check the domain, not the logo' },
      {
        type: 'p',
        text: 'Logos, colours, and fonts are easy to copy. The domain is the one part an attacker cannot fake without registering something different. Read it from right to left: in accounts.google.com.security-check.example.com, the real domain is example.com — everything before it is a subdomain the attacker controls.',
      },
      {
        type: 'ul',
        items: [
          'Look for misspellings and extra hyphens: paypa1.com, microsoft-support-login.net.',
          'Be wary of long random strings or unusual country endings added to a familiar name.',
          'Type the official address yourself instead of following a link.',
          'A padlock only means traffic is encrypted — it does not prove the site is genuine.',
        ],
      },
      { type: 'h2', text: 'Behavioural clues' },
      {
        type: 'ul',
        items: [
          'Urgency: "Your account will be locked in 24 hours."',
          'A request for your password, PIN, or OTP by email, SMS, or phone.',
          'A login prompt that appears after you clicked an unsolicited link.',
          'A page that asks for more information than the real service ever would.',
          'Spelling mistakes and generic greetings such as "Dear Customer".',
        ],
      },
      {
        type: 'quote',
        text: 'If you did not initiate the login, do not enter your credentials — close the page.',
      },
      { type: 'h2', text: 'If you already clicked' },
      {
        type: 'p',
        text: 'Change the password from the official website or app immediately, revoke active sessions, enable two-factor authentication, and tell your bank if financial details were entered. Report the link to the impersonated brand and to your national cybercrime portal.',
      },
    ],
    tips: [
      'Navigate to banking and email sites by typing the address, not by clicking message links.',
      'Use a password manager: it will not autofill credentials on a look-alike domain.',
      'Turn on two-factor authentication with an authenticator app or passkey.',
      'When in doubt, contact the organisation using a number from its official website.',
    ],
  },
  {
    slug: 'otp-fraud-never-share-your-code',
    title: 'OTP Fraud: Why You Should Never Share That Six-Digit Code',
    excerpt:
      'Your one-time password is the last lock on your account. Here is how fraudsters talk people into handing it over — and how to shut them down.',
    category: 'OTP & Banking',
    level: 'Beginner',
    readTimeMinutes: 5,
    emoji: '🔐',
    accent: '#f59e0b',
    featured: true,
    publishedAt: new Date('2026-10-19T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'An OTP is not a password you can share "just this once". It authorises a specific action — a login, a password reset, or a payment. The moment someone else has it, they can complete that action as if they were you.',
      },
      { type: 'h2', text: 'The three most common scripts' },
      {
        type: 'ul',
        items: [
          'The fake official: "This is your bank. We detected suspicious activity and need the code we just sent to cancel the transaction."',
          'The delivery worker: "Your parcel is held at customs. Read me the OTP to reschedule delivery."',
          'The buyer or seller: "I sent you money by mistake. Approve the request and give me the code so I can reverse it."',
        ],
      },
      { type: 'h2', text: 'Screen sharing makes it worse' },
      {
        type: 'p',
        text: 'A caller may ask you to install a "support" app such as AnyDesk, TeamViewer, or a fake banking helper. Once screen sharing starts, they can watch your notifications, read OTPs, and guide you through transfers. No genuine bank, police officer, or government agency will ask you to install remote-access software.',
      },
      {
        type: 'quote',
        text: 'A genuine bank will never ask for your OTP, PIN, password, or CVV — not by phone, email, SMS, or chat.',
      },
      { type: 'h2', text: 'If you have already shared a code' },
      {
        type: 'ul',
        items: [
          'Call your bank immediately using the number printed on your card or its official app.',
          'Ask them to freeze the card, block online banking, and reverse any pending transfer.',
          'Change your banking password and any password reused elsewhere.',
          'Report the incident at cybercrime.gov.in or call 1930 in India, and keep screenshots as evidence.',
        ],
      },
      {
        type: 'p',
        text: 'Speed matters more than embarrassment. Banks and cybercrime teams deal with these calls every day, and early reporting gives you the best chance of recovering funds.',
      },
    ],
    tips: [
      'Read every OTP prompt carefully: it names the action you are authorising.',
      'Never read a code aloud while on a call, even to a number that looks official.',
      'Hang up and call back on a number you find yourself.',
      'Never install remote-access software at a stranger’s request.',
    ],
  },
  {
    slug: 'upi-scams-the-request-money-trap',
    title: 'UPI Scams: The "Request Money" Trap Explained',
    excerpt:
      'A collect request is not a payment coming in. Understand the difference between sending and receiving before you approve the next UPI prompt.',
    category: 'UPI & Payments',
    level: 'Beginner',
    readTimeMinutes: 5,
    emoji: '💸',
    accent: '#a78bfa',
    featured: true,
    publishedAt: new Date('2026-10-16T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'UPI has made payments almost frictionless — which is exactly why fraudsters target it. Many scams rely on one misunderstanding: confusing a money request with a money transfer.',
      },
      { type: 'h2', text: 'How a collect request works' },
      {
        type: 'p',
        text: 'A collect request asks you to approve a transfer from your account to the requester. It is not a notification that money has arrived. When you enter your UPI PIN, you are authorising an outgoing payment. There is no such thing as entering your PIN to receive money.',
      },
      {
        type: 'quote',
        text: 'You never need a PIN or OTP to receive money. If someone asks for one, it is a scam.',
      },
      { type: 'h2', text: 'The "wrong transfer" trick' },
      {
        type: 'p',
        text: 'A stranger messages you claiming they accidentally sent money and asks you to return it to a different number. Sometimes the original "transfer" was a fake screenshot, and any money you send is gone. Do not forward funds to a third party. Contact your bank and let it handle a genuine reversal.',
      },
      { type: 'h2', text: 'Marketplace and QR-code scams' },
      {
        type: 'ul',
        items: [
          'A buyer "paying" you may send a collect request instead — check which direction the money is moving.',
          'Scanning a QR code always sends money from your account; it never receives money for you.',
          'Fake customer-care numbers in search results may guide you into approving a transfer.',
          'Screenshots are not proof of payment. Confirm the balance in your own bank app.',
        ],
      },
      { type: 'h2', text: 'Safer payment habits' },
      {
        type: 'ul',
        items: [
          'Pause before approving any UPI prompt and read the payee name and amount.',
          'Set a low daily UPI limit for casual transactions.',
          'Use platform escrow or cash-on-delivery for second-hand sales.',
          'Report a fraudulent UPI ID in your payment app and to your bank immediately.',
        ],
      },
    ],
    tips: [
      'Approve only requests you created or genuinely expected.',
      'Never share your UPI PIN, and never enter it to "verify" a refund.',
      'Match the payee name in the prompt with the person you are dealing with.',
      'Report fraud quickly on the 1930 helpline or cybercrime.gov.in.',
    ],
  },
  {
    slug: 'romance-scams-when-a-connection-asks-for-money',
    title: 'Romance Scams: When an Online Connection Asks for Money',
    excerpt:
      'Romance fraud is a long con built on trust. Recognise the patterns early so affection never becomes a payment instruction.',
    category: 'Social Engineering',
    level: 'Intermediate',
    readTimeMinutes: 7,
    emoji: '💔',
    accent: '#f472b6',
    featured: false,
    publishedAt: new Date('2026-10-13T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'Romance scams are not about a single convincing lie. They are patient, scripted relationships built over weeks or months. The goal is emotional dependence strong enough that a request for money feels like helping someone you love.',
      },
      { type: 'h2', text: 'The long game' },
      {
        type: 'ul',
        items: [
          'Contact starts on a dating app or social network, then moves quickly to a private messaging app.',
          'The person is unusually attentive, available, and eager to commit — often within days.',
          'Video calls are avoided or brief, with technical excuses, and may use recorded or AI-generated material.',
          'A crisis appears: a medical bill, a blocked account, a business deal, or a customs fee. Your help is urgently needed.',
          'The first small payment is followed by larger requests, then pressure and guilt if you hesitate.',
        ],
      },
      { type: 'h2', text: 'The money request always comes' },
      {
        type: 'p',
        text: 'In a genuine relationship, a partner you have never met should not need you to wire money to a third party, pay in gift cards, or receive and forward funds. Those methods are chosen because they are difficult to trace and reverse.',
      },
      {
        type: 'quote',
        text: 'Love does not require secrecy, urgency, or a payment to someone you have never met.',
      },
      { type: 'h2', text: 'Protecting yourself' },
      {
        type: 'ul',
        items: [
          'Reverse-image-search profile photos and check whether the same images appear under other names.',
          'Insist on live video conversations early — and be aware that deepfakes are improving.',
          'Never send money, gift cards, crypto, or account access to someone you have not met in person.',
          'Talk to a friend or family member before acting on any financial request.',
          'Keep evidence and report the profile to the platform, your bank, and the cybercrime portal.',
        ],
      },
    ],
    tips: [
      'A request for money at any stage is a serious red flag.',
      'Be wary of anyone who attempts to isolate you from friends and family.',
      'Never accept a "loan" or forward money for someone you met online.',
      'Report the profile and preserve messages before blocking.',
    ],
  },
  {
    slug: 'investment-scams-fake-trading-apps',
    title: 'Investment Scams: Spotting Fake Trading Apps and Guaranteed Returns',
    excerpt:
      'Fake investment platforms show rising balances while your deposits disappear. Learn how the illusion works and how to verify a provider.',
    category: 'Investment',
    level: 'Intermediate',
    readTimeMinutes: 6,
    emoji: '📈',
    accent: '#34d399',
    featured: false,
    publishedAt: new Date('2026-10-10T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'Investment fraud often looks sophisticated: a polished app, real market data, friendly account managers, and a dashboard that always shows a profit. The number on the screen is entertainment — the only real transaction is the money you send out.',
      },
      { type: 'h2', text: 'How fake platforms work' },
      {
        type: 'ul',
        items: [
          'You are invited through a social media ad, a messaging group, or someone posing as a successful investor.',
          'A small initial withdrawal succeeds, building confidence in the platform.',
          'Your balance grows quickly with "guaranteed" or unusually consistent returns.',
          'When you try to withdraw a larger amount, you must first pay taxes, fees, or a "verification deposit".',
          'The account manager becomes unreachable, the app stops working, and the money is gone.',
        ],
      },
      { type: 'h2', text: 'Guaranteed returns are the tell' },
      {
        type: 'p',
        text: 'Legitimate investments carry risk and say so. Nobody can guarantee a fixed high monthly return, especially on a platform that only accepts crypto or transfers to a personal account. Pressure to recruit friends or family is another hallmark of a scheme.',
      },
      {
        type: 'quote',
        text: 'If you cannot verify the provider with an independent regulator, do not transfer money.',
      },
      { type: 'h2', text: 'Verify before you invest' },
      {
        type: 'ul',
        items: [
          'Check the company and its registration on your national financial regulator’s website.',
          'Confirm the app publisher and domain; cloned apps often use slight misspellings.',
          'Search for the company name alongside the word "scam" and check independent reviews.',
          'Be suspicious of anyone who contacts you first with an investment opportunity.',
          'Never pay "tax" or "release fees" to withdraw your own money — this is part of the fraud.',
        ],
      },
    ],
    tips: [
      'No legitimate platform guarantees profits.',
      'Verify regulatory registration independently, not through links in the message.',
      'Small successful withdrawals are often bait.',
      'Report suspected fraud to your bank and the cybercrime portal as soon as possible.',
    ],
  },
  {
    slug: 'job-offer-scams-red-flags',
    title: 'Job Offer Scams: Red Flags in Recruitment Messages',
    excerpt:
      'Fake recruiters exploit hope and urgency. Protect your money and identity by knowing what a real hiring process looks like.',
    category: 'Job & Career',
    level: 'Beginner',
    readTimeMinutes: 5,
    emoji: '💼',
    accent: '#60a5fa',
    featured: true,
    publishedAt: new Date('2026-10-07T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'Job scams range from fake work-from-home offers to elaborate schemes that trick you into laundering money. They often arrive when you are most eager for an opportunity, which makes their urgency and flattery more effective.',
      },
      { type: 'h2', text: 'Red flags in the offer' },
      {
        type: 'ul',
        items: [
          'You are hired without a proper interview, or after only a chat message.',
          'The recruiter uses a free email address instead of a company domain.',
          'You must pay for training, equipment, background checks, or a "registration fee".',
          'The salary is unusually high for simple tasks, with vague responsibilities.',
          'Communication moves to a personal messaging app and the recruiter avoids video calls.',
        ],
      },
      { type: 'h2', text: 'Never pay for a job' },
      {
        type: 'p',
        text: 'Legitimate employers do not ask candidates to pay to start work, and they do not send you a cheque to buy equipment from a specific supplier. That "equipment purchase" pattern often leaves you owing money after a fake cheque reverses.',
      },
      {
        type: 'quote',
        text: 'A real job pays you. If money flows from you to the employer, stop.',
      },
      { type: 'h2', text: 'Protect your identity' },
      {
        type: 'ul',
        items: [
          'Do not share bank credentials, OTPs, Aadhaar or Social Security numbers, or scanned ID documents before a verified offer.',
          'Check the company’s official careers page and call its published number to confirm the recruiter.',
          'Never accept or forward payments or parcels on an employer’s behalf — this can make you part of a money-laundering chain.',
          'Report fake postings to the job platform and the cybercrime portal.',
        ],
      },
    ],
    tips: [
      'Research the recruiter and the company domain before replying.',
      'A job offer that requires an upfront payment is a scam.',
      'Do not deposit a cheque and send part of it back to anyone.',
      'Trust your unease: pressure and secrecy are designed to stop you checking.',
    ],
  },
  {
    slug: 'deepfakes-and-ai-voice-clones',
    title: 'Deepfakes and AI Voice Clones: Verifying What You See and Hear',
    excerpt:
      'AI can now imitate a familiar face or voice convincingly. Your defence is not better eyesight — it is a verification habit.',
    category: 'AI Threats',
    level: 'Advanced',
    readTimeMinutes: 7,
    emoji: '🎭',
    accent: '#fb7185',
    featured: true,
    publishedAt: new Date('2026-10-04T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'A short voice clip from a social media video is enough to build a synthetic version of someone’s voice. A single photo can be animated into a moving face. Fraudsters use both to turn a familiar person into a weapon of trust.',
      },
      { type: 'h2', text: 'Seeing is no longer believing' },
      {
        type: 'p',
        text: 'Early deepfakes had obvious artefacts — strange blinking, mismatched lips, unnatural hands. Modern tools make those clues unreliable, especially in compressed video on a small phone screen. Do not rely on spotting visual glitches; rely on an independent verification step.',
      },
      { type: 'h2', text: 'The emergency and the CEO scam' },
      {
        type: 'ul',
        items: [
          'A "family member" calls from a new number in distress and asks for an urgent payment.',
          'A video message from a company executive authorises a confidential wire transfer.',
          'A "police officer" or government official appears on video and demands payment to avoid arrest.',
          'A romantic partner sends voice notes but avoids unscripted live conversation.',
        ],
      },
      {
        type: 'quote',
        text: 'Urgency plus impersonation plus a payment request is a fraud pattern, no matter how real the face looks.',
      },
      { type: 'h2', text: 'Verification habits that work' },
      {
        type: 'ul',
        items: [
          'Hang up and call the person back on a number you already know.',
          'Ask a question only the real person could answer, ideally something not visible on social media.',
          'For business payments, confirm through a second channel and a known contact, never using details supplied in the request.',
          'Agree on a family "safe word" or verification question before an emergency happens.',
          'Limit public voice and video clips that can be used as training material.',
        ],
      },
    ],
    tips: [
      'Verify through a separate, known channel — not by replying to the message.',
      'Treat urgent money requests from familiar faces as suspicious by default.',
      'A live video call is not automatic proof; it can be synthetic.',
      'Never share intimate images or videos, which can be used for sextortion.',
    ],
  },
  {
    slug: 'fake-online-stores-shopping-scams',
    title: 'Shopping Scams: Fake Stores and Too-Good-To-Be-True Deals',
    excerpt:
      'A polished storefront and five-star reviews cost almost nothing to fake. Here is how to shop online without losing your money or card details.',
    category: 'Shopping',
    level: 'Beginner',
    readTimeMinutes: 5,
    emoji: '🛍️',
    accent: '#fbbf24',
    featured: false,
    publishedAt: new Date('2026-10-01T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'Fake online stores are built to look legitimate for a few weeks, take as many orders as possible, then disappear. Some never ship anything; others ship a cheap counterfeit so the transaction looks completed.',
      },
      { type: 'h2', text: 'Fake store patterns' },
      {
        type: 'ul',
        items: [
          'Prices far below every other retailer, especially on popular electronics.',
          'A newly registered domain with no real address, policies, or contact number.',
          'Reviews that are all five stars, posted in a burst, and copied across several sites.',
          'Payment accepted only by bank transfer, UPI, or crypto — no card or escrow option.',
          'Countdown timers and "only 2 left" warnings that pressure you to decide immediately.',
        ],
      },
      { type: 'h2', text: 'Before you pay' },
      {
        type: 'ul',
        items: [
          'Search the store name with the words "scam" and "review" outside the site itself.',
          'Check the domain’s registration date using a WHOIS lookup.',
          'Read the returns and privacy policies; legitimate stores do not hide them.',
          'Use a credit card or a platform with buyer protection when possible.',
          'Never send card details or OTPs over chat to a seller.',
        ],
      },
      {
        type: 'quote',
        text: 'A deal that requires bypassing normal buyer protection is not a deal — it is a transfer of risk to you.',
      },
      {
        type: 'p',
        text: 'If an order never arrives, contact your card issuer about a chargeback quickly. Save screenshots of the listing, payment receipt, and all messages.',
      },
    ],
    tips: [
      'Buy from stores you can verify independently.',
      'Prefer payment methods with chargeback or escrow protection.',
      'A social media page with no website history is not a shop you can trust.',
      'Save order confirmations and report fraudulent stores to the platform.',
    ],
  },
  {
    slug: 'sextortion-and-blackmail-what-to-do',
    title: 'Sextortion and Blackmail: What to Do If You Are Targeted',
    excerpt:
      'Threats to share intimate images are designed to make you pay in panic. There are safer steps than complying.',
    category: 'Social Engineering',
    level: 'Intermediate',
    readTimeMinutes: 6,
    emoji: '🚨',
    accent: '#f87171',
    featured: false,
    publishedAt: new Date('2026-09-28T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'Sextortion is a form of blackmail in which someone threatens to share intimate images or information unless you pay or comply. The threat is frightening by design. Paying rarely ends it and often marks you as someone who will pay again.',
      },
      { type: 'h2', text: 'It is a bluff more often than you think' },
      {
        type: 'p',
        text: 'Many sextortion emails are generic and claim to have compromising footage that does not exist. Others involve a recorded video call. In both cases, the attacker’s leverage depends on your fear and silence. They often send the same script to thousands of people.',
      },
      { type: 'h2', text: 'Do this now' },
      {
        type: 'ul',
        items: [
          'Do not pay, and do not send more images or information.',
          'Stop responding, but do not delete the messages — they are evidence.',
          'Screenshot the profile, messages, payment demands, and account details.',
          'Report and block the account on the platform where contact started.',
          'Tell someone you trust. Isolation makes the threat harder to bear.',
          'Report to the cybercrime portal and, if you are a minor, contact local authorities and a trusted adult immediately.',
        ],
      },
      {
        type: 'quote',
        text: 'You are the victim, not the one at fault. Paying is not a reliable way to make the threat stop.',
      },
      { type: 'h2', text: 'Support and reporting' },
      {
        type: 'p',
        text: 'In India, report at cybercrime.gov.in or call 1930. Many countries have dedicated reporting portals and victim-support services. A trusted friend, school counsellor, or mental-health professional can help you navigate the next steps. Do not let shame keep you silent.',
      },
      {
        type: 'p',
        text: 'Prevention matters too: never share intimate images with someone you have not met in person, and disable automatic saving of media in messaging apps where possible.',
      },
    ],
    tips: [
      'Never pay or negotiate with a blackmailer.',
      'Preserve evidence before blocking the account.',
      'Report to platform moderators and law enforcement.',
      'Ask for support — you do not have to handle it alone.',
    ],
  },
  {
    slug: 'password-and-account-security',
    title: 'Password and Account Security: Building a Strong Digital Defence',
    excerpt:
      'Strong, unique passwords and a second factor stop most account takeovers. Here is a practical routine that takes minutes to set up.',
    category: 'Account Safety',
    level: 'Beginner',
    readTimeMinutes: 6,
    emoji: '🔑',
    accent: '#2dd4bf',
    featured: false,
    publishedAt: new Date('2026-09-25T09:00:00.000Z'),
    body: [
      {
        type: 'p',
        text: 'When one password protects many accounts, a single data breach can unlock your email, banking, and social media in sequence. Attackers also replay stolen email and password pairs against hundreds of other services.',
      },
      { type: 'h2', text: 'Length beats complexity' },
      {
        type: 'p',
        text: 'A long passphrase of four or five unrelated words is easier to remember and harder to crack than a short string of substitutions. Use at least 12–16 characters for important accounts. Never reuse a password across sites.',
      },
      { type: 'h2', text: 'Use a password manager' },
      {
        type: 'p',
        text: 'A password manager generates and stores a unique password for every account. Many phones and browsers include one for free. The only password you need to remember is the manager’s master password — make it long, unique, and protected by two-factor authentication.',
      },
      { type: 'h2', text: 'Turn on two-factor authentication' },
      {
        type: 'ul',
        items: [
          'Prefer an authenticator app, hardware key, or passkey over SMS codes where possible.',
          'Keep backup codes somewhere offline and secure.',
          'Enable 2FA on email first — it is the recovery key for almost everything else.',
          'Be wary of push-notification prompts you did not trigger; do not approve them.',
          'Never share a one-time code with anyone, even someone claiming to be support.',
        ],
      },
      { type: 'h2', text: 'Responding to a breach' },
      {
        type: 'ul',
        items: [
          'Check haveibeenpwned.com to see which breaches include your address.',
          'Change the breached password everywhere it was reused, starting with email and banking.',
          'Sign out of all sessions and review connected apps and devices.',
          'Contact your bank if payment or identity details were exposed.',
        ],
      },
      {
        type: 'quote',
        text: 'Unique passwords and two-factor authentication turn a stolen password from a disaster into a minor inconvenience.',
      },
    ],
    tips: [
      'Use a unique passphrase for every important account.',
      'Let a password manager generate and remember long passwords.',
      'Secure your email account with strong 2FA first.',
      'Review active sessions after any suspected compromise.',
    ],
  },
];
