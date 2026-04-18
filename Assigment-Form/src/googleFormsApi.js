import axios from 'axios';

// Removed URL Shortening to minimize external API dependencies and reduce usage.

export const createGoogleForm = async (topic, questions, accessToken) => {
  try {
    // 1. Ek Naya Empty Form Create Karein
    const formRes = await axios.post(
      'https://forms.googleapis.com/v1/forms',
      {
        info: {
          title: `${topic} - Smart Assessment`,
          documentTitle: `${topic} - Quiz`,
        },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const formId = formRes.data.formId;
    const longFormUrl = formRes.data.responderUri; // Google se mila original long URL

    // 2. Quiz settings aur batchUpdate requests taiyar karein
    const requests = [
      {
        updateSettings: {
          settings: { quizSettings: { isQuiz: true } },
          updateMask: 'quizSettings.isQuiz',
        },
      },
    ];

    const studentFields = [
      'Full Name',
      'Roll Number',
      'Branch',
      'Semester',
      'Contact Number',
    ];

    // Student Details Fields add karna
    studentFields.forEach((field, index) => {
      requests.push({
        createItem: {
          item: {
            title: field,
            questionItem: {
              question: { required: true, textQuestion: { paragraph: false } },
            },
          },
          location: { index },
        },
      });
    });

    // AI Generated Questions add karna
    questions.forEach((q, index) => {
      requests.push({
        createItem: {
          item: {
            title: q.question,
            questionItem: {
              question: {
                required: true,
                grading: {
                  pointValue: 1,
                  correctAnswers: {
                    answers: [{ value: q.options[q.answerIndex] }],
                  },
                },
                choiceQuestion: {
                  type: 'RADIO',
                  options: q.options.map(opt => ({ value: opt })),
                },
              },
            },
          },
          location: { index: studentFields.length + index },
        },
      });
    });

    // 3. BatchUpdate API call karke questions push karein
    await axios.post(
      `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
      { requests },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Use direct long URL to save API calls
    return { url: longFormUrl, id: formId };
  } catch (error) {
    console.error('Form Creation Error:', error);
    return null;
  }
};

export const getFormResponses = async (formId, accessToken) => {
  try {
    const res = await axios.get(
      `https://forms.googleapis.com/v1/forms/${formId}/responses`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const responses = res.data.responses || [];
    return responses.map((r, index) => {
      const nameAnswer =
        r.answers &&
        Object.values(r.answers)[0]?.textAnswers?.answers[0]?.value;
      return {
        student: nameAnswer || `Student ${index + 1}`,
        score: r.totalScore || 0,
      };
    });
  } catch (error) {
    console.error('Fetch responses error:', error);
    return [];
  }
};
