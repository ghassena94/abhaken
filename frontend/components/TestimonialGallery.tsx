import { template } from "uix/html/template.ts";
import Testimonial from "frontend/components/Testimonials.tsx";
import { testimonials } from "frontend/data/Testimonials.ts";

export const TestimonialGallery = template(() => {
  let index = 0;

  const container = document.createElement("div");

  let gallery = document.createElement("div");
  gallery.className = "flex justify-center gap-8 opacity-100 transition-opacity duration-500";
  gallery.id = "testimonialGallery";

  const controls = document.createElement("div");
  controls.className = "flex justify-center gap-4 mt-20";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "◀";
  prevBtn.className = "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300";
  prevBtn.onclick = () => {
    if (index > 0) {
      index--;
    } else {
      index = Math.ceil(testimonials.length / 2) - 1;
    }
    render();
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "▶";
  nextBtn.className = "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300";
  nextBtn.onclick = () => {
    if ((index + 1) * 2 < testimonials.length) {
      index++;
    } else {
      index = 0;
    }
    render();
  };

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  container.appendChild(gallery);
  container.appendChild(controls);

  const render = () => {
    const visible = testimonials.slice(index * 2, index * 2 + 2);

    const newGallery = document.createElement("div");
    newGallery.className = "flex flex-col sm:flex-row justify-center items-center gap-8 opacity-0 transition-opacity duration-700";


    for (const t of visible) {
      const el = <Testimonial {...t} />;
      newGallery.appendChild(el);
    }

    gallery.classList.remove("opacity-100");
    gallery.classList.add("opacity-0");

    setTimeout(() => {
      gallery.replaceWith(newGallery);
      gallery = newGallery;

      setTimeout(() => {
        newGallery.classList.remove("opacity-0");
        newGallery.classList.add("opacity-100");
      }, 10);
    }, 300);
  };

  setInterval(() => {
    index = (index + 1) % Math.ceil(testimonials.length / 2);
    render();
  }, 8000);

  setTimeout(render, 10);

  return container;
});