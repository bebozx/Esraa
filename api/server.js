const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// التعديل الأهم: السيرفر هو اللي هيعرض الصفحة
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: "You are a friendly American friend." }, ...messages]
            })
        });
        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: "Error!" });
    }
});

module.exports = app; // مهم جداً لـ Vercel
