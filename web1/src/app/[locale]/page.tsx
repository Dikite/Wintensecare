import styles from "./page.module.css";
import HeroSection from "./components/hero";
import WhoWeHelp from "./components/whowehelp";
import HowItWorksSection from "./components/Howitworks";
import SecurityPage from "./components/security";
import TechnologyOfCareSection from "./components/products";

import FinalCTA from "./components/finalcta"; 
import Footer from "./components/footer";
import Navbar from "./components/navbar"
import AIOperationsPage from "./components/ai-operations"

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Navbar />
        <HeroSection />
        <WhoWeHelp />
        <HowItWorksSection />
        <AIOperationsPage />
            <TechnologyOfCareSection />
        <SecurityPage />
   
     
       <FinalCTA />
       <Footer />

      </main>
    </div>
  );
}
