# 📚 EduNet

A modern, interactive academic progress and school management dashboard for students, parents, and teachers. This project provides a seamless way to track learning, attendance, results, and more—all in one place!

---

## ✨ Key Features

- Student, Parent, and Teacher dashboards
- Academic progress tracking with charts and insights
- Attendance management and visualization
- Quiz and leaderboard modules
- Announcements and notifications
- Result uploads and reviews
- Responsive, mobile-friendly UI
- Mock data for demo/testing

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Visualization:** Custom CSS/JS charts (no external chart libraries)
- **Storage:** Browser LocalStorage (for mock/demo data)
- **No backend/server required** (static site)

---

## 📁 Folder Structure

```
abr-porashona-main/
├── *.html                # Main pages (dashboard, parent, teacher, etc.)
├── *.js                  # Feature-specific scripts (attendance, results, etc.)
├── *.css                 # Page/component styles
├── .vscode/              # VS Code settings
```

- Each major feature (attendance, results, leaderboard, etc.) has its own HTML, JS, and CSS files.
- No build tools or frameworks—just open the HTML files in your browser!

---

## 🚀 Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/abr-porashona-main.git
   cd abr-porashona-main
   ```
2. **(Optional) Use Live Server:**
   - Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension.
   - Right-click any HTML file and select **"Open with Live Server"** for best experience.

---

## ⚙️ Environment Variables

- **None required.**
- All data is mock/demo and stored in browser LocalStorage.

---

## 🏃 How to Run Locally

1. Open the project folder in VS Code or your favorite editor.
2. Open any HTML file (e.g., `index.html`, `dashboard.html`) in your browser.
3. For best results, use Live Server for auto-reload and local hosting.

---

## 📦 Build & Deployment

- **Static site:** No build step needed.
- To deploy, simply upload the folder to any static hosting (GitHub Pages, Netlify, Vercel, etc.).
- Example (GitHub Pages):
  1. Push to a GitHub repo
  2. Enable Pages in repo settings

---

## 🔌 API Endpoints

- **No backend/API.**
- All logic and data are handled client-side.

---

## 💡 Usage Examples

- **Student:** Track your quiz scores, view your rank, and see your academic progress.
- **Parent:** Monitor your child's attendance, results, and receive school announcements.
- **Teacher:** Upload results, track student progress, and send announcements.

---

## 🖼️ Screenshots

> _Add screenshots of the dashboard, attendance, results, etc. here!_

---

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request with a clear description
5. Follow code style and keep UI/UX consistent

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🚧 Future Improvements

- Add real backend/API integration
- User authentication and roles
- Export/download reports as PDF
- More advanced analytics and charts
- Multi-language support
- Accessibility enhancements

---

## 🏗️ Architecture & Major Components

- **HTML Pages:** Each user type (student, parent, teacher) has dedicated pages.
- **JS Modules:** Each feature (attendance, results, leaderboard, etc.) is modularized in its own JS file.
- **CSS:** Modular, page-specific styles for easy maintenance.
- **Data Flow:** All data is handled in-browser (LocalStorage, mock objects). No server calls.
- **Component Flow:**
  - Navigation/sidebar → Feature page → Dynamic rendering via JS
  - Data visualizations (charts, leaderboards) are generated on the fly

---

Enjoy learning and tracking progress with ABR Porashona! 🎓
