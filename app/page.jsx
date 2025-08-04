import FeaturesSection from "@/components/features";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/ui/hero";
import Link from "next/link";

export default function Home() {
  const stats = [
    { label: "Images Processed", value: 1000, suffix: "+" },
    { label: "Active Users", value: 500, suffix: "+" },
    { label: "AI Transformed Images", value: 45000, suffix: "+" },
    { label: "Users Satisfaction", value: 98, suffix: "%" },
    // {label:"5-Star Reviews",value:1000000,suffix:"+"},
    // {label:"Years of Experience",value:1000000,suffix:"+"},
    // {label:"Countries Served",value:1000000,suffix:"+"},
    // {label:"Awards Won",value:1000000,suffix:"+"},
    // {label:"Projects Completed",value:1000000,suffix:"+"},
  ]
  return (
    <>
      <div className="pt-36">
        <HeroSection />
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2  lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text  ">    {stat.value.toLocaleString()}
                    {stat.suffix}</div>

                  <div className="text-gray-400 uppercase tracking-wider text-sm">{stat.label}</div>
                </div>

              ))}
            </div>
          </div>
        </section>

        <FeaturesSection/>
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
