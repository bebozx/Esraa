const express = require('express');
const app = express();

// إعداد السيرفر لقراءة ملفات الـ JSON والملفات الثابتة
app.use(express.json());
app.use(express.static('public')); 

app.post('/api/chat', async (req, res) => {
    // استقبال مصفوفة الرسائل كاملة من المتصفح لضمان وجود "ذاكرة" للمساعد
    const { messages } = req.body; 

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                // تأكد من وضع مفتاح الـ API الخاص بك هنا
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // الموديل الأحدث والأسرع
                messages: [
                    { 
                        role: "system", 
                        content: "You are a friendly and natural American friend. You remember everything the user tells you in this conversation. Keep your responses short, casual, and fun (max 15 words). Don't repeat the user's questions." 
                    },
                    ...messages // دمج تاريخ المحادثة بالكامل ليعرف السياق
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            console.error("Groq API Error:", data);
            res.status(500).json({ reply: "I'm a bit lost, could you repeat that?" });
        }
    } catch (error) {
        console.error("Connection Error:", error);
        res.status(500).json({ reply: "My brain is offline for a second, try again!" });
    }
});

// تشغيل السيرفر على بورت 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    =============================================
       Tutor Server is LIVE on localhost:${PORT}
       Made for: Esraa Bahaa
    =============================================
    `);
});