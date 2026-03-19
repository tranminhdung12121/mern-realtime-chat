// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GG_AI_API_KEY);
// export const generateAIResponse = async (prompt) => {
//   console.log("API KEY:", process.env.GG_AI_API_KEY);
  
//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//   });
// const resulttesst = await model.generateContent("hello");
// console.log("resulttesst",await resulttesst.response.text());
//   const result = await model.generateContent(prompt);
//   const response = await result.response;


//   return response.text();
// };
//aiService.js
export const generateAIResponse = async (prompt) => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GG_AI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await res.json();
  console.log("kq ai", data);

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Không tìm thấy kết quả!";
};

