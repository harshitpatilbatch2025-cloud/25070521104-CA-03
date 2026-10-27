export const scamTypes = [
  {
    id: 'phishing',
    title: 'Phishing & Smishing',
    emoji: '🎣',
    accent: '#22d3ee',
    tagline: 'Fake messages that borrow a brand you trust',
    description:
      'Emails, SMS, and social messages impersonate banks, delivery companies, or governments to steal passwords and card details.',
    redFlags: [
      'Urgent threat: account blocked, parcel returned, or payment failed',
      'A link to a misspelled or unfamiliar domain',
      'Requests for passwords, OTPs, PINs, or card details',
      'Generic greetings, odd formatting, and unexpected attachments',
    ],
    protection: [
      'Type the official address yourself instead of clicking',
      'Check the domain character by character',
      'Never enter credentials from a message link',
      'Verify through an official phone number or app',
    ],
    articleSlug: 'phishing-101-spot-fake-login-pages',
  },
  {
    id: 'otp-banking',
    title: 'OTP & Banking Fraud',
    emoji: '🔐',
    accent: '#f59e0b',
    tagline: 'The six-digit code that unlocks your money',
    description:
      'Fraudsters pose as bank staff, police, or couriers to extract the one-time password that authorises a transaction or login.',
    redFlags: [
      'Anyone asking for an OTP, PIN, CVV, or password',
      'Caller claims to be bank, police, or government',
      'Requests to install remote-access software',
      'Pressure to stay on the call while you use your banking app',
    ],
    protection: [
      'Never share a code with anyone — ever',
      'Hang up and call the bank on its official number',
      'Never install screen-sharing apps for "support"',
      'Act fast if a code was shared: call the bank and report',
    ],
    articleSlug: 'otp-fraud-never-share-your-code',
  },
  {
    id: 'upi-payments',
    title: 'UPI & Payment Fraud',
    emoji: '💸',
    accent: '#a78bfa',
    tagline: 'Requests that move money out, not in',
    description:
      'Collect requests, fake refunds, QR codes, and "wrong transfer" stories trick people into approving an outgoing payment.',
    redFlags: [
      'A request to enter your PIN to receive money',
      'Payment screenshots offered as proof',
      'Requests to send money to a different account',
      'QR codes from strangers or customer-care numbers found online',
    ],
    protection: [
      'Read the direction of every UPI request before approving',
      'Remember: receiving money never needs a PIN',
      'Use escrow or cash-on-delivery for marketplace sales',
      'Verify balances in your own banking app',
    ],
    articleSlug: 'upi-scams-the-request-money-trap',
  },
  {
    id: 'investment',
    title: 'Investment & Crypto Scams',
    emoji: '📈',
    accent: '#34d399',
    tagline: 'Guaranteed returns are the giveaway',
    description:
      'Fake trading apps and "account managers" show fictional profits while collecting real deposits and withdrawal fees.',
    redFlags: [
      'Guaranteed high returns with no risk',
      'Small withdrawal allowed to build trust',
      'Payment only by crypto, UPI, or personal transfer',
      'Pressure to recruit friends or pay a "tax" to withdraw',
    ],
    protection: [
      'Verify the provider with a financial regulator',
      'Never invest because of an unsolicited message',
      'Refuse any request to pay fees to release profits',
      'Check the app publisher and domain carefully',
    ],
    articleSlug: 'investment-scams-fake-trading-apps',
  },
  {
    id: 'romance',
    title: 'Romance & Social Engineering',
    emoji: '💔',
    accent: '#f472b6',
    tagline: 'Manufactured trust, followed by a request',
    description:
      'Long, patient relationships are built online and then converted into emergencies, loans, or money-forwarding requests.',
    redFlags: [
      'Love declared very quickly',
      'Repeated excuses to avoid live video',
      'A sudden crisis that requires your money',
      'Requests for gift cards, crypto, or a third-party transfer',
    ],
    protection: [
      'Insist on live video and independent verification',
      'Never send money to someone you have not met',
      'Talk to a trusted friend before acting',
      'Report the profile and preserve evidence',
    ],
    articleSlug: 'romance-scams-when-a-connection-asks-for-money',
  },
  {
    id: 'job',
    title: 'Job & Employment Scams',
    emoji: '💼',
    accent: '#60a5fa',
    tagline: 'A real job pays you, not the other way around',
    description:
      'Fake recruiters offer easy high-paying work, then demand fees, identity documents, or use you to move stolen money.',
    redFlags: [
      'Hired without a real interview',
      'Free email address instead of a company domain',
      'Fees for training, equipment, or registration',
      'Requests to receive and forward payments or parcels',
    ],
    protection: [
      'Verify the recruiter through the company’s official site',
      'Never pay to get a job',
      'Do not share bank credentials or identity scans early',
      'Report fake postings to the platform',
    ],
    articleSlug: 'job-offer-scams-red-flags',
  },
  {
    id: 'ai-deepfake',
    title: 'AI & Deepfake Fraud',
    emoji: '🎭',
    accent: '#fb7185',
    tagline: 'A familiar face can now be synthetic',
    description:
      'Voice clones and deepfake video impersonate family members, executives, and officials to authorise urgent payments.',
    redFlags: [
      'Urgent money request from a familiar voice or face',
      'A new phone number or social account',
      'Refusal to answer a question only the real person would know',
      'Pressure to keep the request secret or act immediately',
    ],
    protection: [
      'Hang up and call back on a known number',
      'Confirm business payments through a second channel',
      'Set a family safe word before an emergency',
      'Limit public voice and video clips',
    ],
    articleSlug: 'deepfakes-and-ai-voice-clones',
  },
  {
    id: 'shopping',
    title: 'Shopping & Marketplace Scams',
    emoji: '🛍️',
    accent: '#fbbf24',
    tagline: 'Polished storefronts, disposable identities',
    description:
      'Fake stores and sellers advertise impossible deals, take payment by direct transfer, then disappear or ship counterfeits.',
    redFlags: [
      'Prices far below every other seller',
      'Newly registered domain with no real address',
      'Reviews posted in a burst or copied across sites',
      'No card or buyer-protection payment option',
    ],
    protection: [
      'Research the store independently before paying',
      'Use payment methods with chargeback protection',
      'Avoid direct transfers to strangers',
      'Save receipts and report fraudulent stores',
    ],
    articleSlug: 'fake-online-stores-shopping-scams',
  },
];

export const safetyTips = [
  {
    emoji: '⏸️',
    title: 'Pause before you act',
    text: 'Urgency is a tool. Slow down, close the message, and verify through a channel you choose — not the one the sender supplied.',
  },
  {
    emoji: '🔍',
    title: 'Verify the channel',
    text: 'Call back on a number from an official website, open the banking app yourself, or ask a question only the real person could answer.',
  },
  {
    emoji: '🔐',
    title: 'Protect your codes',
    text: 'No bank, company, or government agency needs your OTP, PIN, password, or a screen-share session. Treat every request as fraud.',
  },
  {
    emoji: '🧭',
    title: 'Know how to report',
    text: 'Save the cybercrime helpline 1930 and cybercrime.gov.in before you need them. Fast reporting improves recovery chances.',
  },
];
