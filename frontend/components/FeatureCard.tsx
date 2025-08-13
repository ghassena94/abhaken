import { template } from "uix/html/template.ts";
import { FeatureCardProps } from "frontend/types.tsx";

const FeatureCard = template<{ featuresdata: FeatureCardProps }>(({ featuresdata }) => (
  <div class="w-full  h-full bg-white rounded-3xl shadow-2xl p-6 feature-card">
    <div class="mt-1">
      <img src={featuresdata.icon}></img>
    </div>

    <h4 class="font-bold text-[26px] mt-2">{featuresdata.title}</h4>
    <p class="text-[#6B7280] text-lg mt-2">{featuresdata.content}</p>
  </div>
));


export default FeatureCard;