
export interface Doctor {
  slug: string;
  name: string;
  title: string;
  specialties: string[];
  image: string;
  bio: string;
  galleryImages: { src: string; alt: string }[];
}

export const doctors: Doctor[] = [
  {
    slug: "rev-dr-anthony-quampah",
    name: "Rev. Dr. Anthony Quampah",
    title: "Founder, CEO & Fertility Specialist",
    specialties: ["Fertility Specialist", "General Surgeon", "Head of Departments"],
    image: "/images/doctors/anthony-quampah.png",
    bio: `
Rev. Dr. Anthony Quampah is the visionary founder and steadfast leader of Onyx Medical & Fertility Center. With a profound dedication to both clinical excellence and compassionate care, he has been the driving force behind our mission since its inception in January 2023. As a distinguished Fertility Specialist and a skilled General Surgeon, Dr. Quampah brings a wealth of expertise and a dual perspective that enriches our practice.

His leadership extends across all departments, ensuring that a culture of patient-first service, innovation, and the highest medical standards are upheld throughout the center. Dr. Quampah's commitment is not just to treat patients, but to build a sanctuary of hope, guiding families on their journey to wellness and parenthood with unwavering support and integrity.
    `,
    galleryImages: [
      { src: "/images/gallery/team-1.png", alt: "Dr. Quampah with team" },
      { src: "/images/gallery/surgery-1.png", alt: "Dr. Quampah in surgery" },
      { src: "/images/gallery/consultation-1.png", alt: "Dr. Quampah consulting patient" },
      { src: "/images/gallery/facility-1.png", alt: "Onyx Medical facility" },
    ],
  },
  {
    slug: "dr-alice-johnson",
    name: "Dr. Alice Johnson",
    title: "Gynecologist & Obstetrician",
    specialties: ["Gynecology", "Obstetrics", "Women's Health"],
    image: "/images/doctors/doc5 (2).jpg",
    bio: "Dr. Alice Johnson is a dedicated and compassionate specialist in women's health. With over 15 years of experience, she provides comprehensive care in gynecology and obstetrics, guiding her patients through every stage of life with warmth and expertise. She is passionate about patient education and preventative care.",
    galleryImages: [
      { src: "/images/doctors/doctor-2.jpg", alt: "Dr. Johnson with a newborn" },
      { src: "/images/gallery/ultrasound.png", alt: "Ultrasound scan" },
      { src: "/images/gallery/exam-room.png", alt: "Women's health clinic room" },
    ],
  },
  {
    slug: "dr-robert-williams",
    name: "Dr. Robert Williams",
    title: "Pediatrician",
    specialties: ["Pediatrics", "Child Health", "Adolescent Medicine"],
    image: "/images/doctors/doc6.jpg",
    bio: "Dr. Robert Williams is a board-certified pediatrician known for his friendly demeanor and exceptional ability to connect with children and their parents. He is committed to providing comprehensive care from infancy through adolescence, focusing on development, nutrition, and preventative health to ensure a healthy start in life.",
    galleryImages: [
      { src: "/images/gallery/doctor-child.png", alt: "Dr. Williams with a child patient" },
      { src: "/images/gallery/pediatric-room.png", alt: "Pediatric examination room" },
      { src: "/images/gallery/play-area.png", alt: "Children playing in waiting room" },
    ],
  },
  {
    slug: "dr-emily-brown",
    name: "Dr. Emily Brown",
    title: "Internal Medicine Specialist",
    specialties: ["Internal Medicine", "Chronic Disease Management", "Adult Health"],
    image: "/images/doctors/doc7.jpg",
    bio: "Dr. Emily Brown specializes in internal medicine, focusing on the diagnosis and treatment of complex illnesses in adults. She is a meticulous diagnostician and a strong advocate for her patients, coordinating care and developing long-term management plans for chronic conditions with a holistic approach.",
    galleryImages: [
        { src: "/images/gallery/medical-chart.png", alt: "Medical chart" },
        { src: "/images/gallery/doctor-senior.png", alt: "Discussing results with senior patient" },
        { src: "/images/gallery/lab-1.png", alt: "Medical laboratory" },
    ],
  },
];

export const getAllDoctors = () => {
  return doctors;
};

export const getDoctorBySlug = (slug: string) => {
  return doctors.find(doctor => doctor.slug === slug);
};
