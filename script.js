```javascript
const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("status");
const voiceText = document.getElementById("voiceText");

const students = document.querySelectorAll(".student");

const presentCount = document.getElementById("present");
const absentCount = document.getElementById("absent");
const resetBtn = document.getElementById("resetBtn");

let recognition;

// Check browser support
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        statusText.textContent = "🎤 Listening... Say the student's name";
        startBtn.textContent = "🎙️ Listening...";
    };

    recognition.onresult = function (event) {

        const spokenText = event.results[0][0].transcript
            .trim()
            .toLowerCase();

        voiceText.textContent = spokenText;

        markAttendance(spokenText);
    };

    recognition.onerror = function (event) {
        statusText.textContent =
            "❌ Could not recognize voice. Please try again.";

        startBtn.textContent = "🎙️ Start Voice Attendance";

        console.log(event.error);
    };

    recognition.onend = function () {
        startBtn.textContent = "🎙️ Start Voice Attendance";
    };

} else {

    statusText.textContent =
        "Speech recognition is not supported. Please use Google Chrome.";
}


// Start voice recognition
startBtn.addEventListener("click", function () {

    if (recognition) {
        recognition.start();
    }

});


// Mark attendance
function markAttendance(spokenName) {

    let found = false;

    students.forEach(function (student) {

        const studentName =
            student.getAttribute("data-name").toLowerCase();

        const status =
            student.querySelector(".status");

        if (
            spokenName.includes(studentName) ||
            studentName.includes(spokenName)
        ) {

            status.textContent = "Present";
            status.classList.remove("absent");
            status.classList.add("present");

            found = true;

            statusText.textContent =
                "✅ Attendance marked for " +
                student.getAttribute("data-name");

            speak(
                "Attendance marked for " +
                student.getAttribute("data-name")
            );
        }
    });

    if (!found) {

        statusText.textContent =
            "❌ Student not found. Please say the name again.";

        speak("Student not found. Please try again.");
    }

    updateSummary();
}


// Update attendance summary
function updateSummary() {

    let present = 0;
    let absent = 0;

    students.forEach(function (student) {

        const status =
            student.querySelector(".status");

        if (status.classList.contains("present")) {
            present++;
        } else {
            absent++;
        }
    });

    presentCount.textContent = present;
    absentCount.textContent = absent;
}


// Text-to-speech
function speak(message) {

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = "en-IN";
    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
}


// Reset attendance
resetBtn.addEventListener("click", function () {

    students.forEach(function (student) {

        const status =
            student.querySelector(".status");

        status.textContent = "Absent";

        status.classList.remove("present");
        status.classList.add("absent");
    });

    presentCount.textContent = "0";
    absentCount.textContent = students.length;

    voiceText.textContent =
        "Your voice will appear here...";

    statusText.textContent =
        "Attendance has been reset.";

});
```
