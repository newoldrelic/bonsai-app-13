export interface FAQ {
    question: string;
    answer: string;
  }
  
  export const SUPPORT_FAQS: FAQ[] = [
    {
      question: "How do I enable notifications?",
      answer: "Go to your tree's details page and look for the maintenance section. Toggle the notification switches for the types of reminders you want to receive."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your billing period."
    }
  ];