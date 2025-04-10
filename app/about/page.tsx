// app/about/page.tsx
"use client";
import { useRouter } from "next/navigation";


export default function AboutPage() {
  const router = useRouter();

  const handleStartExploring = () => {
    router.push("/"); // Navigate to the home page
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold mb-4">About GiftSage</h1>
          <p className="text-lg leading-relaxed">
            Discover the joy of giving with <span className="font-semibold">GiftSage</span>, your ultimate destination for finding the perfect gift for every occasion.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose GiftSage?</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Welcome to <span className="font-semibold">GiftSage</span>, where we make gift-giving effortless and meaningful. Powered by cutting-edge AI technology, 
          GiftSage provides personalized recommendations tailored to your loved ones' preferences, interests, and special moments.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Whether you're celebrating a birthday, anniversary, holiday, or just want to show someone you care, GiftSage is here to help. 
          Our platform combines thoughtful design with advanced algorithms to ensure that every gift suggestion is meaningful and unique.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          At GiftSage, we believe that giving the right gift is more than just a gesture—it's a way to create lasting memories and strengthen relationships. 
          Let us help you make every occasion unforgettable.
        </p>
        <div className="text-center">
          <p className="text-lg text-gray-800 font-semibold">
            Discover the joy of giving with <span className="text-blue-600">GiftSage</span> today!
          </p>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-blue-100 py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Find the Perfect Gift?</h3>
          <p className="text-lg text-gray-700 mb-6">
            Explore our platform and let us help you create unforgettable moments with thoughtful gifts.
          </p>
          <button
            onClick={handleStartExploring}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}