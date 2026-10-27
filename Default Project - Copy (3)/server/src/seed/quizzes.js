export const quizzes = [
  {
    slug: 'phishing-spotter',
    title: 'The Phishing Spotter',
    description:
      'Five realistic scenarios to test whether you can separate a genuine message from a carefully crafted impersonation.',
    category: 'Phishing',
    difficulty: 'Easy',
    emoji: '🎣',
    accent: '#22d3ee',
    estimatedMinutes: 4,
    xpPerCorrect: 20,
    questions: [
      {
        prompt:
          'You receive an SMS: "ALERT: Your bank account will be blocked in 24 hours. Verify now at http://secure-bank-verify.xyz". What is the strongest warning sign?',
        options: [
          'The message mentions a 24-hour deadline',
          'The link points to an unfamiliar, misspelled domain',
          'It asks you to verify your account',
          'The message is an SMS rather than an email',
        ],
        correctIndex: 1,
        explanation:
          'Urgency and verification requests are common in genuine and fake messages alike. The domain is decisive: secure-bank-verify.xyz is not your bank’s official website. Never follow the link; open your bank’s app or type its address yourself.',
      },
      {
        prompt:
          'An email from "support@paypa1.com" says your account is limited and asks you to log in. What makes it suspicious?',
        options: [
          'PayPal never sends email',
          'The domain uses the digit "1" to imitate paypal.com',
          'The email does not contain an attachment',
          'The email is shorter than usual',
        ],
        correctIndex: 1,
        explanation:
          'paypa1.com is a look-alike domain. Attackers register visually similar names to make the sender address look trustworthy at a glance. Check the domain character by character rather than trusting the display name.',
      },
      {
        prompt:
          'A link shows https://accounts.google.com.security-check.example.com/login. Which domain actually controls this page?',
        options: ['accounts.google.com', 'security-check.example.com', 'example.com', 'google.com'],
        correctIndex: 2,
        explanation:
          'Domains are read from right to left before the path. The registered domain here is example.com. The text "accounts.google.com" is only a subdomain created by whoever owns example.com.',
      },
      {
        prompt:
          'You receive an unexpected email with an attachment called "Invoice_Oct.zip" from a supplier you know. What should you do?',
        options: [
          'Open it — it is probably a routine invoice',
          'Forward it to a colleague to check',
          'Do not open it; verify with the supplier using a phone number you already have',
          'Reply asking for the password to the file',
        ],
        correctIndex: 2,
        explanation:
          'Unexpected archives can contain malware. Verify through an independent, known channel. Replying to the same email keeps you inside the attacker’s conversation.',
      },
      {
        prompt: 'Which combination most strongly signals a phishing attempt?',
        options: [
          'A page that uses HTTPS and a company logo',
          'An unsolicited message, an urgent deadline, and a link to a misspelled domain',
          'A login page that loads slowly',
          'An email sent outside business hours',
        ],
        correctIndex: 1,
        explanation:
          'Phishing relies on the combination of an unexpected message, manufactured urgency, and a look-alike destination. Individually, each clue can be innocent; together they are a strong warning.',
      },
    ],
  },
  {
    slug: 'payments-otp-safety',
    title: 'Payments & OTP Safety',
    description:
      'Test your instincts on OTP requests, UPI collect requests, refunds, and marketplace payments.',
    category: 'UPI & Banking',
    difficulty: 'Medium',
    emoji: '🔐',
    accent: '#f59e0b',
    estimatedMinutes: 5,
    xpPerCorrect: 20,
    questions: [
      {
        prompt:
          'A caller says they are from a courier company and asks for the OTP sent to your phone to confirm your address. What should you do?',
        options: [
          'Share it if they can read back your tracking number',
          'Share only the last two digits',
          'End the call and track the parcel through the courier’s official app or website',
          'Send a screenshot of the SMS so they can verify it',
        ],
        correctIndex: 2,
        explanation:
          'Legitimate couriers do not need your OTP to deliver a parcel. OTPs authorise account actions and payments. End the call and verify through the official app or a number you find independently.',
      },
      {
        prompt: 'Someone sends you a UPI collect request. If you approve it and enter your PIN, what happens?',
        options: [
          'Money is credited to your account',
          'Money is debited from your account',
          'Nothing happens until your bank calls you',
          'A refund is initiated automatically',
        ],
        correctIndex: 1,
        explanation:
          'A collect request is a request for you to pay. Entering your UPI PIN authorises an outgoing debit. You never need a PIN to receive money.',
      },
      {
        prompt:
          'A stranger says they accidentally transferred ₹5,000 to you and asks you to return it to a different UPI ID. What is the safest response?',
        options: [
          'Send it back immediately to be helpful',
          'Keep the money and block them',
          'Contact your bank and do not forward funds to a third party',
          'Share your UPI PIN so they can reverse it',
        ],
        correctIndex: 2,
        explanation:
          'The "wrong transfer" story is a common fraud. Any money you send to a third party is gone. Let your bank verify and reverse a genuine mistaken transfer.',
      },
      {
        prompt: 'What is the safest way to sell an item to a stranger from an online marketplace?',
        options: [
          'Accept a direct UPI transfer before meeting',
          'Use the platform’s escrow or cash-on-delivery with inspection',
          'Ship the item first and trust the buyer’s screenshots',
          'Accept gift cards as payment',
        ],
        correctIndex: 1,
        explanation:
          'Platform escrow or cash on delivery keeps the transaction verifiable. Payment screenshots are easy to fake, and direct transfers remove your protection.',
      },
      {
        prompt: 'Which statement about your UPI PIN is true?',
        options: [
          'It is required to receive money',
          'It is safe to share with your bank’s customer-care caller',
          'It is only needed to authorise payments you initiate, and should never be shared',
          'It is the same thing as an OTP',
        ],
        correctIndex: 2,
        explanation:
          'Your UPI PIN authorises debits from your account. No bank, helpline, or government official will ask you to share it. Receiving money never requires a PIN.',
      },
    ],
  },
  {
    slug: 'social-engineering-defence',
    title: 'Social Engineering Defence',
    description:
      'Spot the manipulation tactics behind fake emergencies, romance scams, job offers, and blackmail.',
    category: 'Social Engineering',
    difficulty: 'Medium',
    emoji: '🧠',
    accent: '#a78bfa',
    estimatedMinutes: 5,
    xpPerCorrect: 25,
    questions: [
      {
        prompt:
          'A message from your "CEO" asks you to make an urgent, confidential wire transfer and says not to discuss it with anyone. What should you do?',
        options: [
          'Make the transfer — the request came from the CEO',
          'Reply to the email asking for confirmation',
          'Verify the request through a separate known channel, such as calling the CEO or finance team',
          'Forward the email to a colleague and wait',
        ],
        correctIndex: 2,
        explanation:
          'Secrecy and urgency are classic social-engineering levers. Verify using a channel you initiate — a known phone number or an in-person conversation — not the one supplied in the request.',
      },
      {
        prompt:
          'An online partner you have never met says video calls are impossible and soon asks for a loan to cover a medical emergency. What is the most likely explanation?',
        options: [
          'They are shy but genuine',
          'It is a romance scam building towards financial exploitation',
          'Their camera is broken',
          'They need help navigating their bank',
        ],
        correctIndex: 1,
        explanation:
          'Avoiding live verification plus a sudden financial crisis is a classic romance-scam pattern. Genuine partners do not need you to send money to third parties.',
      },
      {
        prompt: 'A job offer requires you to pay a ₹4,500 "registration and training fee" before your first day. What does this indicate?',
        options: [
          'A normal onboarding cost',
          'A fake job offer — legitimate employers do not charge candidates',
          'A refundable security deposit you should pay',
          'A sign the salary will be high',
        ],
        correctIndex: 1,
        explanation:
          'Legitimate employers pay you; they do not ask you to pay to start work. Upfront fees, equipment purchases, and cheque-forwarding schemes are common job scams.',
      },
      {
        prompt:
          'Someone threatens to share an intimate image unless you pay. What is the safest response?',
        options: [
          'Pay quickly to make it stop',
          'Negotiate a smaller amount',
          'Do not pay; preserve evidence, stop responding, report and seek support',
          'Send another image to prove you are not afraid',
        ],
        correctIndex: 2,
        explanation:
          'Paying rarely ends sextortion and can mark you as a repeat target. Preserve messages, report to the platform and authorities, and tell someone you trust.',
      },
      {
        prompt: 'Which question best tests whether a suspicious request is legitimate?',
        options: [
          'Is the message polite and well written?',
          'Did the request arrive through a channel I can independently verify?',
          'Does the sender use a company logo?',
          'Was the message sent during business hours?',
        ],
        correctIndex: 1,
        explanation:
          'Politeness, logos, and timing are trivial to fake. Independent verification through a channel you control is the reliable test.',
      },
    ],
  },
  {
    slug: 'ai-deepfake-awareness',
    title: 'AI & Deepfake Awareness',
    description:
      'Can you outsmart voice clones, synthetic video, and AI-written phishing? Test your verification habits.',
    category: 'AI Threats',
    difficulty: 'Hard',
    emoji: '🎭',
    accent: '#fb7185',
    estimatedMinutes: 5,
    xpPerCorrect: 30,
    questions: [
      {
        prompt:
          'A video call from your manager’s familiar face asks you to send an urgent payment to a new supplier. What should you do first?',
        options: [
          'Send the payment because you recognise the face',
          'Verify the request through a separate, known channel before acting',
          'Ask them to email the bank details',
          'Record the call as evidence and then pay',
        ],
        correctIndex: 1,
        explanation:
          'Faces and voices can be synthesised. The reliable defence is independent verification: hang up and call your manager or finance team on a number you already know.',
      },
      {
        prompt: 'Where can a fraudster most easily obtain audio to clone someone’s voice?',
        options: [
          'A short public video on social media',
          'A password manager vault',
          'A hardware security key',
          'An encrypted messaging backup',
        ],
        correctIndex: 0,
        explanation:
          'A few seconds of clear speech from a public video, voice note, or podcast can be enough to train a convincing voice clone. Limit public voice clips and verify unusual requests.',
      },
      {
        prompt: 'Which is the most reliable way to expose a suspected deepfake caller?',
        options: [
          'Look for unnatural blinking',
          'Ask them to wave at the camera',
          'Hang up and call the person back on a number you know',
          'Check whether the video looks high resolution',
        ],
        correctIndex: 2,
        explanation:
          'Visual artefacts are increasingly unreliable. Calling back on a verified number tests the identity through a channel the attacker does not control.',
      },
      {
        prompt: 'Why are AI-generated phishing emails harder to identify than older scams?',
        options: [
          'They always include malware',
          'Fluent, error-free language is no longer a reliable warning sign',
          'They cannot be sent at scale',
          'They never impersonate real brands',
        ],
        correctIndex: 1,
        explanation:
          'AI tools produce polished, personalised messages without the grammar mistakes people were taught to spot. Focus on sender domains, links, unexpected requests, and verification.',
      },
      {
        prompt: 'What is the best protection against AI-enabled sextortion?',
        options: [
          'Pay the attacker quickly',
          'Never share intimate images, and preserve evidence and report threats',
          'Delete all social media accounts',
          'Send a fake image in return',
        ],
        correctIndex: 1,
        explanation:
          'The attacker’s leverage depends on images and fear. Do not create the material, do not pay, preserve evidence, and report through official channels.',
      },
    ],
  },
];
