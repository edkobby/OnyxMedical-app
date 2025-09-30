
export interface GalleryImage {
  src: string;
  alt: string;
  category: 'Surgery' | 'Patient Care' | 'Technology' | 'Doctors';
}

export const galleryCategories = ['All', 'Surgery', 'Patient Care', 'Technology', 'Doctors'];

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/surgery-op.png", alt: "Surgeons in an operating room", category: 'Surgery' },
  { src: "/images/gallery/patient-checkup.png", alt: "Doctor checking patient's blood pressure", category: 'Patient Care' },
  { src: "/images/gallery/mri-scanner.png", alt: "Advanced MRI machine", category: 'Technology' },
  { src: "/images/gallery/doctor-team.png", alt: "Team of diverse doctors smiling", category: 'Doctors' },
  { src: "/images/gallery/surgery-closeup.png", alt: "Close-up of a surgical procedure", category: 'Surgery' },
  { src: "/images/gallery/nurse-comfort.png", alt: "Nurse comforting an elderly patient", category: 'Patient Care' },
  { src: "/images/gallery/microscope.png", alt: "Scientist looking through a microscope", category: 'Technology' },
  { src: "/images/gallery/female-doctor.png", alt: "Portrait of a friendly female doctor", category: 'Doctors' },
  { src: "/images/gallery/surgical-tools.png", alt: "Surgical tools laid out", category: 'Surgery' },
  { src: "/images/gallery/pediatrician.png", alt: "Pediatrician with a child patient", category: 'Patient Care' },
  { src: "/images/gallery/robotic-surgery.png", alt: "Robotic surgery system", category: 'Technology' },
  { src: "/images/gallery/medical-students.png", alt: "Group of medical students with a professor", category: 'Doctors' },
  { src: "/images/gallery/anesthesiologist.png", alt: "Anesthesiologist monitoring a patient", category: 'Surgery' },
  { src: "/images/gallery/physical-therapist.png", alt: "Physical therapist assisting a patient", category: 'Patient Care' },
  { src: "/images/gallery/brain-scan-analysis.png", alt: "Doctor analyzing a brain scan on a large screen", category: 'Technology' },
  { src: "/images/gallery/surgeon-portrait.png", alt: "Surgeon looking confidently at the camera", category: 'Doctors' },
];
