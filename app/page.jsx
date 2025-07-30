import { Button } from "@/components/ui/button";
import HeroSection from "@/components/ui/hero";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="pt-36">
        <HeroSection/>
        <section className="py-20 text-center">
          <div className="max-w-4xl  mx-auto px-6">
            <h2 className="text-5xl font-bold  mb-6">Ready to{" "}
               <span className="bg-gradient-to-r  from-blue-400 to-purple-500 bg-clip-text text-transparent">Create Some Thing Amazing?</span></h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who are already using AI to trasnfrm their images 
              and bring their images and bring their vision to life
            </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
             <Link href="/dashboard">
              <Button variant="primary" size={"xl"}>
                ✨ Start Creating Now
              </Button>
            </Link>
            <Button variant={"glass"} size={"xl"}>
              Watch Demo
            </Button>
           </div>
          </div>
        </section>

      </div>
    </>
  );
}
