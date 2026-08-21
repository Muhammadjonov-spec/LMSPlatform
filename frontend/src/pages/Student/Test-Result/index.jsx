import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTestResult } from "../../../services/testService";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const TestResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getTestResult(resultId);
        if (res && res.data) {
          setResultData(res.data);
        }
      } catch (err) {
        alert("Natijani yuklashda xatolik");
        navigate("/student");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId, navigate]);

  if (loading) return <div className="p-6">Natija yuklanmoqda...</div>;
  if (!resultData) return <div className="p-6">Natija topilmadi.</div>;

  const { percentage, passed, attemptNumber, score, totalQuestions, answers } = resultData;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className={`p-8 mb-8 text-center border-t-8 ${passed ? 'border-green-500' : 'border-red-500'}`}>
        <h1 className="text-3xl font-bold mb-2">
          {passed ? "Tabriklaymiz, siz testdan o'tdingiz!" : "Afsuski, testdan o'ta olmadingiz."}
        </h1>
        <div className="text-5xl font-extrabold my-4 text-gray-800">
          {percentage}%
        </div>
        <p className="text-lg text-gray-600 mb-4">
          Natija: {score} / {totalQuestions}
        </p>
        <p className="text-sm text-gray-400 mb-6">Urinishlar soni: {attemptNumber}</p>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate("/student")} variant="outline">
            Kurslarga qaytish
          </Button>
          {!passed && (
            <Button onClick={() => navigate(`/student/test/${resultData.testId}`)} className="bg-indigo-600 text-white">
              Qayta topshirish
            </Button>
          )}
        </div>
      </Card>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Savollar tahlili</h2>
      <div className="space-y-6">
        {answers?.map((ans, index) => {
          // ans = { questionText, questionImage, options, isCorrect (did user answer correctly) }
          // options = [{ _id, text, optionImage, isSelected }]
          
          return (
            <Card key={index} className={`p-6 border-l-4 ${ans.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-start">
                <div className={`mt-1 mr-3 ${ans.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {ans.isCorrect ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {index + 1}. {ans.questionText}
                  </h3>
                  {ans.questionImage && (
                    <img src={ans.questionImage} alt="savol" className="mb-4 max-h-40 object-contain rounded" />
                  )}
                  
                  <div className="space-y-2 mt-3">
                    {ans.options?.map((opt, optIndex) => {
                      const letter = String.fromCharCode(97 + optIndex);
                      
                      // LOGIC IMPLEMENTATION:
                      // If user answered correctly, we show the options and highlight the correct one.
                      // If user answered incorrectly, we ONLY highlight their incorrect choice, hiding which one is actually correct.
                      
                      let optionClass = "bg-gray-50 text-gray-700";
                      
                      if (ans.isCorrect && opt.isSelected) {
                        optionClass = "bg-green-50 border border-green-200 text-green-800 font-medium";
                      } else if (!ans.isCorrect && opt.isSelected) {
                        optionClass = "bg-red-50 border border-red-200 text-red-800 font-medium";
                      }
                      
                      // NOTE: Backend must return all options but `isCorrect` info on options is ONLY provided if ans.isCorrect === true.
                      // Alternatively, backend simply marks `isSelected: true`.

                      return (
                        <div key={optIndex} className={`flex items-center space-x-3 p-3 rounded-md ${optionClass}`}>
                          <span className="font-bold">{letter})</span>
                          <span className="flex-1">{opt.text}</span>
                          {opt.optionImage && (
                            <img src={opt.optionImage} alt="variant" className="h-10 object-contain ml-2" />
                          )}
                          {opt.isSelected && (
                            <span className="text-xs px-2 py-1 bg-white rounded-full border">
                              Sizning tanlovingiz
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TestResult;
