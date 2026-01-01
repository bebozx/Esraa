const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// تشغيل صفحة الواجهة الرئيسية عند فتح الرابط
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// استقبال الرسائل والتعامل مع الذكاء الاصطناعي
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body; 

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                // استخدام متغير البيئة للأمان
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a friendly and natural American friend. You remember everything the user tells you. Keep responses short, casual, and fun (max 15 words)." 
                    },
                    ...messages
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            res.status(500).json({ reply: "I'm a bit lost, could you repeat that?" });
        }
    } catch (error) {
        res.status(500).json({ reply: "My brain is offline for a second, try again!" });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
