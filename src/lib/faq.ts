
export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "What are your opening hours?",
    answer: "Our center is open from 8:00 AM to 8:00 PM, Monday to Saturday. We are closed on Sundays and public holidays. For emergencies, our ER is open 24/7."
  },
  {
    question: "Do I need an appointment to see a doctor?",
    answer: "We highly recommend booking an appointment to minimize waiting times. You can book one through our website or by calling us. However, we do accept walk-ins for general consultations, but appointments will be prioritized."
  },
  {
    question: "What should I bring for my first appointment?",
    answer: "For your first visit, please bring a valid ID, any insurance information you may have, your medical history or any relevant records from previous doctors, and a list of any medications you are currently taking."
  },
  {
    question: "What insurance plans do you accept?",
    answer: "We accept a wide range of national and private insurance plans. Please visit our pricing page or contact our front desk to confirm if your specific plan is covered."
  },
  {
    question: "How do I access my medical records?",
    answer: "You can request a copy of your medical records by filling out a form at our reception. Please allow up to 48 hours for the request to be processed. For privacy, a valid ID is required for pickup."
  },
  {
    question: "What services does the fertility center offer?",
    answer: "Our fertility center offers a comprehensive range of services including fertility testing for both men and women, IVF, IUI, ICSI, and fertility preservation. We recommend a consultation with our specialist to discuss a personalized plan."
  },
  {
    question: "How does the telemedicine service work?",
    answer: "Our telemedicine service is for registered patients. You can book a virtual consultation through the telemedicine page on our website. You'll select a doctor, time, and platform (WhatsApp or Google Meet). Our team will then contact you to confirm and arrange payment."
  }
];
