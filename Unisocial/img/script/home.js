document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".expand-btn").forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.parentElement.getAttribute("data-target");
            const section = document.getElementById(targetId);

            // Toggle visibility
            if (section.style.display === "block") {
                section.style.display = "none";
            } else {
                section.style.display = "block";
            }
        });
    });
});

