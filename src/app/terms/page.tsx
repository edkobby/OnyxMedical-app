
import Header from '@/components/header';
import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import PageBanner from '@/components/page-banner';

export default function TermsPage() {
  return (
    <div className="bg-background">
      <div className="sticky top-0 z-50">
        <TopBar />
      </div>
      <Header />
      <main>
        <PageBanner title="Terms & Conditions" imageSrc="https://placehold.co/1920x768.png" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }]} />
        
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="prose prose-lg max-w-none mx-auto text-foreground/80">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <h2>1. Introduction</h2>
              <p>
                Welcome to Onyx Medical & Fertility Center. These Terms and Conditions govern your use of our website and services. By accessing our website or using our services, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you must not use our website or services.
              </p>

              <h2>2. Use of Our Services</h2>
              <p>
                Our services are intended for individuals seeking medical information and services. You agree to use our website for lawful purposes only. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent, or harmful.
              </p>
              
              <h2>3. Medical Disclaimer</h2>
              <p>
                The information provided on this website is for general informational and educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
              </p>

              <h2>4. User Accounts</h2>
              <p>
                To access certain features of our website, such as the patient portal, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
              </p>

              <h2>5. Intellectual Property</h2>
              <p>
                All content included on this site, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of Onyx Medical & Fertility Center or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                In no event shall Onyx Medical & Fertility Center, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort or otherwise. Onyx Medical & Fertility Center shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
              </p>

              <h2>7. Changes to Terms</h2>
              <p>
                We reserve the right, in our sole discretion, to change the Terms under which our services are offered. The most current version of the Terms will supersede all previous versions. We encourage you to periodically review the Terms to stay informed of our updates.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at our official email address or phone number listed on our contact page.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
