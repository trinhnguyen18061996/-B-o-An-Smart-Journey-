import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store for device synchronization (with code mapping)
const syncDatabase: Record<string, { data: unknown; updatedAt: string }> = {};

// Server-side Gemini AI Client (using recommended @google/genai pattern with User-Agent)
const aiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function getGradeTitle(gradeLevel?: string): string {
  switch (gradeLevel) {
    case 'grade_2':
      return 'Lớp 2 (7 - 8 tuổi)';
    case 'grade_3':
      return 'Lớp 3 (8 - 9 tuổi)';
    case 'grade_4':
      return 'Lớp 4 (9 - 10 tuổi)';
    case 'grade_5':
      return 'Lớp 5 (10 - 11 tuổi)';
    case 'grade_1':
    default:
      return 'Lớp 1 (6 - 7 tuổi)';
  }
}

// Fallback questions if AI is offline or rate-limited
const CURRICULUM_FALLBACKS: Record<string, Record<string, Array<{ question: string; options: string[]; correctIndex: number; explanation: string; hint: string }>>> = {
  math: {
    grade_1: [
      { question: 'Bé có 8 quả táo 🍎, mẹ cho thêm 5 quả nữa. Hỏi bé có tất cả bao nhiêu quả táo?', options: ['12 quả', '13 quả', '14 quả', '15 quả'], correctIndex: 1, explanation: '8 + 5 = 13 quả táo. Bé thật giỏi!', hint: 'Lấy 8 cộng thêm 5 nhé.' },
      { question: 'Phép tính nào dưới đây có kết quả bằng 10?', options: ['6 + 3', '7 + 3', '8 + 4', '5 + 4'], correctIndex: 1, explanation: '7 + 3 = 10. Hoan hô bé!', hint: 'Thử tính 7 cộng 3 xem bằng mấy nhé.' },
    ],
    grade_2: [
      { question: 'Tính: 38 + 27 = ?', options: ['55', '65', '67', '75'], correctIndex: 1, explanation: '8 + 7 = 15 (viết 5 nhớ 1), 3 + 2 + 1 = 6. Kết quả là 65!', hint: 'Cộng hàng đơn vị trước: 8 + 7 = 15.' },
      { question: 'Mỗi bạn có 5 quyển vở. Hỏi 4 bạn có tất cả bao nhiêu quyển vở?', options: ['15 quyển', '20 quyển', '25 quyển', '18 quyển'], correctIndex: 1, explanation: '5 × 4 = 20 quyển vở. Phép nhân thật nhanh!', hint: 'Lấy 5 nhân với 4.' },
    ],
    grade_3: [
      { question: 'Một hình chữ nhật có chiều dài 8cm và chiều rộng 5cm. Chu vi của hình chữ nhật là:', options: ['26cm', '40cm', '13cm', '28cm'], correctIndex: 0, explanation: 'Chu vi hình chữ nhật = (8 + 5) × 2 = 13 × 2 = 26cm.', hint: 'Công thức: (Dài + Rộng) × 2.' },
      { question: 'Tính nhẩm giá trị biểu thức: 7 × 8 - 16 = ?', options: ['40', '48', '56', '36'], correctIndex: 0, explanation: '7 × 8 = 56. Lấy 56 - 16 = 40. Bé tính rất chuẩn!', hint: 'Thực hiện phép nhân 7 × 8 trước.' },
    ],
    grade_4: [
      { question: 'Tìm hai số biết tổng là 45 và hiệu là 15. Số lớn là:', options: ['25', '30', '35', '20'], correctIndex: 1, explanation: 'Số lớn = (Tổng + Hiệu) : 2 = (45 + 15) : 2 = 60 : 2 = 30.', hint: 'Công thức tìm số lớn: (Tổng + Hiệu) : 2.' },
      { question: 'Rút gọn phân số 15/25 ta được phân số tối giản là:', options: ['1/5', '3/5', '5/3', '3/4'], correctIndex: 1, explanation: 'Chia cả tử số và mẫu số cho 5: 15:5 = 3, 25:5 = 5. Được 3/5.', hint: 'Cả 15 và 25 đều chia hết cho 5.' },
    ],
    grade_5: [
      { question: 'Một ô tô đi quãng đường 120km hết 2 giờ 30 phút. Vận tốc của ô tô là:', options: ['45 km/h', '48 km/h', '50 km/h', '55 km/h'], correctIndex: 1, explanation: '2 giờ 30 phút = 2.5 giờ. Vận tốc v = s : t = 120 : 2.5 = 48 km/h.', hint: 'Đổi 2 giờ 30 phút thành 2.5 giờ rồi lấy 120 : 2.5.' },
      { question: 'Tính: 25% của 80kg gạo là:', options: ['15kg', '20kg', '25kg', '30kg'], correctIndex: 1, explanation: '80 × 25 : 100 = 20kg. Tuyệt vời!', hint: 'Lấy 80 nhân 25 rồi chia 100.' },
    ],
  },
  vietnamese: {
    grade_1: [
      { question: 'Từ nào dưới đây viết đúng chính tả?', options: ['Cây chiu', 'Cây tre', 'Cây che', 'Cây tra'], correctIndex: 1, explanation: '"Cây tre" viết đúng với âm tr. Tre Việt Nam kiên cường!', hint: 'Cây tre xanh mát đầu làng.' },
      { question: 'Tiếng nào sau đây có chứa vần "uông"?', options: ['Quả chuông', 'Con sáo', 'Mặt trời', 'Dòng suối'], correctIndex: 0, explanation: 'Tiếng "chuông" có vần "uông".', hint: 'Chuông ngân vang boong boong.' },
    ],
    grade_2: [
      { question: 'Từ nào sau đây là từ chỉ hoạt động của học sinh?', options: ['Quyển sách', 'Chăm chỉ', 'Đọc sách', 'Xinh xắn'], correctIndex: 2, explanation: '"Đọc sách" là từ chỉ hành động, việc làm của học sinh.', hint: 'Hành động mắt nhìn vào trang sách và đọc.' },
      { question: 'Chọn từ điền vào chỗ trống: "Lá lành đùm lá ......"', options: ['xanh', 'rách', 'vàng', 'non'], correctIndex: 1, explanation: 'Câu tục ngữ quen thuộc: "Lá lành đùm lá rách" dạy ta biết thương yêu đùm bọc lẫn nhau.', hint: 'Lá lành giúp đỡ lá bị rách.' },
    ],
    grade_3: [
      { question: 'Câu nào sau đây có sử dụng hình ảnh so sánh?', options: ['Mặt trời chiếu sáng rực rỡ.', 'Trăng tròn như cái đĩa bạc.', 'Gió thổi nhè nhẹ trên cành cây.', 'Chúng em tung tăng đến trường.'], correctIndex: 1, explanation: 'Từ "như" nối hình ảnh so sánh: "Trăng tròn như cái đĩa bạc".', hint: 'Tìm câu có từ so sánh "như".' },
      { question: 'Từ nào dưới đây là tính từ chỉ đặc điểm?', options: ['Học tập', 'Thông minh', 'Ngôi trường', 'Giáo viên'], correctIndex: 1, explanation: '"Thông minh" là tính từ chỉ đặc điểm trí tuệ của con người.', hint: 'Từ miêu tả tính chất, trí tuệ.' },
    ],
    grade_4: [
      { question: 'Câu: "Bác kim giờ bước đi từng bước chậm rãi, thận trọng." sử dụng biện pháp nghệ thuật gì?', options: ['So sánh', 'Nhân hóa', 'Điệp từ', 'Đảo ngữ'], correctIndex: 1, explanation: 'Gọi kim giờ là "Bác" và có hành động "bước đi thận trọng" như con người là phép nhân hóa.', hint: 'Vật vô tri được gọi và hành động như người.' },
      { question: 'Thành ngữ nào sau đây khuyên con người ta kiên trì, bền bỉ?', options: ['Có công mài sắt, có ngày nên kim', 'Ăn quả nhớ kẻ trồng cây', 'Lá lành đùm lá rách', 'Học thầy không tày học bạn'], correctIndex: 0, explanation: '"Có công mài sắt, có ngày nên kim" khuyên chúng ta kiên nhẫn vượt qua thử thách.', hint: 'Mài thanh sắt lâu ngày sẽ thành cây kim nhỏ.' },
    ],
    grade_5: [
      { question: 'Cặp quan hệ từ nào phù hợp để điền vào chỗ trống: "... trời mưa to ... bạn Nam vẫn đến lớp đúng giờ."', options: ['Vì ... nên ...', 'Mặc dù ... nhưng ...', 'Nếu ... thì ...', 'Nhờ ... mà ...'], correctIndex: 1, explanation: 'Cặp "Mặc dù ... nhưng ..." biểu thị quan hệ tương phản giữa khó khăn và sự cố gắng.', hint: 'Hai vế có ý nghĩa tương phản nhau.' },
      { question: 'Cặp từ nào dưới đây là cặp từ đồng nghĩa?', options: ['Bao la - Rộng lớn', 'Siêng năng - Lười biếng', 'Cao lớn - Thấp bé', 'Thật thà - Gian dối'], correctIndex: 0, explanation: '"Bao la" và "Rộng lớn" đều cùng chỉ không gian mênh mông, rộng mở.', hint: 'Hai từ cùng chỉ sự rộng lớn mênh mông.' },
    ],
  },
  english: {
    grade_1: [
      { question: 'What color is the sun? ☀️', options: ['Blue', 'Yellow', 'Green', 'Black'], correctIndex: 1, explanation: 'The sun is yellow and warm! Great job!', hint: 'Mặt trời màu vàng ấm áp.' },
      { question: 'Which animal says "Meow meow"? 🐱', options: ['Dog', 'Cat', 'Elephant', 'Lion'], correctIndex: 1, explanation: 'A cat says "Meow meow"! 🐱', hint: 'Chú mèo kêu meo meo.' },
    ],
    grade_2: [
      { question: 'Choose the correct word: "This is my ...... I use it to write."', options: ['pencil', 'eraser', 'chair', 'desk'], correctIndex: 0, explanation: 'A pencil is used for writing. Excellent!', hint: 'Đồ dùng học tập dùng để viết.' },
      { question: 'How many days are there in a week?', options: ['Five', 'Six', 'Seven', 'Eight'], correctIndex: 2, explanation: 'There are seven days in a week: Mon to Sun!', hint: 'Có 7 ngày trong một tuần.' },
    ],
    grade_3: [
      { question: 'Look at the picture: 🏊 What is he doing?', options: ['He is reading a book.', 'He is swimming.', 'He is playing football.', 'He is sleeping.'], correctIndex: 1, explanation: '"He is swimming" (Cậu ấy đang bơi lội). Well done!', hint: 'Hành động bơi lội dưới nước.' },
      { question: 'Complete the sentence: "My sister ...... to school at 7:00 every morning."', options: ['go', 'goes', 'going', 'is go'], correctIndex: 1, explanation: 'Subject "My sister" (she) takes the verb "goes" in present simple tense.', hint: 'Chủ ngữ ngôi thứ 3 số ít chia "goes".' },
    ],
    grade_4: [
      { question: 'Comparative form: "A cheetah is ...... than a lion."', options: ['fast', 'faster', 'fastest', 'more fast'], correctIndex: 1, explanation: 'Short adjective "fast" becomes "faster than".', hint: 'So sánh hơn của tính từ ngắn: adj + er.' },
      { question: 'Past tense: "Yesterday, we ...... our grandparents in the countryside."', options: ['visit', 'visited', 'visiting', 'will visit'], correctIndex: 1, explanation: '"Yesterday" indicates past simple tense: "visited".', hint: 'Hành động đã diễn ra ngày hôm qua.' },
    ],
    grade_5: [
      { question: 'Choose the best word for environmental protection: "We should ...... plastic bags to keep our Earth clean."', options: ['throw away', 'reduce and recycle', 'burn', 'ignore'], correctIndex: 1, explanation: 'We should "reduce and recycle" plastic bags to protect our environment.', hint: 'Cần giảm thiểu và tái chế túi nilon.' },
      { question: 'Complete the sentence: "If it rains tomorrow, we ...... at home to read books."', options: ['stay', 'will stay', 'stayed', 'staying'], correctIndex: 1, explanation: 'First conditional sentence: If + present simple, will + V.', hint: 'Câu điều kiện loại 1: If it rains, we will stay.' },
    ],
  },
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Endpoint 1: Ask AI Tutor (Gia sư AI theo cấp lớp)
  app.post("/api/ai/ask-tutor", async (req, res) => {
    try {
      const { question, gradeLevel, subject, childName } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ success: false, message: "Missing question" });
      }

      const kidName = childName || 'bé Bảo An';
      const gradeTitle = getGradeTitle(gradeLevel);

      if (!aiClient) {
        // Fallback response when GEMINI_API_KEY is not configured
        return res.json({
          success: true,
          answer: `Chào ${kidName}! Thầy/Cô gia sư AI rất vui được đồng hành cùng con ở chương trình ${gradeTitle}. Về câu hỏi "${question}", con hãy nhớ quan sát kỹ đề bài, chia nhỏ các bước thực hiện và đừng ngại thử lại nhé. Con luôn là một học sinh rất thông minh và chăm chỉ! 🌟`,
        });
      }

      const prompt = `Học sinh tên là "${kidName}", đang học ${gradeTitle}, môn học: ${subject || 'Tiểu học'}.
Bé hỏi: "${question}".
Hãy đóng vai một Gia sư AI tiểu học hiền từ, truyền cảm hứng và sư phạm. Giải thích câu hỏi trên thật dễ hiểu, chuẩn kiến thức Bộ GD&ĐT Việt Nam theo đúng lứa tuổi của bé.
Yêu cầu:
1. Độ dài ngắn gọn, cô đọng (dưới 130 từ).
2. Dùng từ ngữ gần gũi, ấm áp, có ví dụ trực quan hoặc emoji sinh động.
3. Luôn có 1 câu động viên, khen ngợi bé ở cuối.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const answerText = response.text?.trim() || `Chào ${kidName}! Con hãy tự tin làm từng bước một nhé, con làm rất tốt!`;
      return res.json({ success: true, answer: answerText });
    } catch (err: unknown) {
      console.error("AI Tutor Error:", err);
      const kidName = req.body?.childName || 'bé Bảo An';
      return res.json({
        success: true,
        answer: `Chào ${kidName}! Thầy/Cô gia sư AI luôn ở bên con. Với bài này con hãy bình tĩnh đọc kỹ từng chữ và áp dụng kiến thức vừa học nhé! ⭐`,
      });
    }
  });

  // AI Endpoint 2: Generate dynamic grade-specific question (Thử thách AI theo cấp lớp)
  app.post("/api/ai/generate-question", async (req, res) => {
    try {
      const { subject, gradeLevel, topic, childName } = req.body;
      const sub = (subject || 'math') as 'math' | 'vietnamese' | 'english';
      const grade = (gradeLevel || 'grade_1') as string;
      const gradeTitle = getGradeTitle(grade);

      // Select fallback in case AI call fails or is not enabled
      const list = CURRICULUM_FALLBACKS[sub]?.[grade] || CURRICULUM_FALLBACKS.math.grade_1;
      const randomFallback = list[Math.floor(Math.random() * list.length)];

      if (!aiClient) {
        return res.json({ success: true, data: randomFallback });
      }

      const prompt = `Tạo 01 câu hỏi trắc nghiệm giáo dục chất lượng cao dành cho học sinh Việt Nam cấp ${gradeTitle}, môn ${sub === 'math' ? 'Toán' : sub === 'vietnamese' ? 'Tiếng Việt' : 'Tiếng Anh'}.
Chủ đề tùy chọn: ${topic || 'toàn diện chương trình'}.
Yêu cầu:
- Độ khó chuẩn xác theo đúng chuẩn năng lực lứa tuổi ${gradeTitle}.
- Có đúng 4 phương án lựa chọn (A, B, C, D).
- 1 đáp án đúng (correctIndex từ 0 đến 3).
- Lời giải thích nhẹ nhàng, dễ hiểu cho trẻ em.
- Gợi ý tư duy ngắn gọn.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Nội dung câu hỏi kèm icon/emoji" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 phương án lựa chọn",
              },
              correctIndex: { type: Type.INTEGER, description: "Vị trí đáp án đúng từ 0 đến 3" },
              explanation: { type: Type.STRING, description: "Lời giải thích cặn kẽ, khích lệ" },
              hint: { type: Type.STRING, description: "Gợi ý tư duy" },
            },
            required: ["question", "options", "correctIndex", "explanation", "hint"],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed.question && Array.isArray(parsed.options) && parsed.options.length >= 2) {
          return res.json({ success: true, data: parsed });
        }
      }

      return res.json({ success: true, data: randomFallback });
    } catch (err: unknown) {
      console.error("Generate Question Error:", err);
      const sub = (req.body?.subject || 'math') as 'math' | 'vietnamese' | 'english';
      const grade = (req.body?.gradeLevel || 'grade_1') as string;
      const list = CURRICULUM_FALLBACKS[sub]?.[grade] || CURRICULUM_FALLBACKS.math.grade_1;
      const randomFallback = list[Math.floor(Math.random() * list.length)];
      return res.json({ success: true, data: randomFallback });
    }
  });

  // Save sync data
  app.post("/api/sync/save", (req, res) => {
    try {
      const { syncCode, payload } = req.body;
      if (!syncCode || !payload) {
        return res.status(400).json({ success: false, message: "Missing syncCode or payload" });
      }
      const code = String(syncCode).trim().toUpperCase();
      syncDatabase[code] = {
        data: payload,
        updatedAt: new Date().toISOString(),
      };
      return res.json({ success: true, code, updatedAt: syncDatabase[code].updatedAt });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Internal Error";
      return res.status(500).json({ success: false, message: msg });
    }
  });

  // Load sync data
  app.get("/api/sync/load/:code", (req, res) => {
    try {
      const code = String(req.params.code).trim().toUpperCase();
      const record = syncDatabase[code];
      if (!record) {
        return res.status(404).json({ success: false, message: "Sync code not found or expired" });
      }
      return res.json({ success: true, data: record.data, updatedAt: record.updatedAt });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Internal Error";
      return res.status(500).json({ success: false, message: msg });
    }
  });

  // Static files in public directory (og-image.jpg, favicon, etc.)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
