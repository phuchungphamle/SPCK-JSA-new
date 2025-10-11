document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    let isExpanded = false;

    // Toggle sidebar on click (outside nav links)
    sidebar.addEventListener("click", (e) => {
        if (!e.target.closest(".nav-link") && !e.target.closest(".popup-modal")) {
            isExpanded = !isExpanded;
            sidebar.classList.toggle("expanded", isExpanded);
            updateLayout();
        }
    });

    // Expand on hover
    sidebar.addEventListener("mouseenter", () => {
        sidebar.classList.add("expanded");
        updateLayout();
    });

    // Collapse on mouse leave if not locked
    sidebar.addEventListener("mouseleave", () => {
        if (!isExpanded) {
            sidebar.classList.remove("expanded");
            updateLayout();
        }
    });

    // Popup handling for Create link
    const createLink = sidebar.querySelector(".create-link");
    const popupModal = sidebar.querySelector(".popup-modal");
    createLink.addEventListener("mouseenter", () => {
        if (sidebar.classList.contains("expanded")) {
            popupModal.style.display = "block";
        }
    });

    createLink.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!popupModal.matches(":hover")) popupModal.style.display = "none";
        }, 200);
    });

    popupModal.addEventListener("mouseenter", () => popupModal.style.display = "block");
    popupModal.addEventListener("mouseleave", () => popupModal.style.display = "none");

    // Update layout for content and header
    const updateLayout = () => {
        const content = document.querySelector(".content");
        const header = document.querySelector(".header");
        const leftOffset = sidebar.classList.contains("expanded") ? "240px" : "80px";
        if (content) content.style.marginLeft = leftOffset;
        if (header) header.style.left = leftOffset;
    };

    // Initial layout setup
    updateLayout();

    // Mobile toggle button (optional enhancement)
    const toggleButton = document.createElement("button");
    toggleButton.className = "btn btn-primary d-lg-none position-fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.left = "10px";
    toggleButton.innerHTML = '<i class="fa fa-bars"></i>';
    toggleButton.addEventListener("click", () => {
        isExpanded = !isExpanded;
        sidebar.classList.toggle("expanded", isExpanded);
        updateLayout();
    });
    document.body.appendChild(toggleButton);
});