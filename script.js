// ========================================
// DAILY PLANNER
// ========================================

// ========================================
// TASKS
// ========================================

const tasks = {
    IELTS: [
        "Listening — Full Practice Test",
        "Reading — Full Practice Test",
        "Writing Task 1",
        "Writing Task 2",
        "Speaking Part 1",
        "Speaking Part 2",
        "Speaking Part 3",
        "Learn 15 new vocabulary words",
        "Review IELTS mistakes",
        "Listening Podcast — 15–20 min"
    ],

    SAT: [
        "SAT Math — Practice",
        "SAT Reading — Practice",
        "SAT Writing — Practice",
        "Learn 10–15 SAT vocabulary words",
        "Review mistakes",
        "Bluebook Practice",
        "Khan Academy SAT"
    ],

    ORT: [
        "Кыргыз тили — грамматиканы кайталоо",
        "Кыргыз тили — жаңы сөздөрдү үйрөнүү",
        "Кыргыз тили — ОРТ боюнча тапшырмалар",
        "Математика — 20 тапшырма чыгаруу",
        "Математика — формулаларды кайталоо",
        "Математика — татаал тапшырмаларды чыгаруу",
        "ОРТ — пробный тест",
        "ОРТ — каталарды талдоо"
    ],

    School: [
        "Complete today's homework",
        "Review today's lessons",
        "Prepare for tomorrow",
        "Review difficult topics",
        "Read school materials",
        "Pack school bag"
    ],

    Coding: [
        "Practice HTML",
        "Practice CSS",
        "Practice JavaScript",
        "Work on Daily Planner",
        "Work on Englify",
        "Learn something new"
    ],

    Personal: [
        "Read a book",
        "Clean my room",
        "Drink enough water",
        "Spend time with family",
        "Plan tomorrow",
        "Take some rest"
    ]
};


// ========================================
// RESOURCES
// ========================================

const resources = {
    IELTS: [
        {
            name: "IELTS Official",
            url: "https://ielts.org/"
        },
        {
            name: "IELTS Liz",
            url: "https://www.ieltsliz.com/"
        }
    ],

    SAT: [
        {
            name: "Khan Academy SAT",
            url: "https://www.khanacademy.org/test-prep/sat"
        },
        {
            name: "Bluebook",
            url: "https://bluebook.collegeboard.org/"
        }
    ],

    ORT: [
        {
            name: "iBilim — Кыргыз тили",
            url: "https://ibilim.kg/"
        },
        {
            name: "MathProfi — Математика",
            url: "https://mathprofi.ru/"
        }
    ],

    School: [
        {
            name: "Khan Academy",
            url: "https://www.khanacademy.org/"
        }
    ],

    Coding: [
        {
            name: "JavaScript.info",
            url: "https://javascript.info/"
        },
        {
            name: "MDN Web Docs",
            url: "https://developer.mozilla.org/"
        }
    ],

    Personal: []
};


// ========================================
// VARIABLES
// ========================================

let currentCategory = null;

let savedTasks =
    JSON.parse(localStorage.getItem("dailyPlannerTasks")) || {};


// ========================================
// PREPARE TASKS
// ========================================

function prepareTasks() {

    Object.keys(tasks).forEach(category => {

        if (!savedTasks[category]) {
            savedTasks[category] = [];
        }

        tasks[category].forEach((taskName, index) => {

            const existingTask =
                savedTasks[category].find(
                    task => task.id === index
                );

            if (!existingTask) {

                savedTasks[category].push({
                    id: index,
                    text: taskName,
                    completed: false
                });

            }

        });

    });

    saveData();
}


// ========================================
// SAVE TASKS
// ========================================

function saveData() {

    localStorage.setItem(
        "dailyPlannerTasks",
        JSON.stringify(savedTasks)
    );
}


// ========================================
// OPEN CATEGORY
// ========================================

function openCategory(category) {

    currentCategory = category;

    const modal =
        document.getElementById("taskModal");

    const title =
        document.getElementById("modalTitle");

    const description =
        document.getElementById("modalDescription");

    const descriptions = {

        IELTS: "English preparation",

        SAT: "Math & Reading/Writing",

        ORT: "Кыргыз тили & Математика",

        School: "School homework",

        Coding: "Programming & projects",

        Personal: "Personal goals"

    };

    title.textContent = category;

    description.textContent =
        descriptions[category] || "Your tasks for today";

    renderTasks();

    renderResources();

    updateModalProgress();

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


// ========================================
// CLOSE CATEGORY
// ========================================

function closeCategory() {

    const modal =
        document.getElementById("taskModal");

    modal.classList.remove("active");

    document.body.style.overflow = "";

    currentCategory = null;
}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    if (!currentCategory) {
        return;
    }

    const categoryTasks =
        savedTasks[currentCategory] || [];


    categoryTasks.forEach(task => {

        const taskItem =
            document.createElement("div");

        taskItem.className = "task-item";


        if (task.completed) {
            taskItem.classList.add("completed");
        }


        taskItem.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>
        `;


        const checkbox =
            taskItem.querySelector(".task-checkbox");


        checkbox.addEventListener("change", () => {

            task.completed =
                checkbox.checked;

            saveData();

            renderTasks();

            updateModalProgress();

            updateAllProgress();

            updateOverallProgress();

        });


        taskList.appendChild(taskItem);

    });
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ========================================
// MODAL PROGRESS
// ========================================

function updateModalProgress() {

    if (!currentCategory) {
        return;
    }

    const categoryTasks =
        savedTasks[currentCategory] || [];

    const total =
        categoryTasks.length;

    const completed =
        categoryTasks.filter(
            task => task.completed
        ).length;


    let percent = 0;


    if (total > 0) {

        percent =
            Math.round(
                (completed / total) * 100
            );

    }


    const progressText =
        document.getElementById("modalProgress");

    const progressFill =
        document.getElementById("modalProgressFill");


    if (progressText) {

        progressText.textContent =
            `${percent}%`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${percent}%`;

    }
}


// ========================================
// CATEGORY PROGRESS
// ========================================

function updateCategoryProgress(
    category,
    elementId
) {

    const categoryTasks =
        savedTasks[category] || [];

    const total =
        categoryTasks.length;

    const completed =
        categoryTasks.filter(
            task => task.completed
        ).length;


    const element =
        document.getElementById(elementId);


    if (!element) {
        return;
    }


    element.textContent =
        `${completed} / ${total} completed`;
}


// ========================================
// UPDATE ALL CATEGORY PROGRESS
// ========================================

function updateAllProgress() {

    updateCategoryProgress(
        "IELTS",
        "ieltsProgress"
    );

    updateCategoryProgress(
        "SAT",
        "satProgress"
    );

    updateCategoryProgress(
        "ORT",
        "ortProgress"
    );

    updateCategoryProgress(
        "School",
        "schoolProgress"
    );

    updateCategoryProgress(
        "Coding",
        "codingProgress"
    );

    updateCategoryProgress(
        "Personal",
        "personalProgress"
    );
}


// ========================================
// OVERALL PROGRESS
// MY DAY + ALL TASKS
// ========================================

function updateOverallProgress() {

    let totalItems = 0;

    let completedItems = 0;


    // ====================================
    // MY DAY
    // ====================================

    const routineCheckboxes =
        document.querySelectorAll(".routine-check");


    totalItems +=
        routineCheckboxes.length;


    routineCheckboxes.forEach(checkbox => {

        if (checkbox.checked) {

            completedItems++;

        }

    });


    // ====================================
    // ALL STUDY TASKS
    // ====================================

    Object.keys(savedTasks).forEach(category => {

        const categoryTasks =
            savedTasks[category] || [];


        totalItems +=
            categoryTasks.length;


        categoryTasks.forEach(task => {

            if (task.completed) {

                completedItems++;

            }

        });

    });


    // ====================================
    // CALCULATE PERCENT
    // ====================================

    let percent = 0;


    if (totalItems > 0) {

        percent =
            Math.round(
                (completedItems / totalItems) * 100
            );

    }


    // ====================================
    // UPDATE PROGRESS BAR
    // ====================================

    const progressBar =
        document.getElementById(
            "overallProgressBar"
        );


    const progressText =
        document.getElementById(
            "overallProgressText"
        );


    if (progressBar) {

        progressBar.style.width =
            `${percent}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${percent}%`;

    }
}


// ========================================
// ADD NEW TASK
// ========================================

function addTask() {

    const input =
        document.getElementById("newTask");


    const text =
        input.value.trim();


    if (!text || !currentCategory) {

        return;

    }


    const categoryTasks =
        savedTasks[currentCategory];


    categoryTasks.push({

        id: Date.now(),

        text: text,

        completed: false

    });


    saveData();


    input.value = "";


    renderTasks();

    updateModalProgress();

    updateAllProgress();

    updateOverallProgress();
}


// ========================================
// RESOURCES
// ========================================

function renderResources() {

    const container =
        document.getElementById(
            "resourcesList"
        );


    container.innerHTML = "";


    if (!currentCategory) {

        return;

    }


    const categoryResources =
        resources[currentCategory] || [];


    categoryResources.forEach(resource => {

        const card =
            document.createElement("a");


        card.className =
            "resource-card";


        card.href =
            resource.url;


        card.target =
            "_blank";


        card.rel =
            "noopener noreferrer";


        card.innerHTML = `
            <span>🔗</span>

            <div>
                <strong>
                    ${escapeHTML(resource.name)}
                </strong>

                <small>
                    Open resource →
                </small>
            </div>
        `;


        container.appendChild(card);

    });
}


// ========================================
// MY DAY — LOAD
// ========================================

function loadRoutine() {

    const savedRoutine =
        JSON.parse(
            localStorage.getItem(
                "dailyPlannerRoutine"
            )
        ) || [];


    const checkboxes =
        document.querySelectorAll(
            ".routine-check"
        );


    checkboxes.forEach(
        (checkbox, index) => {

            checkbox.checked =
                savedRoutine[index] || false;


            checkbox.addEventListener(
                "change",
                () => {

                    saveRoutine();

                    updateOverallProgress();

                }
            );

        }
    );
}


// ========================================
// MY DAY — SAVE
// ========================================

function saveRoutine() {

    const checkboxes =
        document.querySelectorAll(
            ".routine-check"
        );


    const routine =
        Array.from(checkboxes).map(
            checkbox =>
                checkbox.checked
        );


    localStorage.setItem(
        "dailyPlannerRoutine",
        JSON.stringify(routine)
    );


    updateOverallProgress();
}


// ========================================
// CURRENT DATE
// ========================================

function updateCurrentDate() {

    const dateElement =
        document.getElementById(
            "currentDate"
        );


    const today =
        new Date();


    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    };


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );
}


// ========================================
// CALENDAR
// ========================================

let calendarDate =
    new Date();


function changeMonth(direction) {

    calendarDate.setMonth(
        calendarDate.getMonth() + direction
    );


    renderCalendar();
}


function renderCalendar() {

    const monthElement =
        document.getElementById(
            "calendarMonth"
        );


    const daysElement =
        document.getElementById(
            "calendarDays"
        );


    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    const monthName =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    monthElement.textContent =
        monthName;


    daysElement.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    let startDay =
        firstDay.getDay();


    startDay =
        startDay === 0
            ? 6
            : startDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const today =
        new Date();


    // Empty cells

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement("span");


        empty.className =
            "calendar-empty";


        daysElement.appendChild(
            empty
        );

    }


    // Days

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement("span");


        dayElement.textContent =
            day;


        if (

            day === today.getDate() &&

            month === today.getMonth() &&

            year === today.getFullYear()

        ) {

            dayElement.classList.add(
                "today"
            );

        }


        daysElement.appendChild(
            dayElement
        );

    }
}


// ========================================
// MODAL CLICK OUTSIDE
// ========================================

const modal =
    document.getElementById(
        "taskModal"
    );


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {

            closeCategory();

        }

    }
);


// ========================================
// ESCAPE CLOSE
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCategory();

        }

    }
);


// ========================================
// ENTER TO ADD TASK
// ========================================

document
    .getElementById("newTask")
    .addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addTask();

            }

        }
    );


// ========================================
// START APPLICATION
// ========================================

prepareTasks();

updateCurrentDate();

renderCalendar();

loadRoutine();

updateAllProgress();

updateOverallProgress();