import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTestForStudent, submitTest } from "../../../services/testService";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const TestTake = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { questionId: [selectedOptionIds] }
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await getTestForStudent(testId);
        if (res && res.data) {
          setTest(res.data);
          if (res.data.timeLimit) {
            setTimeLeft(res.data.timeLimit * 60);
          }
        }
      } catch (err) {
        alert("Testni yuklashda xatolik");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId, navigate]);

  useEffect(() => {
    if (timeLeft === null) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleOptionSelect = (qId, optId, isMultiple) => {
    setAnswers(prev => {
      const selected = prev[qId] || [];
      if (isMultiple) {
        if (selected.includes(optId)) {
          return { ...prev, [qId]: selected.filter(id => id !== optId) };
        } else {
          return { ...prev, [qId]: [...selected, optId] };
        }
      } else {
        return { ...prev, [qId]: [optId] };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Format answers for backend: [{ questionId, selectedOptions: [] }]
      const formattedAnswers = Object.keys(answers).map(qId => ({
        questionId: qId,
        selectedOptions: answers[qId]
      }));

      const res = await submitTest(testId, formattedAnswers);
      if (res && res.data) {
        alert("Test yakunlandi!");
        navigate(`/student/test-result/${res.data.resultId}`);
      }
    } catch (err) {
      alert("Testni yakunlashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="p-6">Test yuklanmoqda...</div>;
  if (!test) return <div className="p-6">Test topilmadi.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-md shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Test: {test.courseName}</h1>
          <p className="text-sm text-gray-500">O'tish bali: {test.passingScore}%</p>
        </div>
        {timeLeft !== null && (
          <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-indigo-600'}`}>
            Vaqt: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {test.questions?.map((q, qIndex) => {
          // A question is multiple choice if it allows multiple correct answers (backend should tell this, or we just allow multiple if they check checkboxes).
          // Assuming backend sets `isMultiple: true` if multiple correct answers exist, otherwise false.
          const isMultiple = q.isMultiple || false; 

          return (
            <Card key={q._id} className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {qIndex + 1}. {q.questionText}
              </h3>
              {q.questionImage && (
                <img src={q.questionImage} alt="savol" className="mb-4 max-h-48 object-contain rounded-md" />
              )}
              
              <div className="space-y-3 mt-4 pl-4 border-l-2 border-gray-100">
                {q.options?.map((opt, optIndex) => {
                  const isSelected = (answers[q._id] || []).includes(opt._id);
                  const letter = String.fromCharCode(97 + optIndex);
                  
                  return (
                    <label 
                      key={opt._id} 
                      className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input 
                        type={isMultiple ? "checkbox" : "radio"}
                        name={`question-${q._id}`}
                        checked={isSelected}
                        onChange={() => handleOptionSelect(q._id, opt._id, isMultiple)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="font-bold text-gray-500">{letter})</span>
                      <span className="flex-1 text-gray-700">{opt.text}</span>
                      {opt.optionImage && (
                        <img src={opt.optionImage} alt="variant" className="h-12 object-contain ml-2" />
                      )}
                    </label>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 text-lg">
          Testni Yakunlash
        </Button>
      </div>
    </div>
  );
};

export default TestTake;
