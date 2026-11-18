
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       1. MOBILE NAVIGATION
       ========================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#primary-navigation");

    function closeNavigation() {
        navigation?.classList.remove("is-open");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation menu");
    }

    menuToggle?.addEventListener("click", () => {
        const isOpen = navigation?.classList.toggle("is-open") ?? false;

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
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


    /* =========================================================
       2. DARK MODE
       ========================================================= */

    const themeToggle = document.querySelector(".theme-toggle");
    const rootElement = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    const lightThemeColor = "#e8f4fa";
    const darkThemeColor = "#101820";
    const storageKey = "jeythiko-theme";

    function getSavedTheme() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch (error) {
            // The theme still works for this page view if storage is unavailable.
        }
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";

        rootElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );

        if (themeToggle) {
            themeToggle.textContent = isDark ? "☀️" : "🌙";

            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

            themeToggle.setAttribute("aria-pressed", String(isDark));

            themeToggle.setAttribute(
                "title",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute(
                "content",
                isDark ? darkThemeColor : lightThemeColor
            );
        }
    }

    const savedTheme = getSavedTheme();

    const prefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
    ).matches ?? false;

    applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

    themeToggle?.addEventListener("click", () => {
        const currentTheme = rootElement.getAttribute("data-theme");

        const nextTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);
        saveTheme(nextTheme);
    });


    /* =========================================================
       3. READING LIBRARY: BOOK PREVIEW
       ========================================================= */

    const previewDialog = document.querySelector(
        "#book-preview-dialog"
    );

    const previewFrame = document.querySelector(
        "#book-preview-frame"
    );

    const closePreviewButton = document.querySelector(
        ".close-book-preview"
    );

    function clearBookPreview() {
        if (previewFrame) {
            previewFrame.src = "about:blank";
        }
    }

    document.querySelectorAll(".book-preview-trigger").forEach((button) => {
        button.addEventListener("click", () => {
            const previewUrl = button.dataset.preview;

            if (!previewUrl || !previewDialog || !previewFrame) {
                return;
            }

            if (typeof previewDialog.showModal !== "function") {
                window.open(
                    previewUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

                return;
            }

            previewFrame.src = previewUrl;
            previewDialog.showModal();
        });
    });

    closePreviewButton?.addEventListener("click", () => {
        previewDialog?.close();
    });

    previewDialog?.addEventListener("click", (event) => {
        if (event.target === previewDialog) {
            previewDialog.close();
        }
    });

    previewDialog?.addEventListener("close", clearBookPreview);


    /* =========================================================
       4. FOOTER YEAR
       ========================================================= */

    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================================================
       5. CONTACT FORM
       ========================================================= */

    const contactForm = document.querySelector("#contact-form");

    const contactFeedback = document.querySelector(
        "#contact-feedback"
    );

    contactForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        const originalButtonText =
            submitButton?.textContent ?? "Send Message";

        const formData = new FormData(contactForm);

        const message = {
            name: String(formData.get("name") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
            subject: String(formData.get("subject") ?? "").trim(),
            message: String(formData.get("message") ?? "").trim()
        };

        if (contactFeedback) {
            contactFeedback.textContent = "Sending your message...";
            contactFeedback.className = "form-feedback";
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(message)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message ||
                    "Your message could not be sent. Please try again."
                );
            }

            if (contactFeedback) {
                contactFeedback.textContent =
                    result.message ||
                    "Your message has been sent successfully. Thank you!";

                contactFeedback.classList.add("success");
            }

            contactForm.reset();

        } catch (error) {
            if (contactFeedback) {
                contactFeedback.textContent =
                    error.message ||
                    "A network error occurred. Please try again.";

                contactFeedback.classList.add("error");
            }

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });


    /* =========================================================
       6. INITIALIZATION
       ========================================================= */

    console.log("Jeythiko portfolio frontend initialized.");

});
