import Hero from "@/components/sections/Hero";
import ServiceHighlight from "@/components/sections/ServiceHighlight";
import Stats from "@/components/sections/Stats";
import GalleryPreview from "@/components/sections/GalleryPreview";
import InstagramFeed from "@/components/sections/InstagramFeed";
import GoogleReviews from "@/components/sections/GoogleReviews";
import TeamProfiles from "@/components/sections/TeamProfiles";
import FAQ from "@/components/sections/FAQ";
import StylistsChoice from "@/components/sections/StylistsChoice";
import CallToAction from "@/components/sections/CallToAction";
import BespokePricing from "@/components/sections/BespokePricing";
import MembershipTiers from "@/components/sections/MembershipTiers";
import ProductShowcase from "@/components/sections/ProductShowcase";
import DiscoveryExperience from "@/components/sections/DiscoveryExperience";
import EditorialLookBook from "@/components/sections/EditorialLookBook";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Stats />
      <StylistsChoice />
      <ServiceHighlight />
      <BespokePricing />
      <MembershipTiers />
      <ProductShowcase />
      <DiscoveryExperience />
      <EditorialLookBook />
      <GalleryPreview />
      <InstagramFeed />
      <TeamProfiles />
      <GoogleReviews />
      <FAQ />
      <CallToAction />
    </div>
  );
}
