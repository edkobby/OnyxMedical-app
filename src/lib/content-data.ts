
import { Stethoscope, Activity, Baby, Microscope, HeartPulse, Shield, Beaker, Users, Scissors, Scan, Syringe, Drama, LucideIcon } from 'lucide-react';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const homeContent = {
    hero: {
        headline: "Your Health is Our Priority",
        subtext: "Providing compassionate, comprehensive, and high-quality medical care for every stage of life."
    }
}

export const aboutContent = {
    beginning: "Onyx Medical & Fertility Center began its journey in January 2023, born from a vision to create a sanctuary of hope and healing. Under the steadfast leadership of our founder, Rev. Dr. Anthony Quampah, we started with a simple yet powerful mission: to provide world-class medical care with a compassionate, patient-first approach.",
    commitment: "From day one, our focus has been on setting new standards in healthcare. We believe that every patient deserves access to the most advanced treatments in a supportive and understanding environment. Our growth is a testament to the trust our community has placed in us, and we are deeply committed to honoring that trust every single day.",
    mission: "To provide exceptional, patient-centered healthcare with a focus on compassion, innovation, and clinical excellence.",
    vision: "To be the leading and most trusted medical and fertility center, setting standards that others strive to live up to."
}


export const servicesList: Service[] = [
  { icon: Stethoscope, title: "General OPD Consultation", description: "Comprehensive general health check-ups and consultations." },
  { icon: Activity, title: "Gynecology / Women's Health", description: "Specialized care for all aspects of women's reproductive health." },
  { icon: Baby, title: "Obstetrics / Antenatal", description: "Dedicated care for expectant mothers through every stage of pregnancy." },
  { icon: Shield, title: "Fertility Treatment (IVF)", description: "Advanced IVF and fertility services to help achieve your family dreams." },
  { icon: HeartPulse, title: "Internal Medicine", description: "Diagnosis and treatment of complex adult illnesses." },
  { icon: Users, title: "Child Health / Pediatrician", description: "Compassionate healthcare for infants, children, and adolescents." },
  { icon: Scissors, title: "General Surgery", description: "Expert surgical procedures performed by our experienced team." },
  { icon: Syringe, title: "Dietitian / Nutritionist", description: "Personalized dietary plans and nutritional guidance for better health." },
  { icon: HeartPulse, title: "ECG (Electrocardiogram)", description: "Advanced heart monitoring and diagnostics." },
  { icon: Microscope, title: "Laboratory", description: "Accurate and timely diagnostic testing with modern equipment." },
  { icon: Drama, title: "Theater Services", description: "State-of-the-art facilities for a wide range of surgical procedures." },
  { icon: Scan, title: "Ultrasound Scan", description: "Detailed imaging services for diagnosis and monitoring." },
]

    