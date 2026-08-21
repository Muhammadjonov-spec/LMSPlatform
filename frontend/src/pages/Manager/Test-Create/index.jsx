import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createTest, updateTest, getTestForManager } from "../../../services/testService";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";

const TestCreate = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // If moduleId is undefined or 'final', it's a final test
  const isFinalTest = !moduleId || moduleId === 'final';

  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    timeLimit: 30,
    passingScore: 85,
    questions: [
      {
        id: Date.now(),
        questionText: "",
        questionImage: null,
        options: [
          { id: Date.now() + 1, text: "", isCorrect: false, optionImage: null },
          { id: Date.now() + 2, text: "", isCorrect: false, optionImage: null },
        ]
      }
    ]
  });

  useEffect(() => {
    // If editing, we'd fetch the test
    const fetchTest = async () => {
      try {
        setLoading(true);
        // Note: the user must implement getTestForManager in backend
        const res = await getTestForManager(courseId, isFinalTest ? 'final' : moduleId);
        if (res && res.data) {
          // ensure questions format
          setTestData(res.data);
        }
      } catch (err) {
        console.log("Test not found, creating new one.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchTest();
    }
  }, [courseId, moduleId, isFinalTest]);

  const handleAddQuestion = () => {
    setTestData({
      ...testData,
      questions: [
        ...testData.questions,
        {
          id: Date.now(),
          questionText: "",
          questionImage: null,
          options: [
            { id: Date.now() + 1, text: "", isCorrect: false, optionImage: null },
            { id: Date.now() + 2, text: "", isCorrect: false, optionImage: null },
          ]
        }
      ]
    });
  };

  const handleRemoveQuestion = (qId) => {
    setTestData({
      ...testData,
      questions: testData.questions.filter(q => q.id !== qId)
    });
  };

  const handleQuestionChange = (qId, field, value) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => 
        q.id === qId ? { ...q, [field]: value } : q
      )
    });
  };

  const handleAddOption = (qId) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id === qId) {
          return {
            ...q,
            options: [...q.options, { id: Date.now(), text: "", isCorrect: false, optionImage: null }]
          };
        }
        return q;
      })
    });
  };

  const handleRemoveOption = (qId, optId) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id === qId) {
          return { ...q, options: q.options.filter(o => o.id !== optId) };
        }
        return q;
      })
    });
  };

  const handleOptionChange = (qId, optId, field, value) => {
    setTestData({
      ...testData,
      questions: testData.questions.map(q => {
        if (q.id === qId) {
          return {
            ...q,
            options: q.options.map(o => 
              o.id === optId ? { ...o, [field]: value } : o
            )
          };
        }
        return q;
      })
    });
  };

  const handleFileChange = (e, qId, optId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (optId) {
      handleOptionChange(qId, optId, "optionImage", file);
    } else {
      handleQuestionChange(qId, "questionImage", file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Validations
      if (testData.questions.length === 0) {
        alert("Kamida bitta savol qo'shishingiz kerak!");
        return;
      }
      for (const q of testData.questions) {
        if (!q.questionText.trim()) {
          alert("Barcha savollarning matni kiritilishi shart!");
          return;
        }
        const hasCorrect = q.options.some(o => o.isCorrect);
        if (!hasCorrect) {
          alert("Har bir savolda kamida bitta to'g'ri javob belgilanishi shart!");
          return;
        }
      }

      const formData = new FormData();
      formData.append("courseId", courseId);
      if (!isFinalTest) formData.append("moduleId", moduleId);
      formData.append("isFinalTest", isFinalTest);
      formData.append("timeLimit", testData.timeLimit);
      formData.append("passingScore", testData.passingScore);

      // We need to send questions structure. Since FormData only takes strings/files,
      // a common way is to send files with specific field names and JSON string for questions.
      
      const parsedQuestions = testData.questions.map((q, qIndex) => {
        if (q.questionImage instanceof File) {
          formData.append(`questionImage_${qIndex}`, q.questionImage);
        }
        const parsedOptions = q.options.map((opt, optIndex) => {
          if (opt.optionImage instanceof File) {
            formData.append(`optionImage_${qIndex}_${optIndex}`, opt.optionImage);
          }
          return {
            text: opt.text,
            isCorrect: opt.isCorrect,
            // the backend will match the files based on indexes
          };
        });
        return {
          questionText: q.questionText,
          options: parsedOptions
        };
      });

      formData.append("questions", JSON.stringify(parsedQuestions));

      if (testData._id) {
        await updateTest(testData._id, formData);
        alert("Test muvaffaqiyatli yangilandi!");
      } else {
        await createTest(formData);
        alert("Test muvaffaqiyatli yaratildi!");
      }

      navigate(-1);
    } catch (err) {
      alert("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !testData.questions) return <div>Yuklanmoqda...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isFinalTest ? "Kurs uchun Yakuniy Test yaratish" : "Modul uchun Test yaratish"}
        </h1>
        <Button onClick={() => navigate(-1)} variant="outline">Orqaga</Button>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Test Sozlamalari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vaqt chegarasi (daqiqa)
            </label>
            <Input 
              type="number" 
              value={testData.timeLimit} 
              onChange={(e) => setTestData({...testData, timeLimit: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              O'tish bali (%)
            </label>
            <Input 
              type="number" 
              value={testData.passingScore} 
              onChange={(e) => setTestData({...testData, passingScore: e.target.value})} 
            />
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {testData.questions.map((q, qIndex) => (
          <Card key={q.id} className="p-6 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">{qIndex + 1}-savol</h3>
              <button 
                onClick={() => handleRemoveQuestion(q.id)}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
              >
                Savolni O'chirish
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Savol matni</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(q.id, "questionText", e.target.value)}
                placeholder="Savolni kiriting..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Savol uchun rasm (ixtiyoriy)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, q.id)}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {q.questionImage && typeof q.questionImage === 'string' && (
                <img src={q.questionImage} alt="question" className="mt-2 h-20 object-contain" />
              )}
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">Muqobil javoblar:</h4>
              
              <div className="space-y-3">
                {q.options.map((opt, optIndex) => {
                  const letter = String.fromCharCode(97 + optIndex); // a, b, c, d...
                  return (
                    <div key={opt.id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center h-10 mt-1">
                        <input 
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) => handleOptionChange(q.id, opt.id, "isCorrect", e.target.checked)}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                          title="Shu javob to'g'ri bo'lsa belgilang"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-600 min-w-[24px]">{letter})</span>
                          <Input 
                            value={opt.text}
                            onChange={(e) => handleOptionChange(q.id, opt.id, "text", e.target.value)}
                            placeholder="Javob matni..."
                            className="flex-1"
                          />
                          {q.options.length > 2 && (
                            <button 
                              onClick={() => handleRemoveOption(q.id, opt.id)}
                              className="text-gray-400 hover:text-red-500 p-2"
                              title="Variantni o'chirish"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div className="mt-2 ml-8 flex items-center space-x-2">
                          <label className="text-xs text-gray-500">Rasm qo'shish (ixtiyoriy):</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, q.id, opt.id)}
                            className="text-xs text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <Button 
                  onClick={() => handleAddOption(q.id)} 
                  variant="outline" 
                  size="sm"
                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                >
                  + Variant qo'shish
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <Button onClick={handleAddQuestion} className="bg-gray-800 hover:bg-gray-900 text-white">
          + Yangi Savol Qo'shish
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
        >
          {loading ? "Saqlanmoqda..." : "Testni Saqlash"}
        </Button>
      </div>
    </div>
  );
};

export default TestCreate;
