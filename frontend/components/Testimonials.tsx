import { template } from "uix/html/template.ts";

const Testimonial = template<{
  rating: number;
  statement: string;
  avatar: string;
  name: string;
  role: string;
}>(({ rating, statement, avatar, name, role }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <svg
      class={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
    </svg>

  ));

  return (
    <div class="h-full w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 ml-6 mr-6 flex flex-col">

      <div class="flex justify-left mb-4 mt-2">{stars}</div>

      <p class="text-[#6B7280] text-[20px] mt-2 text-left">"{statement}"</p>

      <div class="mt-4 flex items-center gap-4 justify-start">
        <img src={avatar} alt={name} class="w-10 h-10 rounded-full" />
        <div class="flex flex-col justify-center">
          <h4 class="font-bold text-[20px]">{name}</h4>
          <p class="text-gray-500 text-[16px] text-left justify-start">{role}</p>
        </div>
      </div>

    </div>
  );

});

export default Testimonial;