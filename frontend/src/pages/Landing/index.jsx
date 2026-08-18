import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getPublicCourses } from "../../services/courseService";
import { getLatestReviews } from "../../services/reviewService";
import { getImageUrl } from "../../utils/helpers";

export default function LandingPage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, reviewsRes] = await Promise.all([
          getPublicCourses(),
          getLatestReviews().catch(() => null)
        ]);
        if (coursesRes && coursesRes.data) {
          setPopularCourses(coursesRes.data.slice(0, 3));
        }
        if (reviewsRes && reviewsRes.data) {
          setLatestReviews(reviewsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <header className="bg-white/70 dark:bg-black/40 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-50 py-4 px-6 md:px-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Navbar />
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
              <Link to="/courses" className="bg-white text-[#1E40AF] border-2 border-[#1E40AF] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors">
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
      <section id="features" className="py-16 bg-gray-50">
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
            <Link to="/courses" className="text-[#1E40AF] font-semibold hover:underline hidden sm:block">View all &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <Link key={course._id || course.id} to={`/courses/${course._id || course.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={getImageUrl(course.thumbnail || course.thumbnail_url || course.image)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-[#1E40AF] bg-blue-50 px-2 py-1 rounded-md">New</span>
                    <div className="flex items-center text-sm text-yellow-500">
                      <span className="material-symbols-rounded text-base mr-1">star</span>
                      <span>{course.rating || 4.8}</span>
                      <span className="text-gray-400 ml-1">({course.students?.length || course.studentCount || 0})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">Instructor: {course.teacher?.user?.firstName ? `${course.teacher.user.firstName} ${course.teacher.user.lastName || ''}`.trim() : 'EduStack'}</p>
                  
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                    <span className="font-extrabold text-lg text-gray-900">{course.price ? course.price.toLocaleString() : 0} UZS</span>
                    <button className="bg-gray-50 text-[#1E40AF] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] hover:text-white transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            {loading && <div className="col-span-3 text-center py-10 text-gray-500">Yuklanmoqda...</div>}
            {!loading && popularCourses.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                Hozircha kurslar yo'q
              </div>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/courses" className="text-[#1E40AF] font-semibold hover:underline">View all &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Flexible Pricing Plans</h2>
            <p className="mt-2 text-gray-500">Choose the plan that fits your learning journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <p className="text-gray-500 text-sm mb-4">For beginners starting out</p>
                <div className="text-4xl font-extrabold text-[#1E40AF] mb-6">0 <span className="text-base text-gray-500 font-normal">UZS/mo</span></div>
                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Access to basic courses</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Community discussions</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Self-paced learning</li>
                </ul>
              </div>
              <Link to="/sign-up" className="w-full text-center py-3 rounded-full border border-[#1E40AF] text-[#1E40AF] font-semibold hover:bg-blue-50 transition-colors">
                Get Started
              </Link>
            </div>

            <div className="bg-[#1E40AF] rounded-2xl p-8 shadow-lg text-white flex flex-col justify-between transform md:-translate-y-2">
              <div>
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Pro Plan</h3>
                <p className="text-blue-100 text-sm mb-4">For ambitious learners & professionals</p>
                <div className="text-4xl font-extrabold text-white mb-6">490,000 <span className="text-base text-blue-200 font-normal">UZS/mo</span></div>
                <ul className="space-y-3 text-sm text-blue-100 mb-6">
                  <li className="flex items-center gap-2"><span className="text-white">✓</span> All courses included</li>
                  <li className="flex items-center gap-2"><span className="text-white">✓</span> Mentor support & code reviews</li>
                  <li className="flex items-center gap-2"><span className="text-white">✓</span> Verified Certificate of Completion</li>
                  <li className="flex items-center gap-2"><span className="text-white">✓</span> Offline downloads</li>
                </ul>
              </div>
              <Link to="/sign-up" className="w-full text-center py-3 rounded-full bg-white text-[#1E40AF] font-bold hover:bg-gray-100 transition-colors shadow-md">
                Start Pro Trial
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Plan</h3>
                <p className="text-gray-500 text-sm mb-4">For teams & organizations</p>
                <div className="text-4xl font-extrabold text-[#1E40AF] mb-6">990,000 <span className="text-base text-gray-500 font-normal">UZS/mo</span></div>
                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Everything in Pro</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 1-on-1 Dedicated Mentor</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Team progress analytics</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Job placement assistance</li>
                </ul>
              </div>
              <Link to="/sign-up" className="w-full text-center py-3 rounded-full border border-[#1E40AF] text-[#1E40AF] font-semibold hover:bg-blue-50 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Students Say</h2>
            <p className="mt-2 text-gray-500">Real stories from our graduated learners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestReviews.length > 0 ? (
              latestReviews.map((review) => (
                <div key={review._id} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col justify-between">
                  <p className="text-gray-600 italic mb-6">"{review.comment}"</p>
                  <div className="flex items-center gap-4">
                    {review.studentId?.avatar ? (
                      <img src={getImageUrl(review.studentId.avatar)} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center uppercase">
                        {review.studentId?.firstName?.[0] || review.studentId?.name?.[0] || "S"}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900">{review.studentId?.firstName || review.studentId?.name || "Student"} {review.studentId?.lastName || ''}</h4>
                      <div className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                Hozircha sharhlar yo'q
              </div>
            )}
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
                <Link to="https://t.me/S_150907" className="text-blue-200 hover:text-white transition-colors">Telegram</Link>
                <Link to="https://sardorbekcoder.uz" className="text-blue-200 hover:text-white transition-colors">Personal Site</Link>
                <Link to="https://github.com/muhammadjonov-spec" className="text-blue-200 hover:text-white transition-colors">GitHub</Link>
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
                <li><Link to="/support/help" className="text-blue-200 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/support/terms" className="text-blue-200 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/support/privacy" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/support/contact" className="text-blue-200 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 text-center text-blue-200 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2026 EduStack LMS. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Created by Muhammadjonov Sardorbek for education</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
