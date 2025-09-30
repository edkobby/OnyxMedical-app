
export interface ServiceData {
  slug: string;
  title: string;
  mainImage: string;
  description: string[];
  features?: {
    title: string;
    description: string;
  }[];
  tests?: string[];
  applications?: string[];
}

const serviceDetails: ServiceData[] = [
  {
    slug: 'laparoscopy',
    title: 'Laparoscopy (Keyhole Surgery)',
    mainImage: 'https://images.unsplash.com/photo-1551884820-56247a818987?q=80&w=2070&auto=format&fit=crop',
    description: [
        "Laparoscopy, often called 'keyhole surgery,' is a minimally invasive surgical technique that allows our surgeons to perform complex procedures through very small incisions. By using a laparoscope—a thin tube with a high-definition camera—we get a clear view of the abdominal and pelvic organs without the need for large cuts.",
        "This advanced approach significantly reduces recovery time, minimizes post-operative pain, and results in less scarring compared to traditional open surgery. It is a cornerstone of modern gynecology and general surgery, offering a safer and more comfortable experience for patients."
    ],
    features: [
      {
        title: "Minimally Invasive",
        description: "Procedures are performed through small incisions, typically less than half an inch."
      },
      {
        title: "Faster Recovery Time",
        description: "Patients can often return to normal activities much sooner than with open surgery."
      },
      {
        title: "Reduced Scarring",
        description: "Smaller incisions lead to minimal and less noticeable scarring."
      },
      {
        title: "High-Definition Visualization",
        description: "Provides a magnified, high-resolution view of the surgical area for enhanced precision."
      }
    ],
    applications: [
      "Diagnostic Laparoscopy for infertility or pelvic pain",
      "Ovarian Cystectomy (removal of ovarian cysts)",
      "Myomectomy (removal of fibroids)",
      "Treatment of Endometriosis",
      "Hysterectomy (removal of the uterus)",
      "Tubal Ligation or Reversal",
      "Gallbladder Removal",
      "Appendectomy"
    ]
  },
   {
    slug: 'hysteroscopy',
    title: 'Hysteroscopy Services',
    mainImage: 'https://images.unsplash.com/photo-1581093452815-0dba6abe693a?q=80&w=2070&auto=format&fit=crop',
    description: [
        "Hysteroscopy is a modern, non-invasive procedure that allows our specialists to look directly inside the uterus. By inserting a thin, lighted instrument called a hysteroscope through the cervix, we can diagnose and treat a variety of uterine conditions without any external incisions.",
        "This technique is invaluable for investigating issues like abnormal bleeding, recurrent miscarriages, and infertility. In many cases, we can treat problems such as fibroids or polyps during the same diagnostic procedure, offering an efficient and patient-friendly solution."
    ],
    features: [
      {
        title: "No Incisions",
        description: "The procedure is performed through the natural opening of the cervix, leaving no scars."
      },
      {
        title: "See & Treat",
        description: "Allows for both diagnosis and treatment in a single session for many conditions."
      },
      {
        title: "High Accuracy",
        description: "Provides a direct and clear view of the uterine cavity for precise diagnosis."
      },
      {
        title: "Minimal Downtime",
        description: "Most patients can return to their normal activities within a day or two."
      }
    ],
    applications: [
      "Diagnosing abnormal uterine bleeding",
      "Removing uterine fibroids and polyps",
      "Locating and removing displaced IUDs",
      "Investigating causes of infertility and recurrent miscarriages",
      "Treating uterine adhesions (Asherman's syndrome)",
      "Performing endometrial ablation"
    ]
  },
  {
    slug: 'fertility-treatment',
    title: 'Fertility Treatment (IVF)',
    mainImage: '/images/features/fertility.png',
    description: [
        "At Onyx Medical & Fertility Center, we understand that the path to parenthood can be challenging. Our dedicated fertility team, led by renowned specialists, is here to provide you with compassionate care and advanced treatment options.",
        "We offer a comprehensive range of services from initial diagnosis to advanced reproductive technologies like In-Vitro Fertilization (IVF). Our personalized approach ensures that you receive a treatment plan tailored to your unique circumstances, supported by cutting-edge technology and a nurturing environment."
    ],
    features: [
      {
        title: "Personalized IVF Protocols",
        description: "Tailored treatment plans to maximize your chances of success."
      },
      {
        title: "Advanced Reproductive Tech",
        description: "Utilizing the latest in embryology and genetic screening."
      },
      {
        title: "Holistic & Supportive Care",
        description: "Emotional and psychological support throughout your journey."
      },
      {
        title: "Experienced Specialists",
        description: "A team of dedicated experts in fertility and reproductive medicine."
      }
    ]
  },
  {
    slug: 'general-surgery',
    title: 'General Surgery',
    mainImage: '/images/features/surgery.png',
    description: [
        "Our General Surgery department provides comprehensive surgical care for a wide range of conditions. Our team of board-certified surgeons is experienced in both traditional and minimally invasive surgical techniques, ensuring the best possible outcomes for our patients.",
        "We prioritize patient safety and comfort, utilizing modern surgical suites and adhering to the highest standards of care. From consultations to post-operative recovery, our team is dedicated to providing a seamless and supportive experience.",
        "We specialize in minimally invasive procedures that reduce recovery time and improve patient outcomes. Two key areas are Laparoscopy and Hysteroscopy. You can learn more about these on their dedicated service pages."
    ],
    features: [
      {
        title: "Minimally Invasive Procedures",
        description: "Laparoscopic and endoscopic surgeries for faster recovery and less scarring."
      },
      {
        title: "Experienced Surgical Team",
        description: "Board-certified surgeons with expertise in a wide array of procedures."
      },
      {
        title: "State-of-the-Art Theaters",
        description: "Modern, fully equipped operating rooms for optimal patient safety."
      },
      {
        title: "Comprehensive Post-Op Care",
        description: "Dedicated follow-up and rehabilitation to ensure a smooth recovery."
      }
    ]
  },
];

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return serviceDetails.find(service => service.slug === slug);
};

export const getOtherServices = (slug: string): ServiceData[] => {
    return serviceDetails.filter(service => service.slug !== slug);
}
