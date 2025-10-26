// script.js

// --- Email Content Logic for email ---
        function sendMail(event) {
  event.preventDefault();

  emailjs.init("lpkyl-d6MFd9J2cej"); // <-- Replace with your real public key

  const parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    service: document.getElementById("service").value,
    whatapp: document.getElementById("contact_number").value,
  };

  emailjs.send("service_wy4z2as", "template_0z1c9br", parms)
    .then(() => {
      alert("✅ Email Sent Successfully!");
      document.querySelector("form").reset();
    })
    .catch((err) => {
      console.error("❌ EmailJS Error:", err);
      alert("Failed to send email. Please try again later.");
    });
}
/*
// --- Prefill Email Content Logic ---
        function prefillEmail(event) {
            // Prevent the default form submission for a moment so we can construct the new URL
            event.preventDefault();

            const form = event.target;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const query = document.getElementById('service').value;

            // Construct the email body
            const subject = encodeURIComponent(`Estimate Request from ${name}`);
            const body = encodeURIComponent(`
Name: ${name}
Reply Email: ${email}
---
Service Query:
${query}
---
(If you are sending files for printing, please attach them to this email now.)
            `.trim());

            // Construct the final Gmail URL with all parameters
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=shipmyp@gmail.com&su=${subject}&body=${body}`;

            // Open the new URL in a new tab
            window.open(gmailUrl, '_blank');
            
            // Optionally, reset the form after sending the request to the new window
            form.reset();
            
            // Reset: Hide the file attachment warning box for the next use.
            document.getElementById('file-warning-box').classList.add('hidden');
        } */
// --- Single-Page Navigation Logic ---
function navigateTo(targetId) {
  // Hide all sections and reset scroll
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => {
    section.classList.add('hidden');
    //section.scrollTop = 0; // Reset scroll position for hidden content
  });

  // Remove 'active' class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show the target section and set 'active' class on its link
  const targetSection = document.getElementById(targetId);
  const targetLink = document.getElementById(`nav-${targetId}`);
  const pageContainer = document.querySelector('.page-container'); // Get the scrolling container

  if (targetSection) {
    targetSection.classList.remove('hidden');
       // CRITICAL: Reset the scroll position of the main content container

    if (pageContainer) {

        pageContainer.scrollTop = 0;

    }
  }
  if (targetLink) {
    targetLink.classList.add('active');
  }

  // Ensure the page container remains hidden on initial load until the navigation logic runs
  document.querySelector('.page-container').classList.remove('hidden');
}

// --- Pop-up Control Logic for Service Cards (Centered on Card) ---
const popup = document.getElementById('service-popup');
const popupTitle = document.getElementById('popup-content-title');
const popupDetails = document.getElementById('popup-content-details');
let hideTimeout;

function showPopup(card) {
    // Clear any pending hide operation
    clearTimeout(hideTimeout); 

    const title = card.dataset.title;
    const details = card.dataset.details;
    const cardRect = card.getBoundingClientRect(); // Get card position and size
    
    // Populate content
    popupTitle.innerHTML = title;
    popupDetails.innerHTML = details;
    
    // 1. Make the popup visible so its content is rendered and its size can be correctly positioned.
    popup.classList.remove('hidden');
    
    // Calculate new position - Center on the card
    // Horizontal center position of the card
    const newLeft = cardRect.left + (cardRect.width / 2); 
    // Vertical center position of the card
    const newTop = cardRect.top + (cardRect.height / 2); 

    // Apply position styles
    popup.style.left = `${newLeft}px`;
    popup.style.top = `${newTop}px`;
    
    // Use translate(-50%, -50%) to shift the pop-up back by half its own width and height, 
    // making the pop-up's center perfectly align with the card's center (newLeft, newTop).
    popup.style.transform = 'translate(-50%, -50%)';
    
    // Restore body scroll 
    //document.body.style.overflow = ''; 

    // Activate the fade-in transition
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
}

function hidePopup() {
    // Set a small delay before hiding to prevent flickering on quick mouse movements
    hideTimeout = setTimeout(() => {
        popup.classList.remove('active');
        // Hide completely after the fade-out transition completes (300ms defined in CSS)
       /* setTimeout(() => {
             if (!popup.classList.contains('active')) {
                popup.classList.add('hidden');
            }
        }, 300); */
    }, 50);
}


// --- Initialization and Event Listeners ---
window.onload = function () {
  // Initialize Lucide
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 1. Determine initial page based on hash, default to 'home'
  const initialPage = window.location.hash.substring(1) || 'home';
  navigateTo(initialPage);

  // 2. Listen for hash changes (back/forward browser buttons)
  window.addEventListener('hashchange', () => {
    const newPage = window.location.hash.substring(1);
    if (newPage) navigateTo(newPage);
  });

  // 3. Attach click listeners to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function () {
      const targetId = this.getAttribute('href').substring(1);
      if (targetId) window.location.hash = targetId;

      // Close the mobile menu if it's open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    });
  });
  /*
  // 4. Attach mouse listeners to Service Cards for pop-up
  document.querySelectorAll('.service-card-minimized').forEach(card => {
    card.addEventListener('mouseenter', () => showPopup(card));
    card.addEventListener('mouseleave', hidePopup);
  });
*/

// --- Click-to-Open Popup Logic ---
document.querySelectorAll('.service-card-minimized').forEach(card => {
  card.addEventListener('click', () => showPopup(card));
});

// --- Close Button Logic ---
const popupCloseBtn = document.getElementById('popup-close-btn');
if (popupCloseBtn) {
  popupCloseBtn.addEventListener('click', () => {
    popup.classList.remove('active');
    setTimeout(() => popup.classList.add('hidden'), 300);
  });
}

  // 5. Allow interaction with the popup itself (preventing hide when mousing over it)
  popup.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
  popup.addEventListener('mouseleave', hidePopup);
};

// Scroll-to-top button visibility and behavior
const scrollBtn = document.getElementById('scrollTopBtn');
  scrollBtn.classList.add('hidden');

// --- Rate Calculator Logic ---
const couriers = [
  { name: "UPS", base: 50, perKm: 0.3, perKg: 8 },
  { name: "Purolator", base: 45, perKm: 0.35, perKg: 7.5 },
  { name: "FedEx", base: 55, perKm: 0.25, perKg: 8.5 },
  { name: "DHL", base: 60, perKm: 0.2, perKg: 9 },
  { name: "Amazon", base: 40, perKm: 0.4, perKg: 7 },
];

// Simulated distance using PIN difference (placeholder for future API)
function getDistanceKm(pickup, delivery) {
  const a = parseInt(pickup.replace(/\D/g, "")) || 1000;
  const b = parseInt(delivery.replace(/\D/g, "")) || 2000;
  const diff = Math.abs(a - b);
  return Math.max(10, Math.min(1500, diff / 10_000));
}

// Calculate rates
function calculateRates() {
  const pickup = document.getElementById("pickupPin").value.trim();
  const delivery = document.getElementById("deliveryPin").value.trim();
  const weight = parseFloat(document.getElementById("weight").value.trim());

  if (!pickup || !delivery || !weight || weight <= 0) {
    alert("Please enter valid PIN codes and weight.");
    return;
  }

  const distance = getDistanceKm(pickup, delivery);
  const tableBody = document.getElementById("rateTable");
  tableBody.innerHTML = "";

  couriers.forEach(courier => {
    const cost = courier.base + courier.perKm * distance + courier.perKg * weight;
    const row = `<tr>
      <td class="py-2 px-2 font-medium">${courier.name}</td>
      <td class="py-2 px-2">${cost.toFixed(2)}</td>
    </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  document.getElementById("calcResults").classList.remove("hidden");
}

// Event
document.getElementById("calcBtn").addEventListener("click", calculateRates);


/*
document.querySelectorAll(".service-card-minimized").forEach(card => {
  card.addEventListener("mouseenter", e => {
    popupTitle.textContent = card.dataset.title;
    popupDetails.textContent = card.dataset.details;

    const rect = card.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
    popup.classList.add("active");
  });

  card.addEventListener("mouseleave", () => {
    setTimeout(() => popup.classList.remove("active"), 100);
  });
});

popupCloseBtn.addEventListener("click", () => popup.classList.remove("active"));

*/
