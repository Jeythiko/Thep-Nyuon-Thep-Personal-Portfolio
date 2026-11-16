
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#primary-navigation");

    

    // Mobile navigation.
    function closeNavigation() {
        navigation?.classList.remove("is-open");
        menuToggle?.setAttribute("aria-expanded", "false");
    }

    menuToggle?.addEventListener("click", () => {
        const isOpen = navigation?.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    });

    navigation?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeNavigation();
        }
    });

   
    // Update the footer year if the element exists.
    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    setAuthMode("login");
    refreshCurrentUser();

    console.log("Jeythiko frontend connected to the backend API.");
});
