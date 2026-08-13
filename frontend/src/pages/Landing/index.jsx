import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function LandingPage() {
  const popularCourses = [
    {
      id: 1,
      title: "Frontend Development (React.js)",
      instructor: "Sardorbek",
      price: 490000,
      rating: 4.8,
      students: 1250,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "Backend Development (Node.js)",
      instructor: "Alisher",
      price: 590000,
      rating: 4.9,
      students: 980,
      image: "https://images.unsplash.com/photo-1627398240411-8bbeb449711c?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Python From Zero to Hero",
      instructor: "Olimjon",
      price: 390000,
      rating: 4.7,
      students: 2100,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&auto=format&fit=crop&q=60"
    }
  ];

  const features = [
    {
      title: "Modern Professions",
      description: "Get high-quality education in the most in-demand programming and design fields.",
      icon: "computer"
    },
    {
      title: "Mentorship",
      description: "If you face difficulties during your studies, our mentors are always ready to help.",
      icon: "handshake"
    },
    {
      title: "Certificates & Portfolio",
      description: "Get a special certificate upon completion and enrich your portfolio with real projects.",
      icon: "workspace_premium"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <Navbar />
            </div>
            <div className="flex items-center space-x-4 ml-8">
              <Link to="/sign-in" className="text-sm font-semibold text-[#1E40AF] hover:text-blue-800 transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link to="/sign-up" className="bg-[#1E40AF] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
              <span className="block">Build your future</span>
              <span className="block text-[#1E40AF]">with EduStack</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-2xl mb-10">
              A modern educational platform with the best collection of courses in programming, design, and business.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/sign-up" className="bg-[#1E40AF] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started
              </Link>
              <Link to="#" className="bg-white text-[#1E40AF] border-2 border-[#1E40AF] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden opacity-10 pointer-events-none">
          <svg className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2" width="404" height="784" fill="none" viewBox="0 0 404 784"><defs><pattern id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="#1E40AF"></rect></pattern></defs><rect width="404" height="784" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"></rect></svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why choose us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <span className="material-symbols-rounded text-[#1E40AF]" style={{ fontSize: '48px' }}>{feature.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Popular Courses</h2>
              <p className="mt-2 text-gray-500">The most chosen learning paths by our students</p>
            </div>
            <Link to="#" className="text-[#1E40AF] font-semibold hover:underline hidden sm:block">View all &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-[#1E40AF] bg-blue-50 px-2 py-1 rounded-md">New</span>
                    <div className="flex items-center text-sm text-yellow-500">
                      <span className="material-symbols-rounded text-base mr-1">star</span>
                      <span>{course.rating}</span>
                      <span className="text-gray-400 ml-1">({course.students})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">Instructor: {course.instructor}</p>
                  
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                    <span className="font-extrabold text-lg text-gray-900">{course.price.toLocaleString()} UZS</span>
                    <button className="bg-gray-50 text-[#1E40AF] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] hover:text-white transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="#" className="text-[#1E40AF] font-semibold hover:underline">View all &rarr;</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E40AF] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Invest in your future</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of students and start learning new skills today.</p>
          <Link to="/sign-up" className="bg-white text-[#1E40AF] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-block">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#1E40AF] text-white pt-16 pb-8 px-4 md:px-8 mt-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/assets/images/logos/edustack-icon-white.svg" alt="EduStack Logo" className="h-10 w-10" />
                <span className="text-2xl font-bold text-white">EduStack</span>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-sm">
                Empowering learners worldwide with cutting-edge tools and resources for career advancement.
              </p>
              <div className="flex space-x-6">
                <Link to="#" className="text-blue-200 hover:text-white transition-colors">Telegram</Link>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors">Instagram</Link>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors">YouTube</Link>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link></li>
                <li><a href="#pricing" className="text-blue-200 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#features" className="text-blue-200 hover:text-white transition-colors">Features</a></li>
                <li><a href="#testimonials" className="text-blue-200 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-1">
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-blue-200 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="#" className="text-blue-200 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-blue-200 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 text-center text-blue-200 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2026 EduStack LMS. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ for education</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
