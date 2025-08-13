import { template } from "uix/html/template.ts";
import { plans_data_type } from "frontend/types.tsx";

const PricingCard = template<{ plan: plans_data_type }>(({ plan }) => (
  <div class={`shadow-2xl rounded-4xl transition-all duration-300 h-[540px] w-[350px] ${plan.selected ? 'bg-indigo-500 scale-105' : 'bg-white '}`}>
    <h4 class={`mt-10 ml-10 font-bold text-[24px] ${plan.selected ? 'text-white' : 'text-black'}`}>{plan.title}</h4>
    {plan.price !== "Custom" ?
      <div class={`text-[48px] font-bold ml-10 ${plan.selected ? 'text-white' : 'text-black'}`} >
        €{plan.price}<span class={`text-base font-normal ${plan.selected ? 'text-white' : 'text-gray-500'}`} >/{plan.per}</span>
      </div>
      :
      <div class={`text-[48px] font-bold text-black ml-10 ${plan.selected ? 'text-white' : 'text-black'}`}>Custom</div>
    }
    <div class="w-[330px]">
      <p class={`ml-10 ${plan.selected ? 'text-white' : 'text-gray-500'}`} >{plan.content}</p>
    </div>
    <ul class="ml-10 mt-5">
      {plan.features.map((feature) => (
        <li class="flex items-start">
          <img src={plan.selected ? ".././images/homepage/icon_08.svg" : ".././images/homepage/icon_07.svg"} alt="haken" class="w-4 h-4 mt-4" />
          <span class={`mt-3 ml-4 ${plan.selected ? 'text-white' : 'text-black'}`} >{feature}</span>
        </li>
      ))}
    </ul>
    <div class="flex justify-center mt-6 ">
      <button type="button"
        class={`w-[300px] rounded-4xl text-center font-semibold py-4 transition-none duration-500 hover:transition-all hover:scale-105 ${plan.selected ? 'text-indigo-600 bg-white mt-3' : 'bg-indigo-500 text-white border border-gray-300'}`}
      >
        {plan.price === "Custom" ? "Contact sales" : "Get started"}
      </button>
    </div>
  </div>
));

export default PricingCard;