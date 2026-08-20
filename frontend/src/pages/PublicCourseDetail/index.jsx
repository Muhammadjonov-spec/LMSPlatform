import React, { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getImageUrl } from "../../utils/helpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseReviews, createReview } from "../../services/reviewService";

export default function PublicCourseDetail() {
  const course = useLoaderData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviewsResponse, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", course?._id],
    queryFn: () => getCourseReviews(course._id),
    enabled: !!course?._id
  });

  const reviews = reviewsResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (data) => createReview(course._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", course._id]);
      setComment("");
      setRating(5);
    },
    onError: (err) => {
      alert("Xatolik yuz berdi: " + (err?.response?.data?.message || err.message));
    }
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    mutation.mutate({ rating, comment });
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
        <Link to="/" className="text-[#1E40AF] underline">Go back to Home</Link>
      </div>
    );
  }

  // Fallbacks since mockData might not have these for courseDetail
  const price = course.price || 490000;
  const instructor = course.teacher?.user?.firstName ? `${course.teacher.user.firstName} ${course.teacher.user.lastName || ''}` : course.instructor || "Sardorbek";
  const averageRating = course.rating || 4.8;
  const students = course.students?.length || course.studentCount || 1250;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{course.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{course.category?.name || "Programming"}</p>
            
            <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {course?.teacher?.user?.avatar ? (
                  <img src={getImageUrl(course.teacher.user.avatar)} className="w-5 h-5 rounded-full object-cover" alt="Instructor" />
                ) : (
                  <img src="/assets/images/icons/profile-2user-blue.svg" className="w-5 h-5" alt="Instructor" />
                )}
                <span>Instructor: <span className="font-semibold text-gray-900">{instructor}</span></span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                <span className="material-symbols-rounded text-lg">star</span>
                {averageRating}
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-gray-400">group</span>
                <span>{students} students enrolled</span>
              </div>
            </div>

            <div className="rounded-[20px] overflow-hidden mb-10 border border-gray-200 bg-white">
              <img 
                src={getImageUrl(course.thumbnail || course.thumbnail_url || course.image)} 
                alt={course.name} 
                className="w-full h-[400px] object-cover" 
              />
            </div>

            <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus</h2>
              {course.details && course.details.length > 0 ? (
                <ul className="flex flex-col gap-4">
                  {course.details.map((item, idx) => (
                    <li key={item._id || idx} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-[#1E40AF] font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No syllabus available for this course yet.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[20px] border border-gray-200 p-8 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-gray-500 font-medium mb-2">Price</h3>
                <div className="text-4xl font-extrabold text-gray-900">{course.isFree ? "BEMINNAT" : `${price.toLocaleString()} UZS`}</div>
              </div>

              <ul className="flex flex-col gap-4 mb-8">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-green-500">check_circle</span>
                  <span className="text-gray-600">Full lifetime access</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-green-500">check_circle</span>
                  <span className="text-gray-600">Access on mobile and desktop</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-green-500">check_circle</span>
                  <span className="text-gray-600">Certificate of completion</span>
                </li>
              </ul>

              {(course.isFree || course.isEnrolled) ? (
                <button 
                  onClick={() => navigate(`/student/detail-course/${course._id}`)}
                  className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  Start Learning
                </button>
              ) : (
                <button 
                  onClick={() => navigate(`/checkout/${course._id}`)}
                  className="w-full py-4 rounded-xl bg-[#1E40AF] text-white font-bold text-lg hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  Buy Now
                </button>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Talabalar sharhlari</h3>
                
                {course.isEnrolled && (
                  <form onSubmit={handleSubmitReview} className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-sm font-semibold mb-2">Sharx yozish</h4>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button type="button" key={star} onClick={() => setRating(star)} className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Fikringizni yozing..."
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    ></textarea>
                    <button type="submit" disabled={mutation.isPending} className="bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50">
                      {mutation.isPending ? "Yuborilmoqda..." : "Yuborish"}
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {isLoadingReviews ? (
                    <p className="text-gray-500 text-sm">Sharhlar yuklanmoqda...</p>
                  ) : reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E40AF] flex items-center justify-center font-bold text-xs uppercase">
                            {review.studentId?.firstName?.[0] || review.studentId?.name?.[0] || 'T'}
                          </div>
                          <span className="font-semibold text-sm">{review.studentId?.firstName || review.studentId?.name || "Talaba"} {review.studentId?.lastName || ''}</span>
                          <div className="ml-auto text-yellow-500 text-sm">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Hozircha sharhlar yo'q.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#1E40AF] text-white pt-10 pb-6 px-4 md:px-8 mt-auto">
        <div className="max-w-[1200px] mx-auto text-center text-sm text-blue-200">
          <p>&copy; 2026 EduStack LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
